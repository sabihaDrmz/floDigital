export interface ProductGroup {
  id: number;
  name: string;
  mainGroupId: number;
  mainGroupName: string;
  code: string;
}

export interface ProductGroupReason {
  productGroup: ProductGroup;
  productGroupId: number;
  description: string;
  order: number;
  code: '105';
  id: number;
}
