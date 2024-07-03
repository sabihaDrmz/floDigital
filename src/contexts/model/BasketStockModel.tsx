import { BasketStockItem } from "./BasketStockItem";

export type BasketStockModel = {
  result: boolean;
  items: BasketStockItem[];
  message: string;
  errorCode: string;
};
