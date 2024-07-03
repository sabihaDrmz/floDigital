import * as Pathfinder from "@flomagazacilik/flo-pathfinder";
import { create } from "zustand";

interface PathfinderServiceModel {
    loadDevices: () => Promise<string[]>;
    connectDevice: (deviceId: string) => Promise<boolean>;
}


export const usePathFinderService = create<PathfinderServiceModel>((set, get) => ({
    loadDevices: async () => {
        var devices = await Pathfinder.discoverDevices();

        if (
            devices &&
            devices.length === 1 &&
            devices[0] === "noDevicesFoundString"
        )
            return [];

        return devices;
    },
    connectDevice: async (deviceId: string) => {
        var result = await Pathfinder.connectDevice(deviceId);
        return result;
    }
}));
