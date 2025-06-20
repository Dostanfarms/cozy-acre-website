
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanBarcode, Camera } from "lucide-react";
import { FullScreenScanner } from "./FullScreenScanner";
import { generateTestBarcodes } from "@/utils/barcodeGenerator";

interface EnhancedBarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export const EnhancedBarcodeScanner = ({ onBarcodeScanned }: EnhancedBarcodeScannerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim());
      setManualBarcode("");
      setIsDialogOpen(false);
    }
  };

  const handleTestBarcode = (barcode: string) => {
    onBarcodeScanned(barcode);
    setIsDialogOpen(false);
  };

  const testBarcodes = generateTestBarcodes();

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              Use the camera scanner or enter barcode manually
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Full Screen Camera Scanner */}
            <div className="space-y-2">
              <Label>Camera Scanner</Label>
              <Button 
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsFullScreenOpen(true);
                }}
                className="w-full h-12 flex items-center gap-2"
                size="lg"
              >
                <Camera className="h-5 w-5" />
                Open Full Screen Scanner
              </Button>
              <p className="text-xs text-gray-500">
                Opens full screen camera for easy barcode scanning
              </p>
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

      {/* Full Screen Scanner */}
      <FullScreenScanner
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        onBarcodeScanned={(barcode) => {
          onBarcodeScanned(barcode);
          setIsFullScreenOpen(false);
        }}
      />
    </>
  );
};
