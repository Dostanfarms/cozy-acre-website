
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanBarcode, X } from "lucide-react";
import { BrowserMultiFormatReader, NotFoundException, DecodeHintType, BarcodeFormat } from '@zxing/library';

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

  // Delay camera start to ensure video element is ready
  useEffect(() => {
    if (isOpen) {
      console.log('Dialog opened, waiting for video element...');
      // Add a small delay to ensure the video element is rendered
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      return () => clearTimeout(timer);
    } else {
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
    
    if (!videoRef.current) {
      console.error('Video element not available');
      setError("Camera initialization failed. Video element not ready.");
      setScanStatus("");
      return;
    }

    setIsScanning(true);
    setError("");
    setScanStatus("Starting camera...");
    
    try {
      // Initialize code reader with better settings
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
        // Set hints for better barcode detection using proper enum values
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E
        ]);
        codeReaderRef.current.hints = hints;
      }

      console.log('Requesting camera access...');
      setScanStatus("Requesting camera access...");
      
      // Use the ZXing library's built-in camera handling instead of manual setup
      scanningRef.current = true;
      
      // Start continuous decoding directly with ZXing's method
      const result = await codeReaderRef.current.decodeOnceFromVideoDevice(undefined, videoRef.current);
      
      if (result && scanningRef.current) {
        console.log('Barcode detected:', result.getText());
        setScanStatus(`Found: ${result.getText()}`);
        onBarcodeScanned(result.getText());
        stopCamera();
        setIsOpen(false);
        return;
      } else {
        // If no immediate result, start continuous scanning
        startContinuousScanning();
      }

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

  const startContinuousScanning = async () => {
    if (!codeReaderRef.current || !videoRef.current || !scanningRef.current) {
      return;
    }

    setScanStatus("Scanning... Point camera at barcode");

    try {
      console.log('Starting continuous scanning...');
      
      // Use ZXing's continuous decode method
      const controls = await codeReaderRef.current.decodeFromVideoDevice(
        undefined, 
        videoRef.current, 
        (result, error) => {
          if (result && scanningRef.current) {
            console.log('Barcode detected:', result.getText());
            setScanStatus(`Found: ${result.getText()}`);
            onBarcodeScanned(result.getText());
            stopCamera();
            setIsOpen(false);
          }
          // Don't log NotFoundException errors as they're expected during scanning
          if (error && !(error instanceof NotFoundException)) {
            console.log('Decode error:', error);
          }
        }
      );
      
      // Store the controls to stop later
      streamRef.current = controls as any;
      
    } catch (error) {
      console.error('Continuous scanning error:', error);
      if (scanningRef.current) {
        setError("Failed to start barcode scanning. Please try again.");
        setIsScanning(false);
        setScanStatus("");
      }
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera scanner...');
    setIsScanning(false);
    scanningRef.current = false;
    
    // Reset code reader which should stop all streams
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    streamRef.current = null;
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
          <DialogDescription>
            Point your camera at a barcode to scan it automatically, or enter it manually below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Camera Scanner */}
          <div className="space-y-2">
            <Label>Camera Scanner</Label>
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                playsInline
                muted
                autoPlay
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-green-400 border-dashed w-48 h-32 rounded-lg opacity-75"></div>
                </div>
              )}
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
                  {scanStatus || "Starting scanner..."}
                </p>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
                <div className="mt-2 space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setError("");
                      setScanStatus("");
                      if (isOpen) {
                        startCamera();
                      }
                    }}
                  >
                    Retry
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setError("")}
                  >
                    Dismiss
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
