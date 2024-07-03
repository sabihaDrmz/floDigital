import { action } from "mobx";
import * as Pathfinder from "@flomagazacilik/flo-pathfinder";

class PathfinderService {
  @action loadDevices = async () => {
    var devices = await Pathfinder.discoverDevices();

    if (
      devices &&
      devices.length === 1 &&
      devices[0] === "noDevicesFoundString"
    )
      return [];

    return devices;
  };

  @action connectDevice = async (deviceId: string) => {
    var result = await Pathfinder.connectDevice(deviceId);

    return result;
  };
}

export default PathfinderService;
