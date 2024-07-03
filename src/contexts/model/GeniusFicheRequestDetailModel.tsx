import { EasyReturnReasonModel } from "./EasyReturnReasonModel";
import { GeniusFicheDetailModel } from "./GeniusFicheDetailModel";

export interface GeniusFicheRequestDetailModel extends GeniusFicheDetailModel {
  reason?: EasyReturnReasonModel;
  item_quantity: number;
}
