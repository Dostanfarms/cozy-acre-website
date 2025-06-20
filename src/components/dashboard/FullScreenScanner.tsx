
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Flashlight, FlashlightOff } from "lucide-react";
import { useCameraHandler } from "@/hooks/useCameraHandler";
import { useBarcodeDetector } from "@/hooks/useBarcodeDetector";

interface FullScreenScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

export const FullScreenScanner = ({ isOpen, onClose, onBarcodeScanned }: FullScreenScannerProps) => {
  const [torchEnabled, setTorchEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { 
    isScanning, 
    error, 
    startCamera, 
    stopCamera,
    toggleTorch 
  } = useCameraHandler(videoRef, torchEnabled);
  
  const { scanStatus } = useBarcodeDetector(
    videoRef, 
    isScanning, 
    (barcode) => {
      onBarcodeScanned(barcode);
      onClose();
    }
  );

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, startCamera, stopCamera]);

  const handleTorchToggle = () => {
    setTorchEnabled(!torchEnabled);
    toggleTorch(!torchEnabled);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">Scan Barcode</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTorchToggle}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              {torchEnabled ? <FlashlightOff className="h-5 w-5" /> : <Flashlight className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Camera Feed */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Scanning Overlay - Covers entire screen */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Full screen scanning animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse">
            {/* Corner indicators */}
            <div className="absolute top-16 left-4 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
            <div className="absolute top-16 right-4 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
            <div className="absolute bottom-32 left-4 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
            <div className="absolute bottom-32 right-4 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
          </div>
          
          {/* Scanning line animation */}
          <div className="absolute top-16 left-4 right-4 bottom-32 border-2 border-green-400 border-dashed rounded-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-400 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Status Display */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
        <div className="text-center">
          <p className="text-white text-lg mb-2 font-medium">
            {scanStatus || "Point camera at any barcode to scan"}
          </p>
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={startCamera}
                className="mt-2 text-white border-white hover:bg-white/20"
              >
                Retry
              </Button>
            </div>
          )}
          <p className="text-white/70 text-sm">
            Place any barcode within the camera view - scanning works anywhere on screen
          </p>
        </div>
      </div>
    </div>
  );
};
