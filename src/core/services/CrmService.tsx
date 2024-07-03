import axios from "axios";
import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from "mobx";
import { Actions } from "react-native-router-flux";
import { translate } from "../../helper/localization/locaizationMain";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import { chekcAuthError } from "../Util";
import AccountService from "./AccountService";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
import * as MediaLibrary from "expo-media-library";
import { FloDigitalErrorParse } from "../HttpModule";
class CrmService {
  @observable showNetworkError: boolean = false;
  @observable isLoading: boolean = false;
  @observable cases: any[] = [];
  @observable crmAccountInfo: any;
  @observable crmTeams: any[] = [];
  @observable reset: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action getCases = async (page: number, itemSize: number = 20) => {
    try {
      runInAction(() => {
        this.isLoading = true;
      });
      if (!this.crmAccountInfo) await this.crmLogin();
      if (this.crmTeams.length === 0) await this.crmGetTeams();

      if (this.crmTeams.length === 0) {
        this.isLoading = false;
        return;
      }

      var res = await axios.post(
        GetServiceUri(ServiceUrlType.CRM_CASE),
        {
          teamId: this.crmAccountInfo?.teamId,
          pageNumber: page,
          pageSize: itemSize,
        },
        { headers: AccountService.tokenizeHeader() }
      );

      if (res.status) {
        if (res.data.apiResultState === 0) {
          this.cases = [...this.cases, ...res.data.model];
          this.reset = page === 1;

          if (this.reset) this.cases = res.data.model;
        } else {
          // servis hatası
        }
      } else {
        // Buraya servise erişemedi hatası
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  @action crmLogin = async () => {
    try {
      let model = {
        employeeId: AccountService.employeeInfo.EfficiencyRecord,
        deviceId: "",
      };
      let accInfo = await axios.post(
        GetServiceUri(ServiceUrlType.CRM_LOGIN),
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      this.crmAccountInfo = accInfo.data.model;
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
    }
  };

  @action crmGetTeams = async () => {
    try {
      var res = await axios.get(GetServiceUri(ServiceUrlType.CRM_TEAM), {
        headers: AccountService.tokenizeHeader(),
      });

      if (res.status) {
        if (res.data.apiResultState === 0) {
          this.crmTeams = res.data.model;
        } else {
        }
      } else {
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
    }
  };

  @action crmGetCaseDetail = async () => {};

  @action updateCase = async (model: any) => {
    try {
      this.isLoading = true;
      let url =
        GetServiceUri(ServiceUrlType.CRM_CASE) +
        "/" +
        this.crmAccountInfo.portalUserId;

      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects

      for (var i = 0; i < model.pickImages.length; i++) {
        if (model.pickImages[i].Url.includes("base64,")) continue;

        let localUri = model.pickImages[i].Url;
        // telefondaki sabit dosyalardan seçili ise
        if (model.pickImages[i].Url.startsWith("ph://")) {
          var ml = await MediaLibrary.getAssetInfoAsync(
            model.pickImages[i].Url.slice(5)
          );
          if (ml.localUri === undefined) continue;
          localUri = ml.localUri;
        }

        let filename = localUri.split("/").pop();

        if (filename === undefined) continue;

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        //@ts-ignore
        formData.append("pickImages", { uri: localUri, name: filename, type });
      }

      formData.append("activityId", model.activityId);
      formData.append("crmTaskStateId", model.crmTaskStateId);
      formData.append("crmTeamId", model.crmTeamId);
      formData.append("inputText", model.inputText);
      formData.append("reasonForHolding", model.reasonForHolding);

      var res = await axios.post(url, formData, {
        headers: {
          ...AccountService.tokenizeHeader(),
          "content-type": "multipart/form-data",
        },
      });

      if (res.status === 200 && res.data.apiResultState === 0) {
        MessageBox.Show(
          translate("errorMsgs.recordSuccess"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {
            Actions.popTo("crmList");
          },
          () => {}
        );
      } else {
        MessageBox.Show(
          translate("errorMsgs.recordUpdateFail"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
      }
    } catch (err: any) {
      if (err?.response?.status === 700 || err?.response?.status === 401)
        FloDigitalErrorParse(err);
      else this.showNetworkError = false;
    } finally {
      this.isLoading = false;
      this.getCases(1, 20);
    }
  };

  @action crmGetOrders = async (orderId: string) => {
    try {
      this.isLoading = true;
      var res = await axios.get(
        `${GetServiceUri(ServiceUrlType.CRM_ORDER_CHECK)}${orderId}`,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (res.data.apiResultState === 0 && res.data.model) {
        Actions.replace("CrmOrderDetail", {
          orderDetail: res.data.model,
        });
      } else {
        MessageBox.Show(
          res.data.message,
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };

  //#region  Customer Complaint Management

  @observable complaints: any[] = [];
  @action getCustomerComplaintList = async (currentPage: number) => {
    try {
      this.isLoading = true;

      let result = await axios.post(
        GetServiceUri(ServiceUrlType.CRM_COMPLAINT_LIST),
        {
          storeCode: AccountService.getUserStoreId(),
          pageNumber: currentPage.toString(),
        },
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.apiResultState === 0) {
        if (currentPage === 1) this.complaints = result.data.model;
        else {
          runInAction(() => {
            let temp = [...this.complaints, ...result.data.model];

            this.complaints = temp;
          });
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action getCustomerComplaintDetail = async (taskId: string) => {
    try {
      this.isLoading = true;

      let result = await axios.post(
        `${GetServiceUri(ServiceUrlType.CRM_COMPLAINT_DETAIL)}/${taskId}`,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      return result.data.model;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return null;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action updateCustomerComplaintDetail = async (model: {
    phone: string;
    complaintType: string;
    title: string;
    orderNumber: string;
    fisrtName: string;
    lastName: string;
    description: string;
    medias: any[];
    taskId: string;
  }) => {
    try {
      this.isLoading = true;

      let formData = new FormData();

      if (
        model.fisrtName.trim() === "" ||
        model.lastName.trim() === "" ||
        model.phone.trim() === "" ||
        model.phone.trim().length < 19 ||
        model.title.trim() === "" ||
        model.description.trim() === ""
      ) {
        MessageBox.Show(
          "Tüm alanları eksiksiz ve doğru şekilde doldurun.",
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        return;
      }

      if (model.complaintType === "1" && model.orderNumber.trim() === "") {
        MessageBox.Show(
          "Sipariş numarasının girilmesi zorunludur.",
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        return;
      }

      formData.append("CrmId", model.taskId ? model.taskId : "");
      formData.append("Firstame", model.fisrtName);
      formData.append("LastName", model.lastName);
      formData.append("Phonenumber", model.phone);
      formData.append("Title", model.title);
      formData.append("Description", model.description);
      formData.append("OrderNumber", model.orderNumber);
      //@ts-ignore
      formData.append("StoreTypePickList", Number(model.complaintType));
      formData.append("StoreId", AccountService.getUserStoreId());

      for (var i = 0; i < model.medias.length; i++) {
        if (model.medias[i].Url.includes("base64,")) continue;

        let localUri = model.medias[i].Url;
        // telefondaki sabit dosyalardan seçili ise
        if (model.medias[i].Url.startsWith("ph://")) {
          var ml = await MediaLibrary.getAssetInfoAsync(
            model.medias[i].Url.slice(5)
          );
          if (ml.localUri === undefined) continue;
          localUri = ml.localUri;
        }

        let filename = localUri.split("/").pop();

        if (filename === undefined) continue;

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        //@ts-ignore
        formData.append("Attachment", { uri: localUri, name: filename, type });
      }

      let result = await axios.post(
        GetServiceUri(ServiceUrlType.CRM_COMPLAINT_SAVE_OR_CREATE),
        formData,
        {
          headers: {
            ...AccountService.tokenizeHeader(),
            "content-type": "multipart/form-data",
          },
        }
      );

      if (result.data.apiResultState === 0) {
        MessageBox.Show(
          model.taskId && model.taskId.length > 0
            ? "Kayıt güncellenmiştir."
            : "Kayıt Oluşturuldu",
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {
            this.getCustomerComplaintList(1);
            Actions.popTo("CrmCCList");
          },
          () => {}
        );
      } else {
        MessageBox.Show(
          "Kayıt oluşturulamadı, Bilgilerinizi kontrol ederek daha sonra deneyin.",
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
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
          "Kayıt oluşturulamadı, Bilgilerinizi kontrol ederek daha sonra deneyin.",
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action setsateCustomerComplaint = async (model: {
    crmId: string;
    stateCode: number;
  }) => {
    try {
      this.isLoading = true;

      model.stateCode = 2;

      let result = await axios.post(
        `${GetServiceUri(ServiceUrlType.CRM_SET_SATE)}`,
        model,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.apiResultState === 0) {
        this.isLoading = false;
        MessageBox.Show(
          "Kayıt başarıyla iptal edildi",
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {
            Actions.popTo("CrmCCList");
            this.getCustomerComplaintList(1);
          },
          () => {}
        );
      } else
        MessageBox.Show(
          translate("crmCrmCreateCustomerComplaint.errorMessage"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };
}

export default new CrmService();
