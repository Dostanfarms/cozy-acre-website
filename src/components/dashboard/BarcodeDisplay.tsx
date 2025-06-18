
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Barcode } from "lucide-react";

interface BarcodeDisplayProps {
  barcode: string;
}

export const BarcodeDisplay = ({ barcode }: BarcodeDisplayProps) => {
  const generateBarcodePattern = (code: string) => {
    // Simple barcode pattern generator for display
    const patterns = code.split('').map((char, index) => (
      <div
        key={index}
        className={`h-8 ${parseInt(char) % 2 === 0 ? 'w-1 bg-black' : 'w-2 bg-gray-800'}`}
      />
    ));
    return patterns;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {barcode}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Barcode</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="flex justify-center items-end gap-px p-4 bg-white border">
            {generateBarcodePattern(barcode)}
          </div>
          <div className="font-mono text-lg font-bold">{barcode}</div>
          <p className="text-sm text-gray-600">
            Scan this barcode or use the number for inventory tracking
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
