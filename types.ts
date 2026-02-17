
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  barcode?: string;
  lastUpdated: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  timestamp: string;
}

export interface DashboardStats {
  totalStockValue: number;
  dailySales: number;
  lowStockItemsCount: number;
  profitMargin: number;
}

export type AppView = 'dashboard' | 'inventory' | 'pos' | 'history' | 'ai';
