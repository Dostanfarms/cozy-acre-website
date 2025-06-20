
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanBarcode, Edit3 } from "lucide-react";
import { FullScreenScanner } from "./FullScreenScanner";
import { generateTestBarcodes } from "@/utils/barcodeGenerator";

interface EnhancedBarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export const EnhancedBarcodeScanner = ({ onBarcodeScanned }: EnhancedBarcodeScannerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");

  const playSuccessSound = () => {
    // Create a short success beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const handleBarcodeScanned = (barcode: string) => {
    playSuccessSound();
    onBarcodeScanned(barcode);
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      handleBarcodeScanned(manualBarcode.trim());
      setManualBarcode("");
      setIsDialogOpen(false);
    }
  };

  const handleTestBarcode = (barcode: string) => {
    handleBarcodeScanned(barcode);
    setIsDialogOpen(false);
  };

  const testBarcodes = generateTestBarcodes();

  return (
    <>
      <div className="flex gap-2">
        {/* Direct Full Screen Scanner Button */}
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsFullScreenOpen(true)}
        >
          <ScanBarcode className="h-4 w-4" />
          Scan Barcode
        </Button>

        {/* Manual Entry Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Edit3 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manual Barcode Entry</DialogTitle>
              <DialogDescription>
                Enter barcode manually or use test barcodes
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
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

              {/* Test Barcodes */}
              <div className="space-y-2">
                <Label>Test with Sample Barcodes</Label>
                <div className="grid grid-cols-1 gap-2">
                  {testBarcodes.map((barcode, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestBarcode(barcode)}
                      className="font-mono text-xs"
                    >
                      {barcode}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Use these to test, or scan barcodes from Product Management
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Full Screen Scanner */}
      <FullScreenScanner
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        onBarcodeScanned={(barcode) => {
          handleBarcodeScanned(barcode);
          setIsFullScreenOpen(false);
        }}
      />
    </>
  );
};
