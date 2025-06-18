import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanBarcode, Camera, X } from "lucide-react";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export const BarcodeScanner = ({ onBarcodeScanned }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize the code reader when component mounts
    if (!codeReaderRef.current) {
      console.log('Initializing BrowserMultiFormatReader...');
      codeReaderRef.current = new BrowserMultiFormatReader();
    }
    
    return () => {
      // Cleanup when component unmounts
      stopCamera();
      if (codeReaderRef.current) {
        console.log('Cleaning up BrowserMultiFormatReader...');
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setHasPermission(result.state === 'granted');
      return result.state === 'granted';
    } catch (error) {
      console.log('Permission API not supported, will try direct access');
      return null;
    }
  };

  const startCamera = async () => {
    console.log('Starting camera scanner...');
    setIsScanning(true);
    setError("");
    
    try {
      // Check camera permission first
      await checkCameraPermission();

      if (!videoRef.current) {
        throw new Error("Video element not available");
      }

      // Request camera access
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };

      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      // Set video source
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      console.log('Camera stream started, initializing barcode reader...');

      // Wait for video to be ready
      await new Promise((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => resolve(true);
        }
      });

      // Ensure code reader is initialized
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      // Start continuous decoding
      console.log('Starting barcode detection...');
      codeReaderRef.current.decodeFromVideoElement(
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log('Barcode detected:', result.getText());
            onBarcodeScanned(result.getText());
            stopCamera();
            setIsOpen(false);
          }
          if (error && !(error instanceof NotFoundException)) {
            console.error('Decode error:', error);
          }
        }
      );

      console.log('Camera scanner started successfully');
      setHasPermission(true);

    } catch (err) {
      console.error('Camera scanning error:', err);
      setIsScanning(false);
      
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            setError("Camera access denied. Please allow camera permissions and try again.");
            setHasPermission(false);
            break;
          case 'NotFoundError':
            setError("No camera found on this device.");
            break;
          case 'NotReadableError':
            setError("Camera is already in use by another application.");
            break;
          case 'OverconstrainedError':
            setError("Camera constraints could not be satisfied.");
            break;
          default:
            setError(`Camera error: ${err.message}`);
        }
      } else {
        setError(`Scanner error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera scanner...');
    
    // Stop the video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Reset code reader
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }

    setIsScanning(false);
    setError("");
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim());
      setManualBarcode("");
      setIsOpen(false);
    }
  };

  const simulateScan = (barcode: string) => {
    onBarcodeScanned(barcode);
    setIsOpen(false);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && isScanning) {
      stopCamera();
    }
    setIsOpen(open);
    setError("");
    setManualBarcode("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ScanBarcode className="h-4 w-4" />
          Scan Barcode
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Product Barcode</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Camera Scanner */}
          <div className="space-y-2">
            <Label>Camera Scanner</Label>
            {!isScanning ? (
              <div className="space-y-2">
                <Button 
                  onClick={startCamera}
                  className="w-full flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Start Camera Scanner
                </Button>
                {hasPermission === false && (
                  <p className="text-sm text-amber-600">
                    Camera permission is required. Please enable it in your browser settings.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-48 object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
                  <div className="absolute inset-0 border-2 border-white border-dashed m-4 rounded-lg opacity-50"></div>
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={stopCamera}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm text-center bg-black bg-opacity-50 rounded px-2 py-1">
                      Position the barcode within the frame
                    </p>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
                <div className="mt-2 space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setError("")}
                  >
                    Dismiss
                  </Button>
                  {hasPermission === false && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => window.location.reload()}
                    >
                      Refresh Page
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 border-t"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Manual Entry */}
          <div className="space-y-2">
            <Label htmlFor="manual-barcode">Enter Barcode Manually</Label>
            <div className="flex gap-2">
              <Input
                id="manual-barcode"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode number"
                onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              />
              <Button onClick={handleManualSubmit} disabled={!manualBarcode.trim()}>
                Add
              </Button>
            </div>
          </div>

          {/* Demo/Testing */}
          <div className="space-y-2">
            <Label>Test with Sample Barcodes</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => simulateScan('123456789012')}
              >
                Sample 1
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => simulateScan('987654321098')}
              >
                Sample 2
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Use these sample barcodes to test the functionality
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};