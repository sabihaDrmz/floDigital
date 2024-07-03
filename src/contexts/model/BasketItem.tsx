export type BasketItem = {
  id: number;
  basketId: number;
  sku: string;
  barcode: string;
  quantity: number;
  price: number;
  isOmc: boolean;
  parentSKU: string;
  productImage: string;
  title: string;
  description: string;
  size?: string;
  color?: string;
  isDeleted: boolean;
};
