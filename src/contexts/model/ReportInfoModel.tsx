export interface ReportInfoModel {
  "@odata.context": string;
  token: string;
  tokenId: string;
  expiration: Date;
  reportUrl: string;
  groupId: string;
  reportId: string;
  dataset: string;
  name: string;
  tenantId: string;
  id: number;
}
