
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanBarcode, X } from "lucide-react";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export const BarcodeScanner = ({ onBarcodeScanned }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef<boolean>(false);

  // Auto-start camera when dialog opens
  useEffect(() => {
    if (isOpen && !isScanning) {
      startCamera();
    } else if (!isOpen && isScanning) {
      stopCamera();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startCamera = async () => {
    console.log('Starting camera scanner...');
    setIsScanning(true);
    setError("");
    setScanStatus("Initializing camera...");
    
    try {
      if (!videoRef.current) {
        throw new Error("Video element not available");
      }

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      };

      console.log('Requesting camera access...');
      setScanStatus("Requesting camera access...");
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      videoRef.current.srcObject = stream;
      
      await new Promise((resolve, reject) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(resolve).catch(reject);
          };
          videoRef.current.onerror = reject;
        }
      });

      setScanStatus("Camera ready, starting barcode detection...");
      console.log('Camera stream started, initializing barcode reader...');

      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      scanningRef.current = true;
      startContinuousScanning();

      setScanStatus("Scanning... Point camera at barcode");
      console.log('Camera scanner started successfully');

    } catch (err) {
      console.error('Camera scanning error:', err);
      setIsScanning(false);
      setScanStatus("");
      
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            setError("Camera access denied. Please allow camera permissions and try again.");
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

  const startContinuousScanning = () => {
    if (!codeReaderRef.current || !videoRef.current || !scanningRef.current) {
      return;
    }

    const scanFrame = async () => {
      if (!scanningRef.current || !codeReaderRef.current || !videoRef.current) {
        return;
      }

      try {
        const result = await codeReaderRef.current.decodeFromVideoElement(videoRef.current);
        if (result && scanningRef.current) {
          console.log('Barcode detected:', result.getText());
          setScanStatus(`Found: ${result.getText()}`);
          onBarcodeScanned(result.getText());
          stopCamera();
          setIsOpen(false);
          return;
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          // No barcode found, continue scanning
        } else {
          console.log('Decode attempt failed:', error);
        }
        
        if (scanningRef.current) {
          setTimeout(scanFrame, 100);
        }
      }
    };

    scanFrame();
  };

  const stopCamera = () => {
    console.log('Stopping camera scanner...');
    scanningRef.current = false;
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }

    setIsScanning(false);
    setScanStatus("");
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
    setIsOpen(open);
    if (!open) {
      stopCamera();
      setError("");
      setScanStatus("");
      setManualBarcode("");
    }
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
            {isScanning ? (
              <div className="space-y-2">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-green-400 border-dashed w-48 h-32 rounded-lg opacity-75"></div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm text-center bg-black bg-opacity-75 rounded px-2 py-1">
                      {scanStatus || "Position barcode within the green frame"}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Hold steady and ensure good lighting for best results
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm text-gray-600">Camera is starting...</p>
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
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
                placeholder="Enter 12-digit barcode"
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
              Use these to test, or scan barcodes from Product Management
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
