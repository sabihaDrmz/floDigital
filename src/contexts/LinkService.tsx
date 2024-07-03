import { Linking, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import FileViewer from "react-native-file-viewer";
import { create } from 'zustand';
import { SystemApi } from "../contexts/AccountService";
const downloadedMediaDir = FileSystem.documentDirectory + "announceMedia/";
export interface Link {
    id: number;
    name: string;
    url: string;
    icon: string;
    helps?: Link[];
    helpFiles: HelpFiles[];
}

interface HelpFiles {
    id: number;
    name: string;
    url: string;
    type: string;
    helpId: number;
    size: number;
    isActive: boolean;
    isDeleted: boolean;
}

interface LinkServiceModel {
    links: Link[];
    isLoading: boolean;
    downloadingFile: boolean;
    getLinks: () => Promise<void>;
    downloadFile: (uri: string, fileId: number, fileName: string) => void;
    ensureDirExists: (fileDir: string) => void;
}

export const useLinkService = create<LinkServiceModel>((set, get) => ({
    links: [],
    isLoading: false,
    downloadingFile: false,
    getLinks: async () => {
        const { isLoading } = get();
        if (isLoading) return;
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));
            const result = await SystemApi.get("HelpCategory/GetListWithHelps");

            if (result.status === 200 && result.data.state === 1) {
                set((state) => ({
                    ...state,
                    links: result.data.model
                }));
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
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
    }
}));