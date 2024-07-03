import axios from "axios";
import { t } from "i18n-js";
import { action, makeObservable, observable } from "mobx";
import { translate } from "../../helper/localization/locaizationMain";
import { FloDigitalErrorParse } from "../HttpModule";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import { chekcAuthError } from "../Util";
import AccountService from "./AccountService";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";

class LinkService {
  links: Link[] = [];
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      links: observable,
      isLoading: observable,
      getLinks: action,
    });
  }

  getLinks = async () => {
    if (this.isLoading === true) return;
    try {
      this.isLoading = true;

      var result = await axios.get(GetServiceUri(ServiceUrlType.HELP_LINK), {
        headers: AccountService.tokenizeHeader(),
      });

      if (result.status === 200 && result.data.state === 1) {
        this.links = result.data.model;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };
}

export default new LinkService();

export interface Link {
  id: number;
  name: string;
  url: string;
  icon: string;
  helps?: Link[];
}
