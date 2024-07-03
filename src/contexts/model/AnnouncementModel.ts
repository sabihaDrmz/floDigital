export interface AnnouncementModel {
  id: number;
  title: string;
  contents: string;
  whoIs: number;
  storeId: number;
  image: string;
  createDate: Date;
  announcementFiles: AnnouncementFile[];
  isRead: boolean;
}

export interface AnnouncementFile {
  id: number;
  name: string;
  url: string;
  type: string;
  announcementId: number;
  size: number;
}
