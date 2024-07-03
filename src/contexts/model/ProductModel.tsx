import { SimilarProductModel } from "./SimilarProductModel";

export interface ProductModel {
  barcode: string;
  site: string;
  store: string;
  storeName: string;
  county: string;
  city: string;
  name: string;
  brand: string;
  color: string;
  size: string;
  price: number;
  oldPrice: number;
  sku: string;
  parentSku: string;
  qty: number;
  gender: string;
  model: string;
  saya: string;
  currency: string;
  type: string;
  images: [string];
  outlet: string;
  unitQr: string;
  productClass: string;
  zzstkgR_TANIM: string;
  baseMaterial: string;
  sayaText: string;
}

export interface ProductProp {
  product: ProductModel;
  tagValue: [
    {
      tag: string;
      key: string;
      title: string;
      value: string;
    }
  ];
  options: [
    {
      image: string;
      isSelected: true;
      barcode: string;
      sku: string;
      color: string;
      price: string;
    }
  ];
  sizes: {
    store: [
      {
        size: string;
        barcode: string;
        sku: string;
        qty: number;
        storeName: string;
      }
    ];
    ecom: [
      {
        size: string;
        barcode: string;
        sku: string;
        qty: number;
      }
    ];
  };
  stores: [
    {
      qty: number;
      store: string;
      storeName: string;
      county: string;
      city: string;
      distance: number;
      longitude: number;
      latitude: number;
    }
  ];
  ecomProductFooter: {
    price: number;
    shippingPrice: number;
    firstDate: string;
    lastDate: string;
    maxInstallment: string;
    limit: number;
    discountPrice: number;
  };
  similarProducts: {
    itemGroupId: string;
    pageNo: number;
    storeCode: string;
    similarProducts: SimilarProductModel[];
  };
}
