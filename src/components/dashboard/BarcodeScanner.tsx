
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    // Initialize the code reader when component mounts
    if (!codeReaderRef.current) {
      console.log('Initializing BrowserMultiFormatReader...');
      codeReaderRef.current = new BrowserMultiFormatReader();
    }
    
    return () => {
      // Cleanup when component unmounts
      if (codeReaderRef.current) {
        console.log('Cleaning up BrowserMultiFormatReader...');
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startCamera = async () => {
    console.log('Starting camera scanner...');
    setIsScanning(true);
    setError("");
    
    try {
      // Ensure code reader is initialized
      if (!codeReaderRef.current) {
        console.log('Code reader not found, initializing...');
        codeReaderRef.current = new BrowserMultiFormatReader();
      }

      if (!videoRef.current) {
        throw new Error("Video element not found");
      }

      console.log('Getting camera devices...');
      // Get available video input devices using navigator.mediaDevices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('Found video devices:', videoDevices.length);
      
      if (videoDevices.length === 0) {
        throw new Error("No camera devices found");
      }

      // Try to use back camera if available (better for scanning)
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      const selectedDeviceId = backCamera?.deviceId || videoDevices[0].deviceId;
      console.log('Using camera device:', selectedDeviceId);

      // Start continuous decoding from video device
      await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log('Barcode scanned:', result.getText());
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

    } catch (err) {
      console.error('Camera scanning error:', err);
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError("Camera access denied. Please allow camera permissions and try again.");
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        setError("No camera found on this device.");
      } else {
        setError(`Scanner error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera scanner...');
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
              <Button 
                onClick={startCamera}
                className="w-full flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Start Camera Scanner
              </Button>
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
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Position the barcode within the frame
                </p>
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setError("")}
                  className="mt-2"
                >
                  Try Again
                </Button>
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
              <Button onClick={handleManualSubmit}>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
