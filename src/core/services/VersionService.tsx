import { action, makeAutoObservable, observable } from "mobx";

class VersionService {
  constructor() {
    makeAutoObservable(this);
  }

  @observable hasShowError: boolean = false;
  @observable versionMessage: string = "";

  @action showVersionError = (show: boolean, message: string) => {
    this.hasShowError = show;
    this.versionMessage = message;
  };
}

export default new VersionService();
