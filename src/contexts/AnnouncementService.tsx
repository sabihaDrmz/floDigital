import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import FileViewer from "react-native-file-viewer";
import { Linking, Platform } from "react-native";
import { SystemApi } from "./AccountService";
import { AnnouncementModel, AnnouncementFile } from "./model/AnnouncementModel";
import { onlyUnique } from "../core/Util";
import { asyncFileKey } from "../core/StorageKeys";
import { useFcmService } from "./FcmService";

const downloadedMediaDir = FileSystem.documentDirectory + "announceMedia/";

interface AnnouncementServiceModel {
    isLoading: boolean;
    announcements: AnnouncementModel[];
    announcementFiles: AnnouncementFile[];
    downloadFiles: number[];
    downloadingFile: boolean;
    loadAllAnnouncement: (onlyAttachment?: boolean) => void;
    loadAllFiles: () => void;
    downloadFile: (uri: string, fileId: number, fileName: string) => void;
    addStoredFileList: (fileId: number) => void;
    ensureDirExists: (fileDir: string) => void;
}


export const useAnnouncementService = create<AnnouncementServiceModel>((set, get) => ({
    isLoading: false,
    announcements: [],
    announcementFiles: [],
    downloadFiles: [],
    downloadingFile: false,
    loadAllAnnouncement: async (onlyAttachment?: boolean) => {
        const notificationService = useFcmService.getState();
        set((state) => ({
            ...state,
            isLoading: true
        }));
        const result = await SystemApi.post(
            "Announcement/Get?isAttachement=" + (onlyAttachment ? "true" : "false")
        );

        if (result.data && result.data.state === 1) {
            set((state) => ({
                ...state,
                announcements: result.data.model
            }));
            notificationService.readBadgeCount();
        } else {
            set((state) => ({
                ...state,
                announcements: []
            }));
        }

        set((state) => ({
            ...state,
            isLoading: false,
        }));
    },
    loadAllFiles: async () => {
        set((state) => ({
            ...state,
            isLoading: true,
            announcementFiles: []
        }));

        const result = await SystemApi.post("Document/Get", {});
        if (result.data && result.data.state === 1) {
            set((state) => ({
                ...state,
                announcementFiles: result.data.model
            }));
        }

        set((state) => ({
            ...state,
            isLoading: false
        }));
    },
    downloadFile: async (
        uri: string,
        fileId: number,
        fileName: string
    ) => {
        set((state) => ({
            ...state,
            downloadingFile: true
        }));
        if (Platform.OS === "web") {
            Linking.openURL(uri);
            set((state) => ({
                ...state,
                downloadingFile: false
            }));
            return;
        }
        try {
            const { ensureDirExists } = get();
            await ensureDirExists(downloadedMediaDir);

            const f = `${downloadedMediaDir}media_${fileId}${fileName}`;

            let fileInfo = await FileSystem.getInfoAsync(f);
            if (!fileInfo.exists) {
                await FileSystem.downloadAsync(encodeURI(uri), f);
            }

            FileViewer.open(f);
        } catch (err) {
            console.error(err);
        } finally {
            set((state) => ({
                ...state,
                downloadingFile: false
            }));
        }
    },
    ensureDirExists: async (fileDir: string) => {
        const dirInfo = await FileSystem.getInfoAsync(fileDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });
        }
    },
    addStoredFileList: async (fileId: number) => {
        let currentStore = await AsyncStorage.getItem(asyncFileKey);
        if (currentStore) {
            let parsedItems = JSON.parse(currentStore);
            let newListCollection = [...parsedItems, fileId];

            newListCollection = newListCollection.filter(onlyUnique);
            set((state) => ({
                ...state,
                downloadFiles: newListCollection
            }));
            await AsyncStorage.setItem(
                asyncFileKey,
                JSON.stringify(newListCollection)
            );
        } else {
            let newCollection = [fileId];

            await AsyncStorage.setItem(asyncFileKey, JSON.stringify(newCollection));
            set((state) => ({
                ...state,
                downloadFiles: [...newCollection]
            }));
        }
    },
}));