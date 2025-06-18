import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer } from "lucide-react";

interface BarcodeDisplayProps {
  barcode: string;
}

export const BarcodeDisplay = ({ barcode }: BarcodeDisplayProps) => {
  const generateBarcodePattern = (code: string) => {
    // UPC-A encoding patterns
    const leftPatterns = [
      '0001101', '0011001', '0010011', '0111101', '0100011',
      '0110001', '0101111', '0111011', '0110111', '0001011'
    ];
    
    const rightPatterns = [
      '1110010', '1100110', '1101100', '1000010', '1011100',
      '1001110', '1010000', '1000100', '1001000', '1110100'
    ];

    const patterns = [];
    
    // Start guard
    patterns.push(<div key="start-guard" className="h-16 w-0.5 bg-black" />);
    patterns.push(<div key="start-guard-2" className="h-16 w-0.5 bg-white" />);
    patterns.push(<div key="start-guard-3" className="h-16 w-0.5 bg-black" />);
    
    // Left side (first 6 digits)
    for (let i = 0; i < 6; i++) {
      const digit = parseInt(code[i]);
      const pattern = leftPatterns[digit];
      for (let j = 0; j < pattern.length; j++) {
        patterns.push(
          <div
            key={`left-${i}-${j}`}
            className={`h-16 w-0.5 ${pattern[j] === '1' ? 'bg-black' : 'bg-white'}`}
          />
        );
      }
    }
    
    // Center guard
    patterns.push(<div key="center-guard-1" className="h-16 w-0.5 bg-white" />);
    patterns.push(<div key="center-guard-2" className="h-16 w-0.5 bg-black" />);
    patterns.push(<div key="center-guard-3" className="h-16 w-0.5 bg-white" />);
    patterns.push(<div key="center-guard-4" className="h-16 w-0.5 bg-black" />);
    patterns.push(<div key="center-guard-5" className="h-16 w-0.5 bg-white" />);
    
    // Right side (last 6 digits)
    for (let i = 6; i < 12; i++) {
      const digit = parseInt(code[i]);
      const pattern = rightPatterns[digit];
      for (let j = 0; j < pattern.length; j++) {
        patterns.push(
          <div
            key={`right-${i}-${j}`}
            className={`h-16 w-0.5 ${pattern[j] === '1' ? 'bg-black' : 'bg-white'}`}
          />
        );
      }
    }
    
    // End guard
    patterns.push(<div key="end-guard-1" className="h-16 w-0.5 bg-black" />);
    patterns.push(<div key="end-guard-2" className="h-16 w-0.5 bg-white" />);
    patterns.push(<div key="end-guard-3" className="h-16 w-0.5 bg-black" />);
    
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
                margin: 0;
              }
              .barcode-container { 
                display: flex; 
                align-items: end; 
                gap: 0; 
                padding: 20px; 
                background: white; 
                border: 2px solid #000; 
                margin: 20px 0;
                justify-content: center;
              }
              .bar { 
                height: 80px; 
                display: inline-block;
              }
              .w-0-5 { width: 1px; }
              .bg-black { background-color: black; }
              .bg-white { background-color: white; }
              .barcode-number { 
                font-family: 'Courier New', monospace; 
                font-size: 24px; 
                font-weight: bold; 
                margin-top: 10px;
                letter-spacing: 2px;
              }
              .title {
                font-size: 28px;
                margin-bottom: 20px;
                color: #333;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1 class="title">Product Barcode</h1>
            <div class="barcode-container">
              ${barcode.split('').map((char, index) => {
                // This is a simplified version for printing
                const patterns = ['▌', '▐', '█', '▌', '▐', '█', '▌', '▐', '█', '▌'];
                return `<span style="font-family: monospace; font-size: 40px; line-height: 80px;">${patterns[parseInt(char)]}</span>`;
              }).join('')}
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
        <Button variant="outline" size="sm" className="font-mono">
          {barcode}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Product Barcode</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <div className="flex justify-center items-end gap-0 p-6 bg-white border-2 border-gray-300 rounded-lg overflow-x-auto">
            {generateBarcodePattern(barcode)}
          </div>
          <div className="font-mono text-xl font-bold tracking-wider">{barcode}</div>
          <div className="flex gap-2 justify-center">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Barcode
            </Button>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Scan this barcode with the camera scanner or enter the number manually</p>
            <p className="font-mono bg-gray-100 p-2 rounded">{barcode}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};