
import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, NotFoundException, DecodeHintType, BarcodeFormat } from '@zxing/library';

export const useBarcodeDetector = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isScanning: boolean,
  onBarcodeDetected: (barcode: string) => void
) => {
  const [scanStatus, setScanStatus] = useState<string>("");
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanningRef = useRef<boolean>(false);

  useEffect(() => {
    if (isScanning && videoRef.current) {
      startBarcodeDetection();
    } else {
      stopBarcodeDetection();
    }
    
    return () => stopBarcodeDetection();
  }, [isScanning, videoRef]);

  const startBarcodeDetection = async () => {
    if (!videoRef.current || scanningRef.current) return;

    console.log('Starting barcode detection...');
    scanningRef.current = true;
    setScanStatus("Scanning for barcodes...");

    try {
      // Initialize code reader with optimized settings
      if (!codeReaderRef.current) {
        codeReaderRef.current = new BrowserMultiFormatReader();
        
        // Enhanced barcode format support
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.CODE_93,
          BarcodeFormat.CODABAR
        ]);
        hints.set(DecodeHintType.TRY_HARDER, true);
        codeReaderRef.current.hints = hints;
      }

      // Start continuous scanning
      await codeReaderRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error) => {
          if (result && scanningRef.current) {
            console.log('Barcode detected:', result.getText());
            setScanStatus(`Found: ${result.getText()}`);
            
            // Add haptic feedback if available
            if (navigator.vibrate) {
              navigator.vibrate(100);
            }
            
            onBarcodeDetected(result.getText());
            stopBarcodeDetection();
          }
          
          // Only log non-NotFoundException errors
          if (error && !(error instanceof NotFoundException)) {
            console.log('Decode error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Barcode detection error:', error);
      setScanStatus("Detection failed. Please try again.");
      scanningRef.current = false;
    }
  };

  const stopBarcodeDetection = () => {
    console.log('Stopping barcode detection...');
    scanningRef.current = false;
    
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    
    setScanStatus("");
  };

  return {
    scanStatus
  };
};
