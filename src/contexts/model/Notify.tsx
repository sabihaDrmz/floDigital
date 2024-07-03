export interface Notify {
  actionType: number;
  appId?: any;
  body: string;
  createDate: Date;
  dataJson?: any;
  fcmMessageId: string;
  id: number;
  isRead: boolean;
  readDate: Date;
  sendTo: string;
  sendType: number;
  title: string;
}
