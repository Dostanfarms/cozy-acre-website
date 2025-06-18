
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  barcode: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  timestamp: string;
}

const PRODUCTS_KEY = 'farm_products';
const SALES_KEY = 'farm_sales';

// Product functions
export const getProducts = (): Product[] => {
  try {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const saveProduct = (product: Product): void => {
  try {
    const products = getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving product:', error);
  }
};

export const deleteProduct = (id: string): void => {
  try {
    const products = getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filteredProducts));
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

// Sales functions
export const getSales = (): Sale[] => {
  try {
    const sales = localStorage.getItem(SALES_KEY);
    return sales ? JSON.parse(sales) : [];
  } catch (error) {
    console.error('Error loading sales:', error);
    return [];
  }
};

export const saveSale = (sale: Sale): void => {
  try {
    const sales = getSales();
    sales.push(sale);
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  } catch (error) {
    console.error('Error saving sale:', error);
  }
};
