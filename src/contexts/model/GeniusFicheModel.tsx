import { GeniusFicheDetailModel } from "./GeniusFicheDetailModel";
import { PaymentTypeDetailModel } from "./PaymentTypeDetailModel";

export interface GeniusFicheModel {
  customerName: string;
  customerPhone: string;
  gender: string;
  ficheKey: string;
  ficheRef: string;
  ficheDate: string;
  totalPrice: string;
  paymentType: string;
  storeNumber: string;
  storeName: string;
  source: string;
  storeManagerPhoneList: [string];
  data: GeniusFicheDetailModel[];
  odeme: PaymentTypeDetailModel[];
}
