export const generateBarcode = (): string => {
  // Generate a proper 12-digit UPC-A barcode
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  // Take last 6 digits of timestamp + 6 random digits = 12 digits total
  const baseCode = (timestamp.slice(-6) + random).substring(0, 11);
  
  // Calculate check digit for UPC-A
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(baseCode[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return baseCode + checkDigit.toString();
};

// Helper function to validate barcode format
export const isValidBarcode = (barcode: string): boolean => {
  // Check if it's 12 digits
  if (!/^\d{12}$/.test(barcode)) {
    return false;
  }
  
  // Validate UPC-A check digit
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(barcode[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  const providedCheckDigit = parseInt(barcode[11]);
  
  return calculatedCheckDigit === providedCheckDigit;
};