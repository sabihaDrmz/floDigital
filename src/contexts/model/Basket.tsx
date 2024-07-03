import { BasketItem } from "./BasketItem";
import { BasketOrder } from "./BasketOrder";

export type Basket = {
  storeId?: string;
  basketItems: BasketItem[];
  basketId: number;
  id: number;
  basketTitle?: string;
  employeeId: string;
  companyCode: string;
  basketStatusId: number;
  basketTicketId?: number;
  creatorName?: string;
  order: BasketOrder | undefined;
  basketItemResults?: {
    sku: string;
    lastQuantity: number;
    quantity: number;
    rowState: number;
  }[];
  isAddressComplate?: boolean;
};
