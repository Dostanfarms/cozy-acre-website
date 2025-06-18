
export const generateBarcode = (): string => {
  // Generate a simple 12-digit barcode
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  const combined = timestamp + random;
  
  // Take first 12 characters and ensure they're all numbers
  return combined.replace(/[^0-9]/g, '').substring(0, 12).padEnd(12, '0');
};
