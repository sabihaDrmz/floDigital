import { action } from "mobx";
//TODO: EXPO pathfinder
// import * as Pathfinder from "@flomagazacilik/flo-pathfinder";

class PathfinderService {
  @action loadDevices = async () => {
    //TODO: EXPO pathfinder
/*
    var devices = await Pathfinder.discoverDevices();

    if (
      devices &&
      devices.length === 1 &&
      devices[0] === "noDevicesFoundString"
    )
      return [];

    return devices;

 */
    return null;
  };

  @action connectDevice = async (deviceId: string) => {
    // var result = await Pathfinder.connectDevice(deviceId);

    return null;
  };
}

export default PathfinderService;
