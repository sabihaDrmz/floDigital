import axios from "axios";
import linq from "linq";
import {
  makeObservable,
  observable,
  action,
  runInAction,
  configure,
  makeAutoObservable,
} from "mobx";
import { Actions } from "react-native-router-flux";
import { translate } from "../../helper/localization/locaizationMain";
import { FloDigitalErrorParse } from "../HttpModule";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import { chekcAuthError, toOrganization } from "../Util";
import AccountService from "./AccountService";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
import MessageBoxNew from "./MessageBoxNew";
//@ts-ignore
import base64 from "react-native-base64";
configure({
  enforceActions: "never",
});
class ProductService {
  @observable isLoading = false;
  @observable product: ProductProp | undefined | null;
  @observable stores: any;
  @observable animationType: number = 1;
  @observable kzQrCode: KzQrCodeModel | undefined | null;
  @observable kzQrCodeId: number | undefined | null;
  constructor() {
    makeAutoObservable(this);
  }

  @action getProduct = async (
    barcode: string,
    animationType: number = 1,
    isGeneric: boolean = false
  ) => {
    if (barcode === undefined || barcode === null) {
      MessageBox.Show(
        translate("errorMsgs.enterBarcode"),
        MessageBoxDetailType.Danger,
        MessageBoxType.Standart,
        () => {},
        () => {}
      );
      return;
    }
    this.isLoading = true;
    let startTime = new Date();
    this.animationType = animationType;
    try {
      let model = {
        barcode: barcode,
        vkorg: toOrganization(AccountService.employeeInfo.ExpenseLocationCode),
        storeId: AccountService.getUserStoreId(),
        isGeneric: false,
        genericCode: "",
      };

      if (isGeneric) {
        model.barcode = "";
        model.genericCode = barcode;
        model.isGeneric = true;
      }

      var res = await axios.post(
        GetServiceUri(ServiceUrlType.GET_STOCK),
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (
        res.status &&
        res.data &&
        (res.data.status.code === 200 || res.data.status.code === 300)
      ) {
        runInAction(() => {
          this.product = res.data.data;
          // E-Ticaret başta ve diğerleri Distance Göre sıralı
          var notEticaretData = linq
            .from(this.product?.stores || [])
            .where((x) => x.storeName !== "E-TİCARET")
            .orderBy((x) => x.distance)
            .toArray();
          var eticaretData = linq
            .from(this.product?.stores || [])
            .where((x) => x.storeName === "E-TİCARET")
            .toArray();
          eticaretData[0].storeName = translate(
            "crmCrmCreateCustomerComplaint.eCommerce"
          );
          if (this.product)
            //@ts-ignore
            this.product.stores = [...eticaretData, ...notEticaretData];
        });
        // Mevcut sahne ürün ekranı değil ise ürün ekranına yönlendir.
      } else if (res.data.status.code === 450) {
        MessageBox.Show(
          translate("errorMsgs.ecomServiceError"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        if (Actions.currentScene === "foundProduct")
          Actions.replace("_scTbFindBarcode");
        if (Actions.currentScene === "isoProduct") Actions.pop();
      } else if (res.data.status.code === 400) {
        MessageBox.Show(
          translate("errorMsgs.sapServiceError"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        if (Actions.currentScene === "foundProduct")
          Actions.replace("_scTbFindBarcode");
        if (Actions.currentScene === "isoProduct") Actions.pop();
      } else {
        MessageBox.Show(
          translate("errorMsgs.productNotFound"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        if (Actions.currentScene === "foundProduct")
          Actions.replace("_scTbFindBarcode");
        if (Actions.currentScene === "isoProduct") Actions.pop();
      }

      this.isLoading = false;
    } catch (err: any) {
      if (Actions.currentScene === "foundProduct")
        Actions.replace("_scTbFindBarcode");
      if (Actions.currentScene === "isoProduct") Actions.pop();
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  cancelIsLoading = () => {
    this.isLoading = false;
  };

  @action getQrCode = async (
    isResidualProduct: boolean,
    isMaterialCode: boolean,
    materialOrEanCode: string
  ) => {
    try {
      var model = {
        eanCode: this.product?.product.barcode,
        storeCode: AccountService.getUserStoreId(),
        isResidualProduct: isResidualProduct,
        employeeId: AccountService.tokenizeHeader().employeeId,
        materialCode: "",
      };

      if (isResidualProduct) {
        if (isMaterialCode) {
          model.materialCode = materialOrEanCode;
          model.eanCode = "";
        } else {
          model.eanCode = materialOrEanCode;
          model.materialCode = "";
        }
      }

      var res = await axios.post(
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "QrCodeGenerate/KzQrCode",
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (res.data && res.data.state === 1) {
        this.kzQrCode = res.data.model;

        if (res.data.model.kzQrCodeId) {
          this.kzQrCodeId = res.data.model.kzQrCodeId;
        }
        return true;
      } else {
        //SAP Servisine Ulaşılamıyor
        var message = "Не удалось связаться с SAP";
        if (res.data && res.data.state === 2) {
          switch (res.data.message) {
            case "028":
              //Hatalı Mağaza Kodu
              message = "Неверный код магазина";
              break;
            case "029":
              //EAN Kodunu doldurunuz
              message = "Заполните штрих-код";
              break;
            case "030":
              //Sipariş İçin Henüz QR Kod Oluşmamış
              message = "Для заказа еще не создан QR";
              break;
            case "031":
              //QR Kod Bulunamadı
              message = "QR-код не найден";
              break;

            default:
              break;
          }
        }

        MessageBoxNew.show(message, {
          type: MessageBoxType.Standart,
          yesButtonTitle: "Хорошо",
          yesButtonEvent: () => {},
        });
        return false;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    }
  };

  @action approveQrCode = async () => {
    try {
      var model = {
        guid: this.kzQrCode?.guid,
        qrCode: this.kzQrCode?.qrCode,
        storeCode: AccountService.getUserStoreId(),
        eanCode: this.product?.product.barcode,
        employeeId: AccountService.tokenizeHeader().employeeId,
      };

      var res = await axios.post(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "QrCodeGenerate/KzQrCodeApprove",
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (res.data && res.data.state === 1) {
        //Qr Onaylandı
        this.kzQrCodeId = res.data.model.kzQrCodeId;
        MessageBoxNew.show("QR-код подтвержден", {
          type: MessageBoxType.Standart,
          yesButtonTitle: "Хорошо",
          yesButtonEvent: () => {
            Actions.pop();
          },
        });

        return true;
      } else if (res.data && res.data.state === 2) {
        //Qr Onaylanamadı
        MessageBoxNew.show("QR не может быть подтвержден", {
          type: MessageBoxType.Standart,
          yesButtonTitle: "Хорошо",
          yesButtonEvent: () => {},
        });
      } else {
        // SAP servisine ulaşılamadı
        MessageBoxNew.show("Не удалось связаться с SAP", {
          type: MessageBoxType.Standart,
          yesButtonTitle: "Хорошо",
          yesButtonEvent: () => {},
        });
      }
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    }
  };

  @action findQrCode = async (id: number) => {
    try {
      var model = {
        id,
        barcode: this.product?.product.barcode,
      };

      var res = await axios.post(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "QrCodeGenerate/FindKzQrCode",
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );
      if (res.data && res.data.state === 1) {
        //Qr Onaylandı
        let dataModel: KzQrCodeModel = {
          qrCode: res.data.model.qrCode,
          guid: res.data.model.guid,
          quantity: 0,
        };
        this.kzQrCode = dataModel;
        this.kzQrCodeId = id;
        return true;
      } else {
        // exception hata
        MessageBoxNew.show(res.data.message, {
          type: MessageBoxType.Standart,
          yesButtonTitle: "Хорошо",
          yesButtonEvent: () => {},
        });
      }
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    }
  };

  @action findKzQrCodeWithQrCode = async (qrCode: string) => {
    try {
      this.isLoading = true;
      var model = {
        qrCode: base64.encode(qrCode),
        barcode: this.product?.product.barcode,
        storeCode: AccountService.getUserStoreId(),
        employeeId: AccountService.tokenizeHeader().employeeId,
      };

      var res = await axios.post(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "QrCodeGenerate/FindKzQrCodeIdWithQrCode",
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      console.log(11111);
      console.log(model);

      this.isLoading = false;
      if (res.data && res.data.state === 1) {
        //Qr Onaylandı
        let dataModel: KzQrCodeModel = {
          qrCode: res.data.model.qrCode,
          guid: res.data.model.guid,
          quantity: 0,
        };
        this.kzQrCode = dataModel;
        this.kzQrCodeId = res.data.model.id;
        return true;
      } else {
        // exception hata
        MessageBoxNew.show(res.data.message, {
          type: MessageBoxType.Standart,
          yesButtonTitle: "Жақсы",
          yesButtonEvent: () => {},
        });
      }
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    }
  };
}

export default new ProductService();

export interface ProductModel {
  barcode: string;
  site: string;
  store: string;
  storeName: string;
  county: string;
  city: string;
  name: string;
  brand: string;
  color: string;
  size: string;
  price: number;
  oldPrice: number;
  sku: string;
  parentSku: string;
  qty: number;
  gender: string;
  model: string;
  saya: string;
  currency: string;
  type: string;
  images: [string];
  outlet: string;
}
export interface ProductProp {
  product: ProductModel;
  tagValue: [
    {
      tag: string;
      key: string;
      title: string;
      value: string;
    }
  ];
  options: [
    {
      image: string;
      isSelected: true;
      barcode: string;
      sku: string;
      color: string;
      price: string;
    }
  ];
  sizes: {
    store: [
      {
        size: string;
        barcode: string;
        sku: string;
        qty: number;
        storeName: string;
      }
    ];
    ecom: [
      {
        size: string;
        barcode: string;
        sku: string;
        qty: number;
      }
    ];
  };
  stores: [
    {
      qty: number;
      store: string;
      storeName: string;
      county: string;
      city: string;
      distance: number;
      longitude: number;
      latitude: number;
    }
  ];
  ecomProductFooter: {
    price: number;
    shippingPrice: number;
    firstDate: string;
    lastDate: string;
    maxInstallment: string;
    limit: number;
    discountPrice: number;
  };
  similarProducts: {
    itemGroupId: string;
    pageNo: number;
    storeCode: string;
    similarProducts: SimilarProductModel[];
  };
}
export interface KzQrCodeModel {
  qrCode: string;
  guid: string;
  quantity: number;
}

export interface SimilarProductModel {
  category: string;
  name: string;
  imageUrl: string;
  barcode: string;
  color: string;
  size: string;
}
