
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanBarcode, Camera } from "lucide-react";

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export const BarcodeScanner = ({ onBarcodeScanned }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const startCamera = async () => {
    setIsScanning(true);
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      
      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // For demo purposes, we'll simulate scanning after 3 seconds
      // In a real app, you'd integrate with a barcode scanning library
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsScanning(false);
        // Simulate finding a barcode
        alert('Camera scanning is not fully implemented yet. Please use manual entry or the scan simulation below.');
      }, 3000);
      
    } catch (error) {
      console.error('Camera access denied:', error);
      setIsScanning(false);
      alert('Camera access denied. Please use manual barcode entry.');
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Label>Use Camera</Label>
            <Button 
              onClick={startCamera} 
              disabled={isScanning}
              className="w-full flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              {isScanning ? 'Scanning...' : 'Start Camera Scanner'}
            </Button>
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
