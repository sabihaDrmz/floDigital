
export interface StoreWhLabelAddProductListRequestModel {
    items: Item[];
    storeWhId: number;
  }

interface Item {
    barcode: string;
    storeWhLabelCode: string;
  }
  
 
  