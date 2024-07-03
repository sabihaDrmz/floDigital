export interface PrinterConfigGroupModel {
  createDate: Date;
  icon: string;
  id: number;
  name: string;
  ptcConfigs: PrinterConfigProp[];
}

export interface PrinterConfigProp {
  id: number;
  alias: string;
  title: string;
  contents: string;
  image: string;
  siteId: number;
  config: string;
  twiceGroup: number | null;
}
