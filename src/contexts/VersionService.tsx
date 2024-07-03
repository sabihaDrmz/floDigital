import { create } from "zustand";
interface VersionServiceModel {
    hasShowError: boolean;
    versionMessage: string;
    showVersionError: (show: boolean, message: string) => Promise<void>;
}

export const useVersionService = create<VersionServiceModel>((set, get) => ({
    hasShowError: false,
    versionMessage: "",
    showVersionError: async (show: boolean, message: string) => {
        set((state) => ({
            ...state,
            hasShowError: show,
            versionMessage: message
        }))
    },
}));


{/* < VersionErrorModal /> */ }
