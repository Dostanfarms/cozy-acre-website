
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer } from "lucide-react";

interface BarcodeDisplayProps {
  barcode: string;
}

export const BarcodeDisplay = ({ barcode }: BarcodeDisplayProps) => {
  const generateBarcodePattern = (code: string) => {
    // More realistic barcode pattern using Code 128 style encoding
    const patterns = [];
    
    // Start pattern
    patterns.push(<div key="start" className="h-12 w-1 bg-black" />);
    
    // Encode each digit with varying bar widths
    code.split('').forEach((char, index) => {
      const digit = parseInt(char);
      // Create pattern based on digit value
      for (let i = 0; i < 4; i++) {
        const isWide = (digit + i) % 3 === 0;
        const isBlack = i % 2 === 0;
        patterns.push(
          <div
            key={`${index}-${i}`}
            className={`h-12 ${isWide ? 'w-1' : 'w-0.5'} ${
              isBlack ? 'bg-black' : 'bg-white'
            }`}
          />
        );
      }
    });
    
    // End pattern
    patterns.push(<div key="end" className="h-12 w-1 bg-black" />);
    
    return patterns;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Barcode - ${barcode}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                padding: 20px; 
              }
              .barcode-container { 
                display: flex; 
                align-items: end; 
                gap: 1px; 
                padding: 20px; 
                background: white; 
                border: 1px solid #000; 
                margin: 20px 0;
              }
              .bar { height: 60px; }
              .w-1 { width: 2px; }
              .w-0-5 { width: 1px; }
              .bg-black { background-color: black; }
              .bg-white { background-color: white; }
              .barcode-number { 
                font-family: monospace; 
                font-size: 18px; 
                font-weight: bold; 
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <h2>Product Barcode</h2>
            <div class="barcode-container">
              ${barcode.split('').map((char, index) => {
                const digit = parseInt(char);
                let bars = '<div class="bar w-1 bg-black"></div>'; // start
                for (let i = 0; i < 4; i++) {
                  const isWide = (digit + i) % 3 === 0;
                  const isBlack = i % 2 === 0;
                  bars += `<div class="bar ${isWide ? 'w-1' : 'w-0-5'} ${isBlack ? 'bg-black' : 'bg-white'}"></div>`;
                }
                return bars;
              }).join('')}
              <div class="bar w-1 bg-black"></div>
            </div>
            <div class="barcode-number">${barcode}</div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {barcode}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Product Barcode</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="flex justify-center items-end gap-px p-4 bg-white border">
            {generateBarcodePattern(barcode)}
          </div>
          <div className="font-mono text-lg font-bold">{barcode}</div>
          <div className="flex gap-2 justify-center">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Barcode
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Scan this barcode or use the number for inventory tracking
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
