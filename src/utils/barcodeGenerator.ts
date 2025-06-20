
export const generateBarcode = (): string => {
  // Generate a proper 12-digit UPC-A barcode with better randomization
  const now = new Date();
  const timestamp = now.getTime().toString();
  const randomPart = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  
  // Create a more diverse base using timestamp and random components
  const timeComponent = timestamp.slice(-5); // Last 5 digits of timestamp
  const extraRandom = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  
  // Combine to get 11 digits
  const baseCode = (timeComponent + extraRandom).substring(0, 11);
  
  // Calculate proper UPC-A check digit
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(baseCode[i]);
    // UPC-A: odd positions (1,3,5...) multiply by 3, even positions by 1
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return baseCode + checkDigit.toString();
};

// Enhanced barcode validation with detailed error messages
export const isValidBarcode = (barcode: string): { valid: boolean; error?: string } => {
  // Check basic format
  if (!barcode || typeof barcode !== 'string') {
    return { valid: false, error: 'Barcode must be a string' };
  }
  
  // Remove any whitespace
  const cleanBarcode = barcode.trim();
  
  // Check if it's exactly 12 digits
  if (!/^\d{12}$/.test(cleanBarcode)) {
    if (cleanBarcode.length !== 12) {
      return { valid: false, error: `Barcode must be exactly 12 digits, got ${cleanBarcode.length}` };
    }
    return { valid: false, error: 'Barcode must contain only digits' };
  }
  
  // Validate UPC-A check digit
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(cleanBarcode[i]);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  const providedCheckDigit = parseInt(cleanBarcode[11]);
  
  if (calculatedCheckDigit !== providedCheckDigit) {
    return { 
      valid: false, 
      error: `Invalid check digit. Expected ${calculatedCheckDigit}, got ${providedCheckDigit}` 
    };
  }
  
  return { valid: true };
};

// Format barcode for display with proper spacing
export const formatBarcodeDisplay = (barcode: string): string => {
  if (barcode.length === 12) {
    // Format as: X XXXXX XXXXX X (UPC-A standard)
    return `${barcode[0]} ${barcode.slice(1, 6)} ${barcode.slice(6, 11)} ${barcode[11]}`;
  }
  return barcode;
};

// Generate test barcodes for demo purposes
export const generateTestBarcodes = (): string[] => {
  return [
    generateBarcode(),
    generateBarcode(),
    generateBarcode()
  ];
};
