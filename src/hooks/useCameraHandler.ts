
import { useState, useCallback, useRef } from 'react';

export const useCameraHandler = (
  videoRef: React.RefObject<HTMLVideoElement>,
  torchEnabled: boolean
) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    console.log('Starting camera...');
    
    if (!videoRef.current) {
      setError("Camera initialization failed. Please try again.");
      return;
    }

    setIsScanning(true);
    setError("");

    try {
      // Request camera with enhanced constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment', // Use back camera by default
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        
        console.log('Camera started successfully');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setIsScanning(false);
      
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            setError("Camera access denied. Please allow camera permissions.");
            break;
          case 'NotFoundError':
            setError("No camera found. Please ensure your device has a camera.");
            break;
          case 'NotReadableError':
            setError("Camera is busy. Please close other apps using the camera.");
            break;
          default:
            setError(`Camera error: ${err.message}`);
        }
      } else {
        setError("Failed to start camera. Please try again.");
      }
    }
  }, [videoRef]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    setIsScanning(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setError("");
  }, [videoRef]);

  const toggleTorch = useCallback(async (enabled: boolean) => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && 'applyConstraints' in videoTrack) {
        try {
          await videoTrack.applyConstraints({
            advanced: [{ torch: enabled } as any]
          });
        } catch (err) {
          console.log('Torch not supported on this device');
        }
      }
    }
  }, []);

  return {
    isScanning,
    error,
    startCamera,
    stopCamera,
    toggleTorch
  };
};
