import axios from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";
import AccountService from "./AccountService";
import { translate } from "../../helper/localization/locaizationMain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { asyncFileKey } from "../StorageKeys";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
import { GetServiceUri, ServiceUrlType } from "../Settings";
// import Crashlytics from "@react-native-firebase/crashlytics";
//TODO: EXPO expo-file-system
// import * as FileSystem from "expo-file-system";
import FcmService from "./FcmService";
import linq from "linq";
import { FloDigitalErrorParse } from "../HttpModule";
import * as IntentLauncher from "expo-intent-launcher";
import FileViewer from "react-native-file-viewer";
import { Linking, Platform } from "react-native";
import { onlyUnique } from "../Util";

//TODO: EXPO expo-file-system
const downloadedMediaDir = 'FileSystem.documentDirectory' + "announceMedia/";
class AnnouncementServiceService {
  @observable isLoading: boolean = false;
  @observable announcements: Announcement[] = [];
  @observable announcementFiles: AnnouncementFile[] = [];
  @observable downloadFiles: number[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  @action LoadAllAnnouncement = async (onlyAttchment?: boolean) => {
    // Crashlytics().log("Duyurular yükleniyor");

    try {
      this.isLoading = true;
      this.announcements = [];

      var result = await axios.post(
        GetServiceUri(ServiceUrlType.GET_ANNOUNCEMENT) +
          "?isAttachement=" +
          (onlyAttchment ? "true" : "false"),
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data && result.data.state === 1) {
        runInAction(() => {
          this.announcements = result.data.model;
        });
        FcmService.readBadgeCount();
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };

  @action LoadAllFiles = async () => {
    try {
      // Crashlytics().log("Dosyaları yükleniyor");
      this.isLoading = true;
      var result = await axios.post(
        GetServiceUri(ServiceUrlType.GET_FILES),
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result && result.status && result.data.state === 1) {
        runInAction(() => {
          this.announcementFiles = result.data.model;
        });
      }
    } catch (err: any) {
      if (
        err?.response?.status === 700 ||
        err?.response?.status === 401 ||
        err?.response?.status === 409
      )
        FloDigitalErrorParse(err);
      else
        MessageBox.Show(
          translate("announceMiddlewareAlerts.fileLoadExceptionMessage"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
    } finally {
      this.isLoading = false;
    }
  };

  @observable downloadingFile: boolean = false;

  @action DownloadFile = async (
    uri: string,
    fileId: number,
    fileName: string
  ) => {
    this.downloadingFile = true;
    if (Platform.OS === "web") {
      Linking.openURL(uri);
      this.downloadingFile = false;
      return;
    }
    try {
      await this.ensureDirExists(downloadedMediaDir);
      const f = `${downloadedMediaDir}media_${fileId}${fileName}`;

     /* let fileInfo = await FileSystem.getInfoAsync(f);
      if (!fileInfo.exists) {
        await FileSystem.downloadAsync(encodeURI(uri), f);
      }

      */
      FileViewer.open(f);
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.downloadingFile = false));
    }
  };

  ensureDirExists = async (fileDir: string) => {
    try {
      /*
      const dirInfo = await FileSystem.getInfoAsync(fileDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });
      }

       */
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  AddStoredFileList = async (fileId: number) => {
    // Crashlytics().log("Dosya cihaza kaydedildi [DosyaId=" + fileId + "]");
    let currentStore = await AsyncStorage.getItem(asyncFileKey);
    if (currentStore) {
      let parsedItems = JSON.parse(currentStore);

      let newListCollection = [...parsedItems, fileId];

      newListCollection = newListCollection.filter(onlyUnique);
      runInAction(() => (this.downloadFiles = newListCollection));
      await AsyncStorage.setItem(
        asyncFileKey,
        JSON.stringify(newListCollection)
      );
    } else {
      let newCollection = [fileId];

      await AsyncStorage.setItem(asyncFileKey, JSON.stringify(newCollection));
      runInAction(() => (this.downloadFiles = [...newCollection]));
    }
  };

  downloadLanguagePack = async () => {};
}

export default new AnnouncementServiceService();

export interface Announcement {
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
