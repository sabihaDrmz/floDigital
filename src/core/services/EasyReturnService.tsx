import axios from "axios";
//TODO: EXPO expo-camera   +++++   type için kullanılmış sadece, any olarak setledim .
// import { CameraCapturedPicture } from "expo-camera";
import {
  action,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { Actions } from "react-native-router-flux";
import { translate } from "../../helper/localization/locaizationMain";
import { DetailImage, TransactionLineDetail } from "../models/EasyReturnDetail";
import { EasyReturnReason } from "../models/EasyReturnReason";
import {
  EasyReturnTrasaction,
  EasyReturnTrasactionLine,
  TransactionSource,
  TransactionState,
  TransactionType,
} from "../models/EasyReturnTrasnaction";
import { PaymentTypeDetail } from "../models/PaymentType";
import {
  FloResultCode,
  ServiceResponseBase,
} from "../models/ServiceResponseBase";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import { chekcAuthError } from "../Util";
import AccountService from "./AccountService";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
//TODO: EXPO exPrint
// import * as exPrint from "expo-print";
import RNPrint from 'react-native-print';

import {
  BrokenProductSapResult,
  BrokenProductSearchModel,
} from "../models/BrokenProductSearchModel";
import { OmcRejectCargoFindResult } from "../models/OmcRejectCargoFindResult";
import {
  FloDigitalErrorParse,
  FloDigitalResponseParser,
  MakeRequestOptions,
} from "../HttpModule";
import MessageBoxNew from "./MessageBoxNew";
import { ErFiche, ErOrder } from "../models/ErFindFicheItem";
import { ErFindFicheResult } from "../models/ReturnedProduct/ErFindFicheResult";
import { Platform } from "react-native";
import ApplicationGlobalService from "./ApplicationGlobalService";
//import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
//TODO: EXPO MediaLibrary
// import * as MediaLibrary from "expo-media-library";

class EasyReturnService {
  @observable isLoading: boolean = false;
  @observable currentFiche?: GeniusFiche;
  @observable currentFicheList: GeniusFiche[] = [];
  @observable isBrokenComplete = false;

  // Find Product model
  @observable findFicheRequest: CheckEasyReturnRequestModel = {
    activeStore: AccountService.getUserStoreId(),
    gsm: "",
    paymentType: "",
    receiptNumber: __DEV__ ? "M400300102G904270001" : "",
    shippingStore: "",
    shippingDate: "",
    barcode: "",
  };
  // Returun Product Info
  @observable returnType: number = 0;
  @observable returnSelectItemPropMap: GeniusFicheRequestDetail[] = [];

  //
  constructor() {
    makeAutoObservable(this);
  }

  @action runReturnEngine = async () => {
    // easyReturnChangeProductInfo
  };

  @action selectReasonForProduct = async (barcode: string, reason: any) => {
    let product = this.returnSelectItemPropMap.find(
      (x) => x.barcode == barcode
    );

    if (product) {
      product.reason = reason;

      await this.transactionUpdateline(barcode);
    }
  };

  @action selectQuantityForProduct = async (barcode: string, quantity: any) => {
    let product = this.returnSelectItemPropMap.find(
      (x) => x.barcode == barcode
    );

    if (product) {
      product.item_quantity = quantity.id;
      await this.transactionUpdateline(barcode);
    }
  };

  @action setReturnType = async (rtnType: number = 1) => {
    this.returnType = rtnType;

    this.returnSelectItemPropMap = [];
    if (rtnType === 3) {
      let items = this.currentFiche?.data.filter((x) => x.isCancel && x.isOmc);

      //@ts-ignore
      for (var i = 0; i < items?.length; i++) {
        //@ts-ignore
        let model = items[i];

        // @ts-ignore
        this.returnSelectItemPropMap.push(model);
      }
    }

    if (this.transaction)
      await this.updateTransaction(
        this.returnType + 1,
        this.transaction.processTypeSource
      );
  };

  @action selectReturneeItem = async (model: GeniusFicheDetail) => {
    var findItem = this.returnSelectItemPropMap.find(
      (x) => x.barcode === model.barcode
    );

    if (findItem) {
      var findIndex = this.returnSelectItemPropMap.findIndex(
        (x) => x.barcode === model.barcode
      );

      var r = await this.transactionRemoveLine(model.barcode);
      if (r) {
        this.returnSelectItemPropMap.splice(findIndex, 1);
      }
    } else {
      this.returnSelectItemPropMap.push({
        barcode: model.barcode,
        productName: model.productName,
        sku: model.sku,
        picture: model.picture,
        variantNo: model.variantNo,
        quantity: model.quantity,
        color: model.color,
        size: model.size,
        productDescription: model.productDescription,
        price: model.price,
        returnItemCount: model.returnItemCount,
        returnPrice: model.returnPrice,
        reason: undefined,
        item_quantity: 1,
        isCancel: model.isCancel,
        isOmc: model.isOmc,
        kdv: model.kdv,
      });

      let r = await this.transactionAddLine(model.barcode);

      // Eğer sunucuya yazma başarısız olursa işlemi geri al
      if (!r) {
        findIndex = this.returnSelectItemPropMap.findIndex(
          (x) => x.barcode === model.barcode
        );

        this.returnSelectItemPropMap.splice(findIndex, 1);
      }
    }
  };

  @action findFiche = async (isRouting: boolean = true) => {
    if (this.isLoading) return;
    try {
      this.isLoading = true;
      this.returnSelectItemPropMap = [];
      this.returnType = 0;

      var tempModel = Object.assign({}, this.findFicheRequest);
      tempModel.paymentType = this.findFicheRequest.paymentType;

      if (
        tempModel.gsm === "" &&
        tempModel.barcode === "" &&
        tempModel.shippingStore === "" &&
        tempModel.gsm === ""
      ) {
        MessageBox.Show(
          translate("servicesEasyReturnService.voucherNotFound"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        return;
      }

      tempModel.gsm = tempModel.gsm
        ?.substring(1)
        // @ts-ignoreFlo
        .replace(" ", "")
        .replace("(", ")")
        .replace(")", "");
      var result = await axios.post(
        GetServiceUri(ServiceUrlType.EASY_RETURN_FIND_FICHE),
        tempModel,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.status === 200) {
        if (result.data.isValid && result.data.state === 1) {
          if (result.data.model.length < 1) {
            MessageBox.Show(
              translate("servicesEasyReturnService.voucherNotFound"),
              MessageBoxDetailType.Information,
              MessageBoxType.Standart,
              () => {},
              () => {}
            );
          } else {
            this.currentFicheList = result.data.model;
            if (isRouting) Actions["easyFindFicheList"]();
          }
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };

  @action checkEasyReturn = async (
    customSource: TransactionSource = TransactionSource.WithDocNumber,
    isRouting: boolean = true
  ) => {
    if (this.isLoading && isRouting) return;
    try {
      if (isRouting) this.transaction = undefined;
      this.returnSelectItemPropMap = [];
      this.transactionLineDetails = [];
      this.isLoading = true;
      this.returnType = 0;

      if (
        this.findFicheRequest.receiptNumber === undefined ||
        this.findFicheRequest.receiptNumber === ""
      ) {
        MessageBox.Show(
          translate("servicesEasyReturnService.voucherNotFound"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        return;
      }

      var result = await axios.post(
        GetServiceUri(ServiceUrlType.EASY_RETURN_CHECK_FICHE),
        this.findFicheRequest,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.status === 200) {
        if (result.data.isValid && result.data.state === 1) {
          if (result.data.model.length < 1) {
            MessageBox.Show(
              translate("servicesEasyReturnService.voucherNotFound"),
              MessageBoxDetailType.Information,
              MessageBoxType.Standart,
              () => {},
              () => {}
            );
          } else {
            this.currentFiche = result.data.model[0];
            if (isRouting) {
              await this.makeTransaction(customSource);
              Actions.replace("easyReturnProduct");
            }
          }
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };

  //#region Transaction

  // Mevcut transaction
  @observable transaction?: EasyReturnTrasaction;

  /*
   * Kaynağı belirtilmiş öğe için bir transaction başlat
   * Veritabanına bir header oluşturur
   */
  @action makeTransaction = async (source: TransactionSource) => {
    try {
      console.trace(`Making Transaction with Source : ${source}`);

      // Fiş yok ise işlem yapma
      if (!this.currentFiche) return;

      // model oluştur
      let model: EasyReturnTrasaction = {
        id: 0,
        ficheNumber: this.currentFiche.ficheKey,
        ficheDate: this.currentFiche.ficheDate,
        ficheTotal: Number(this.currentFiche.totalPrice),
        paymentTypeId: 1,

        sellerStore: this.currentFiche.storeNumber,
        inquiryStore: AccountService.getUserStoreId(),
        inquiryPerson: AccountService.employeeInfo.EfficiencyRecord,

        customerName: this.currentFiche.customerName,
        customerGsm: this.currentFiche.customerPhone,

        processType: TransactionType.Return,
        processTypeSource: source,
        status: TransactionState.Draft,
      };

      // Network işlemleri
      let res = await axios.post<ServiceResponseBase<EasyReturnTrasaction>>(
        GetServiceUri(ServiceUrlType.ER_TRANSACTION_CREATE),
        model,
        { headers: AccountService.tokenizeHeader() }
      );

      if (res.data.state === FloResultCode.Successfully) {
        res.data.model.easyReturnTrasactionLines = [];
        this.transaction = res.data.model;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action updateTransaction = async (
    type: TransactionType,
    source: TransactionSource = TransactionSource.WithDocNumber
  ) => {
    /// Hata ayıklama
    try {
      this.isLoading = true;
      console.trace(
        `Update Transaction with Source : ${source} - Type: ${type}`
      );

      // Bir transaction değil ise önde bir transaction oluştur
      if (!this.transaction) {
        await this.makeTransaction(source);
      }

      if (this.transaction) {
        // bir sunucu modeli oluşturalım
        this.transaction.processType = type;
        this.transaction.processTypeSource = source;

        let model: any = {
          id: this.transaction.id,
          ficheNumber: this.transaction.ficheNumber,
          ficheDate: this.transaction.ficheDate,
          ficheTotal: this.transaction.ficheTotal,
          paymentTypeId: this.transaction.paymentTypeId,

          sellerStore: this.transaction.sellerStore,
          inquiryStore: this.transaction.inquiryStore,
          inquiryPerson: this.transaction.inquiryPerson,

          customerName: this.transaction.customerName,
          customerGsm: this.transaction.customerGsm,

          processType: this.transaction.processType,
          processTypeSource: this.transaction.processTypeSource,
          status: this.transaction.status,
        };

        let res = await axios.post<ServiceResponseBase<EasyReturnTrasaction>>(
          GetServiceUri(ServiceUrlType.ER_TRANSACTION_UPDATE),
          model,
          { headers: AccountService.tokenizeHeader() }
        );
      }

      //TODO: Sunucuya gönderim işlemleri
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };

  @action transactionAddLine = async (rowBarcode: string): Promise<boolean> => {
    try {
      this.isLoading = true;

      let selectedProduct = this.returnSelectItemPropMap.find(
        (x) => x.barcode == rowBarcode
      );

      if (!selectedProduct) return false;

      if (!this.transaction) return false;

      let model: EasyReturnTrasactionLine = {
        id: 0,
        transactionId: this.transaction.id,
        barcode: selectedProduct.barcode,
        productName: selectedProduct.productName,
        productDescription: selectedProduct.productDescription,
        sku: selectedProduct.sku,
        quantity: Number(selectedProduct.quantity),
        colour: selectedProduct.color,
        size: selectedProduct.size,
        productPrice: Number(selectedProduct.price),
        productReturnCount: Number(1),
        productAlreadyReturnCount: Number(selectedProduct.returnItemCount),
        productReturnPrice: Number(selectedProduct.returnPrice),
        reasonId: 0,
        picture: "",
      };

      let res = await axios.post<ServiceResponseBase<EasyReturnTrasactionLine>>(
        GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_CREATE),
        model,
        { headers: AccountService.tokenizeHeader() }
      );

      if (res.data.state === FloResultCode.Successfully) {
        this.transaction.easyReturnTrasactionLines?.push(res.data.model);
        return true;
      }
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action transactionUpdateline = async (rowBarcode: string) => {
    try {
      if (!this.currentFiche || !this.transaction) {
        return false;
      }
      // line boş ise devam etme
      if (!this.transaction.easyReturnTrasactionLines) return false;

      var line = this.transaction.easyReturnTrasactionLines.find(
        (x) => x.barcode === rowBarcode
      );

      if (!line) return false;

      line.quantity = Number(
        this.returnSelectItemPropMap.find((x) => x.barcode === rowBarcode)
          ?.quantity
      );

      line.reasonId = Number(
        this.returnSelectItemPropMap.find((x) => x.barcode === rowBarcode)
          ?.reason?.id
      );

      let res = await axios.post<ServiceResponseBase<EasyReturnTrasactionLine>>(
        GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_UPDATE),
        line,
        { headers: AccountService.tokenizeHeader() }
      );
      if (res.data.state === FloResultCode.Successfully) {
        return true;
      }
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action transactionRemoveLine = async (
    rowBarcode: string
  ): Promise<boolean> => {
    try {
      // Eğer geçerli bir fiş üzerinde işlem yapılmıyorsa
      // Transaction boş ise kullanma
      if (!this.currentFiche || !this.transaction) {
        return false;
      }
      // line boş ise devam etme
      if (!this.transaction.easyReturnTrasactionLines) return false;

      var line = this.transaction.easyReturnTrasactionLines.find(
        (x) => x.barcode === rowBarcode
      );

      // Eğer satır bulunamazsa devam etme
      if (!line) return false;

      // Model oluştur
      let model = {
        id: line.id,
      };

      let result = await axios.post<ServiceResponseBase<EasyReturnTrasaction>>(
        `${GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_REMOVE)}?id=${
          model.id
        }`,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
        let index = this.transaction.easyReturnTrasactionLines.findIndex(
          (x) => x.barcode === rowBarcode
        );

        this.transaction.easyReturnTrasactionLines.splice(index, 1);
        return true;
      }
      return false;

      // TODO: Sunucuya gönderim işlemleri
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
    }

    return false;
  };

  @action clearTransaction = async () => {
    this.transaction = undefined;
    this.transactionLineDetails = [];
  };
  //#endregion

  //#region  Broken Product

  @observable transactionLineDetails: BrokenProductDetailMap[] = [];

  @action getTransactionLineDetail = async (
    index: number,
    barcode: string
  ): Promise<any> => {
    try {
      // Detay satırını ara
      let currentDetail = this.transactionLineDetails.find(
        (x) => x.index === index && x.barcode === barcode
      );

      // Bir detay satırı var mı ?
      if (currentDetail)
        // Detay satırını geri gönder
        return currentDetail;

      if (this.transaction?.easyReturnTrasactionLines) {
        // Transaction line
        var line = this.transaction.easyReturnTrasactionLines.find(
          (x) => x.barcode === barcode
        );

        // Yeni bir detay sayası oluştur.
        let result = await axios.post(
          GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_CREATE),
          {
            easyReturnTransactionLineId: line?.id,
            reasonId: 0,
            description: "",
            isStoreChiefApprove: false,
          },
          { headers: AccountService.tokenizeHeader() }
        );

        if (result.data.state === FloResultCode.Successfully) {
          this.transactionLineDetails.push({
            index,
            barcode,
            detail: result.data.model,
          });

          return await this.getTransactionLineDetail(index, barcode);
        } else {
          MessageBoxNew.show(result.data.message);
        }
      }
      return undefined;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return undefined;
    } finally {
    }
  };

  @action updateTransactionLineDetail = async (
    index: number,
    barcode: string,
    reasonId: number,
    description: string,
    isStoreChiefApprove?: boolean,
    sapAIApprove?: boolean
  ) => {
    try {
      let dline = await this.getTransactionLineDetail(index, barcode);

      if (dline) {
        let model: TransactionLineDetail = {
          reasonId,
          description,
          id: dline?.detail.id,
          easyReturnTransactionLineId:
            dline?.detail.easyReturnTransactionLineId,
          isStoreChiefApprove:
            isStoreChiefApprove !== undefined && isStoreChiefApprove
              ? true
              : false,
          aIResult: sapAIApprove !== undefined && sapAIApprove ? true : false,
        };

        // (model);

        var result = await axios.post<
          ServiceResponseBase<TransactionLineDetail>
        >(
          GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_UPDATE),
          model,
          { headers: AccountService.tokenizeHeader() }
        );

        if (result.data.state === FloResultCode.Successfully) {
          let lineIndex = this.transactionLineDetails.findIndex(
            (x) => x.barcode === barcode && x.index === index
          );

          this.transactionLineDetails[lineIndex].detail.description =
            description;
          this.transactionLineDetails[lineIndex].detail.reasonId = reasonId;
        } else {
          MessageBoxNew.show(result.data.message);
          throw new Error(result.data.message);
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      // ('---- err');
      // (err);
    } finally {
    }
  };

  @action detailAddPicture = async (
    index: number,
    barcode: string,
    picture: any
  ) => {
    try {
      let currentDetail = this.transactionLineDetails[0];

      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects

      let localUri = picture.uri;
      let filename = localUri.split("/").pop();

      if (filename) {
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        //@ts-ignore
        formData.append("detailId", currentDetail.detail.id);
        //@ts-ignore
        formData.append("image", { uri: localUri, name: filename, type });
      }

      var result = await axios.post<ServiceResponseBase<DetailImage>>(
        GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_CREATE_IMAGE),
        formData,
        {
          headers: {
            ...AccountService.tokenizeHeader(),
            "content-type": "multipart/form-data",
          },
        }
      );

      if (result.data.state === FloResultCode.Successfully) {
        let lineIndex = this.transactionLineDetails.findIndex(
          (x) => x.barcode === barcode && x.index === index
        );

        if (!this.transactionLineDetails[lineIndex].detail.images)
          this.transactionLineDetails[lineIndex].detail.images = [];

        this.transactionLineDetails[lineIndex].detail.images?.push(
          result.data.model
        );
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action detailDeletePicture = async (
    index: number,
    barcode: string,
    pictureId: number
  ): Promise<any> => {
    try {
      var result = await axios.post<ServiceResponseBase<DetailImage>>(
        `${GetServiceUri(
          ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_DELETE_IMAGE
        )}?id=${pictureId}`
      );

      if (result.data.state === FloResultCode.Successfully) {
        let lineIndex = this.transactionLineDetails.findIndex(
          (x) => x.barcode === barcode && x.index === index
        );

        if (
          this.transactionLineDetails[lineIndex] !== undefined &&
          this.transactionLineDetails[lineIndex].detail !== undefined &&
          this.transactionLineDetails[lineIndex].detail.images !== undefined
        ) {
          let pictureIndex = this.transactionLineDetails[
            lineIndex
          ].detail.images?.findIndex((x) => x.id === pictureId);

          if (pictureIndex !== undefined)
            this.transactionLineDetails[lineIndex].detail.images?.splice(
              pictureIndex,
              1
            );
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  //#endregion

  //#region  Print Doc and comlete transaction
  //RFDM4120AM0000021130
  // Print doc request
  @action printDoc = async (
    name: string,
    tckn: string,
    address: string,
    rfdm: string,
    paymentTypes: PaymentTypeDetail[],
    processOverride?: TransactionType
  ) => {
    if (this.isLoading) return;
    try {
      this.isLoading = true;
      if (this.transaction) {
        let trn: any = {
          id: this.transaction.id,
          ficheNumber: this.transaction.ficheNumber,
          ficheDate: this.transaction.ficheDate,
          ficheTotal: this.transaction.ficheTotal,
          paymentTypeId: this.transaction.paymentTypeId,

          sellerStore: this.transaction.sellerStore,
          inquiryStore: this.transaction.inquiryStore,
          inquiryPerson: this.transaction.inquiryPerson,

          customerName: this.transaction.customerName,
          customerGsm: this.transaction.customerGsm,

          processType: processOverride !== undefined ? processOverride : 2,
          processTypeSource: this.transaction.processTypeSource,
          status: this.transaction.status,
        };

        trn.rfdm = rfdm;
        trn.nameSurname = name;
        trn.tckn = tckn;
        trn.adress = address;

        trn.transactionPaymentTpyes = {
          transactionId: this.transaction?.id,
          paymentTypes: paymentTypes
            .filter((x: PaymentTypeDetail) => x !== undefined)
            .map((x: PaymentTypeDetail) => {
              return {
                key: x.key,
                value: Number(x.value),
                description: x.description,
              };
            }),
        };

        let result = await axios.post<
          ServiceResponseBase<EasyReturnTrasaction>
        >(GetServiceUri(ServiceUrlType.ER_TRANSACTION_UPDATE), trn, {
          headers: AccountService.tokenizeHeader(),
        });

        if (result.data.state === FloResultCode.Successfully) return true;
        else {
          MessageBox.Show(
            result.data.message,
            MessageBoxDetailType.Danger,
            MessageBoxType.Standart,
            () => {},
            () => {}
          );
        }
      }
      return false;
    } catch (err: any) {
      this.isLoading = false;
      FloDigitalErrorParse(err);
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action returnCommit = async () => {
    try {
      let saveUri =
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
        "genius/SendReturnProduct?transactionId=" +
        this.transaction?.id;

      let result = await axios.post(
        saveUri,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
       await RNPrint.print({
          html: result.data.model.expenseSlipUrl,
        });



        MessageBoxNew.show("Gider pusulası başarı ile oluşturuldu.");
        if (this.source === 2) Actions.popTo("erBrokenFindFiche");
        else Actions.popTo("erReturnFindFiche");
        return true;
      } else {
        MessageBox.Show(
          result.data.message,
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
      }

      return false;
    } catch (err: any) {
      if (
        err?.response?.status === 700 ||
        err?.response?.status === 401 ||
        err?.response?.status === 409
      )
        FloDigitalErrorParse(err);
      else
        MessageBox.Show(
          translate("servicesEasyReturnService.errorTryAgain"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
      return false;
    } finally {
    }
  };
  //#endregion

  //#region Easy Return

  @action searchBrokenProduct = async (phone: string, code: string) => {
    try {
      runInAction(() => (this.isLoading = true));

      let result = await axios.post<
        ServiceResponseBase<BrokenProductSearchModel[]>
      >(
        `${GetServiceUri(ServiceUrlType.ER_BROKEN_PRODUCT_SEARCH)}?phone=${phone
          .substring(1)
          // @ts-ignoreFlo
          .replace(" ", "")
          .replace("(", ")")
          .replace(")", "")}&code=${code}`,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
        if (result.data.model.length === 0) {
          // telefonla arama
          result = await axios.post<
            ServiceResponseBase<BrokenProductSearchModel[]>
          >(
            `${GetServiceUri(
              ServiceUrlType.ER_BROKEN_PRODUCT_SEARCH
            )}?phone=${code}`,
            {},
            { headers: AccountService.tokenizeHeader() }
          );

          Actions["easyReturnUibListScreen"]({
            sapRes: result.data.model,
          });
          return;
        }
        this.transaction = result.data.model[0].easyReturnTransaction;
        this.findFicheRequest.receiptNumber = this.transaction.ficheNumber;
        await this.checkEasyReturn(this.transaction.processTypeSource, false);

        //@ts-ignore
        this.transaction.easyReturnTrasactionLine?.map((x) => {
          let model = this.currentFiche?.data.find(
            (y) => x.barcode === y.barcode
          );
          if (model)
            this.returnSelectItemPropMap.push({
              barcode: model.barcode,
              productName: model.productName,
              sku: model.sku,
              picture: model.picture,
              variantNo: model.variantNo,
              quantity: model.quantity,
              color: model.color,
              size: model.size,
              productDescription: model.productDescription,
              price: model.price,
              returnItemCount: model.returnItemCount,
              returnPrice: model.returnPrice,
              reason: undefined,
              item_quantity: 1,
              isCancel: model.isCancel,
              isOmc: model.isOmc,
              kdv: model.kdv,
            });
        });
        Actions["easyReturnUibScreen"]({
          sapRes: result.data.model[0].sapResult,
        });
      } else
        MessageBox.Show(
          result.data.message,
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
    } catch (err: any) {
      if (
        err?.response?.status === 700 ||
        err?.response?.status === 401 ||
        err?.response?.status === 409
      )
        FloDigitalErrorParse(err);
      else
        MessageBox.Show(
          translate("servicesEasyReturnService.errorTryAgain"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  //#endregion

  @observable CancellationOrderNotFoundPopup: boolean = false;

  @observable isRejectCargoLoading: boolean = false;
  @observable omsRejectCargoRes: OmcRejectCargoFindResult | undefined;
  @observable selectedRejectCargos: ErRejectModel[] = [];
  @action FindRejectCargoFiche = async (props: { orderBarcode: string }) => {
    try {
      if (props.orderBarcode === "") {
        MessageBoxNew.show("Sipariş Bulunamadı", {
          type: MessageBoxType.OrderNotFound,
          customParameters: {
            description: "Lütfen sipariş numaranızı kontrol ediniz",
            orderNumber: props.orderBarcode,
          },
        });
        return;
      }
      this.isRejectCargoLoading = true;

      let uri = GetServiceUri(ServiceUrlType.EASY_RETURN_BASE) + "GetByOrderId";

      let model = {
        orderId: `${props.orderBarcode}`,
      };

      // // (uri);

      let result = await axios.post<
        ServiceResponseBase<OmcRejectCargoFindResult>
      >(uri, model, {
        headers: AccountService.tokenizeHeader(),
      });

      // // (JSON.stringify(result.data));
      if (result.data.state === FloResultCode.Successfully) {
        this.omsRejectCargoRes = result.data.model;
        this.selectedRejectCargos = [];
        Actions.jump("backCargoScreen");
      } else {
        if (result.data.message === "Virman bilgisi bulunamadı !") {
          MessageBoxNew.show(translate("messageBox.refundComplete"), {
            type: MessageBoxType.OrderNotFound,
            customParameters: {
              description: translate("messageBox.fitTicket"),
              type: "2",
              orderNumber: props.orderBarcode,
            },
          });
          return;
        }
        MessageBoxNew.show("Sipariş Bulunamadı", {
          type: MessageBoxType.OrderNotFound,
          customParameters: {
            description: "Lütfen sipariş numaranızı kontrol ediniz",
            orderNumber: props.orderBarcode,
          },
        });
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => {
        this.isRejectCargoLoading = false;
      });
    }
  };

  @observable loadingCompleteReject: boolean = false;
  @action CompleteRejectCargo = async (_props: any) => {
    this.loadingCompleteReject = true;
    if (!this.omsRejectCargoRes) return;

    let model: any[] = [];
    let warehouses: any[] = [];
    this.selectedRejectCargos.map((x) => {
      let m: any[] = [];

      for (var i = 0; i < x.qty; i++) {
        let item = this.omsRejectCargoRes?.basketItems.find(
          (y) =>
            m.findIndex(
              (t) =>
                t.returnNumber === `FD-${y.ecomLineId}` &&
                t.barcode === y.barcode
            ) === -1 && y.isEasyReturn
        );

        if (!warehouses.includes(item?.sourceStore))
          warehouses.push(item?.sourceStore);

        if (item) {
          m.push({
            processType: 2,
            fisKey: this.omsRejectCargoRes?.order.ficheNumber,
            returnNumber: `FD-${item.ecomLineId}`,
            orderId: this.omsRejectCargoRes?.order.orderId,
            orderSplitId: this.omsRejectCargoRes?.order.orderId,
            sku: item.sku,
            barcode: item.barcode,
            quantity: 1,
            returnStore: AccountService.getUserStoreId(),
            sendStore: this.omsRejectCargoRes?.order.storeId.toString(),
            returnWareHouse: "",
            sendWareHouse: "",
            returnDate: `${new Date().toISOString()}`,
            cancelSource: "-",
            serviceRequestSource: 2,
            endDate: `${new Date().toISOString()}`,
            ProcessUser: AccountService.employeeInfo.EfficiencyRecord, //'09991',
            EcomBasketItemId: item.ecomLineId.toString(),
          });
        }
      }

      model = [...model, ...m];
    });

    let validate = true;
    // Validation
    warehouses.map((wh) => {
      this.omsRejectCargoRes?.basketItems
        .filter((bi) => bi.sourceStore === wh)
        .map((bi) => {
          if (
            model.findIndex((m) => m.returnNumber === `FD-${bi.ecomLineId}`) ===
            -1
          )
            validate = false;
        });
    });
    runInAction(() => (this.loadingCompleteReject = false));

    if (!validate) {
      MessageBoxNew.show(
        "Bu iade işleminde siparişe ait, okutulmamış ürünler vardır",
        {
          customParameters: {
            description: "İade işlemine nasıl devam etmek istersiniz?",
            type: "10",
            orderNo: this.omsRejectCargoRes.order.orderId,
          },
          type: MessageBoxType.OrderNotFound,
          yesButtonEvent: async () => {
            runInAction(() => (this.loadingCompleteReject = true));
            await axios
              .post(
                GetServiceUri(ServiceUrlType.SYSTEM_API) +
                  "EasyReturn/EasyReturnOmcQueueAdd",
                model,
                MakeRequestOptions()
              )
              .then((res) =>
                FloDigitalResponseParser<any>(res, (result) => {
                  runInAction(() => {
                    Actions.pop();
                    this.omsRejectCargoRes = undefined;
                    this.selectedRejectCargos = [];
                  });

                  // // (result);
                  if (result.errorList.length > 0) {
                    MessageBox.Show(
                      "Bu siparişe ait ürün daha önce iade edilmiştir.",
                      MessageBoxDetailType.Danger,
                      MessageBoxType.Standart,
                      () => {},
                      () => {}
                    );
                  } else {
                    MessageBox.Show(
                      "İşlem başarıyla tamamlandı.",
                      MessageBoxDetailType.Danger,
                      MessageBoxType.Standart,
                      () => {},
                      () => {}
                    );
                  }
                })
              )
              .catch((err) => FloDigitalErrorParse(err))
              .finally(() =>
                runInAction(() => (this.loadingCompleteReject = false))
              );
          },
        }
      );
    } else {
      runInAction(() => (this.loadingCompleteReject = true));
      await axios
        .post(
          GetServiceUri(ServiceUrlType.SYSTEM_API) +
            "EasyReturn/EasyReturnOmcQueueAdd",
          model,
          MakeRequestOptions()
        )
        .then((res) =>
          FloDigitalResponseParser<any>(res, (result) => {
            runInAction(() => {
              Actions.pop();
              this.omsRejectCargoRes = undefined;
              this.selectedRejectCargos = [];
            });

            // // (result);
            if (result.errorList.length > 0) {
              MessageBox.Show(
                "Bu siparişe ait ürün daha önce iade edilmiştir.",
                MessageBoxDetailType.Danger,
                MessageBoxType.Standart,
                () => {},
                () => {}
              );
            } else {
              MessageBox.Show(
                "İşlem başarıyla tamamlandı.",
                MessageBoxDetailType.Danger,
                MessageBoxType.Standart,
                () => {},
                () => {}
              );
            }
          })
        )
        .catch((err) => FloDigitalErrorParse(err))
        .finally(() => runInAction(() => (this.loadingCompleteReject = false)));
    }
  };

  @action RemoveRejectCargo = async (tempList: ErRejectModel[]) => {
    // // (tempList);
    this.selectedRejectCargos = tempList;
  };

  @observable ErFicheList: ErFiche[] = [];
  @action FindFiche = async (query: {
    phone: string;
    startDate?: string;
    endDate?: string;
    barcode: string;
    storeNo: number;
  }) => {
    try {
      this.isLoading = true;

      // // (query);
      // // (query);
      let result = await axios.post<ServiceResponseBase<ErFiche[]>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Cancel/FindDocument",
        query,
        MakeRequestOptions()
      );
      // // (result.data);

      if (result.data.isValid) {
        this.ErFicheList = result.data.model;
        Actions.jump("erFindFicheList");
      } else {
        MessageBoxNew.show(
          "Girdiğiniz bilgiler ile eşleşen \nFiş / Sipariş bulunamadı"
        );
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };

  @observable ErOrder: ErOrder[] = [];
  @action SearchFiche = async (query: {
    voucherNo: string;
    orderNo: string;
    ficheNumber: string;
  }) => {
    try {
      this.isLoading = true;

      // // (query);
      let result = await axios.post<ServiceResponseBase<ErOrder[]>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Cancel/Search",
        query,
        MakeRequestOptions()
      );
      // // (JSON.stringify(result.data));

      if (result.data.isValid) {
        this.ErOrder = result.data.model;
        Actions.jump("cancelList");
      } else {
        MessageBoxNew.show(result.data.message);
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };

  @observable validationTime: number = 0;
  @observable validationTimer: any | undefined = undefined;
  @action InitializeCancellationEvent = async (query: any) => {
    this.isLoading = true;

    try {
      let result = await axios.post<ServiceResponseBase<boolean>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Cancel/InitializeCancel",
        query,
        MakeRequestOptions()
      );

      if (result.data.state === FloResultCode.Successfully) {
        this.validationTime = 150;
        if (this.validationTimer) {
          clearInterval(this.validationTimer);
        }

        this.validationTimer = setInterval(() => {
          runInAction(() => (this.validationTime = this.validationTime - 1));

          if (this.validationTime === 0) {
            clearInterval(this.validationTimer);
          }
        }, 1000);
        Actions.jump("cancelListComplete");
      } else {
        MessageBoxNew.show(result.data.message);
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      // (err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action CompleteCancelEvent = async (validationCode: string) => {
    this.isLoading = true;

    try {
      let result = await axios.post<ServiceResponseBase<boolean>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Cancel/ApproveSms",
        {
          orderId: this.ErOrder[0].orderNo,
          approveCode: validationCode,
        },
        MakeRequestOptions()
      );

      if (result.data.state === FloResultCode.Successfully) {
        MessageBoxNew.show(`İade alım işlemi\nbaşarıyla tamamlanmıştır`, {
          customParameters: { type: "11" },
          type: MessageBoxType.OrderNotFound,
          yesButtonEvent: () => {
            Actions.popTo("cancellationScreen");
          },
        });
      } else {
        MessageBoxNew.show(result.data.message);
      }

      // // (result);
    } catch (err: any) {
      FloDigitalErrorParse(err);
      // (err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @observable erCurrentFiche?: ErFindFicheResult;
  @observable erSelectedReturnProducts: {
    barcode: string;
    combo: any;
    quantit: number;
  }[] = [];
  @action
  ErFindFicheResult = async (
    ficheNumber: string,
    brokenProduct?: boolean,
    cancelNavigation?: boolean
  ) => {
    try {
      this.isLoading = true;

      let model = {
        orderId: "",
        activeStore: AccountService.getUserStoreId(),
        gsm: "",
        paymentType: "",
        receiptNumber: ficheNumber,
        shippingStore: "",
        shippingDate: "",
        barcode: "",
      };

      var result = await axios.post<ServiceResponseBase<any>>(
        GetServiceUri(ServiceUrlType.EASY_RETURN_CHECK_FICHE),
        model,
        { headers: AccountService.tokenizeHeader() }
      );

      if (
        result.data?.message !== null &&
        result.data?.message !== undefined &&
        result.data?.message !== "" &&
        result.data.message === "CancelOrderDontCreateAUI"
      ) {
        MessageBoxNew.show(
          "İptal edilen siparişler için İDES kaydı oluşturulamaz",
          {
            type: MessageBoxType.Standart,
          }
        );
        return;
      }

      if (!result.data.model || result.data.model.length < 1) {
        MessageBoxNew.show("Sipariş bulunamadı.", {
          type: MessageBoxType.OrderNotFound,
        });

        return;
      }
      if (!cancelNavigation) {
        if (
          Actions.currentScene !== "erBrokenProductList" &&
          Actions.currentScene !== "erFicheProductList"
        )
          if (brokenProduct) Actions["erBrokenProductList"]();
          else Actions["erFicheProductList"]();
      }
      this.erCurrentFiche = result.data.model[0];
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action ErMakeTransaction = async (
    customerGsm?: string,
    customerFullName?: string,
    cancelRouting?: boolean
  ) => {
    try {
      this.isLoading = true;

      if (this.source === 2) {
        let v = ApplicationGlobalService.allEasyReturnReasons.find(
          (x) => x.name.includes("AUİ") || x.name.includes("Arızalı ürün")
        );

        if (
          this.erSelectedReturnProducts[0] === undefined ||
          this.erSelectedReturnProducts[0] === null
        )
          return;
        this.erSelectedReturnProducts[0].combo = v;
      }
      let l = this.erSelectedReturnProducts.filter((x) => x.combo === "");

      if (l.length > 0) throw "Lütfen\nTüm Alanları Eksiksiz Doldurun";

      await this.CreateTransaction(customerGsm, customerFullName);

      for (var i = 0; i < this.erSelectedReturnProducts.length; i++) {
        let x = this.erSelectedReturnProducts[i];
        let res = await this.InsertTransactionLine(x.barcode, x.quantit);

        if (!res) {
          throw "Satırlar oluşturulamadı";
        }
      }

      if (!cancelRouting) {
        if (this.source === 2) Actions.jump("erBrokenComplete");
        else Actions.jump("erFichePaymetTypes");
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action CreateTransaction = async (
    customerGsm?: string,
    customerFullName?: string
  ) => {
    if (this.erCurrentFiche !== undefined && this.erCurrentFiche !== null) {
      let model: EasyReturnTrasaction = {
        id: 0,
        ficheNumber: this.erCurrentFiche.ficheKey,
        ficheDate: this.erCurrentFiche.ficheDate,
        ficheTotal: Number(this.erCurrentFiche.totalPrice),
        paymentTypeId: 1, // this.source === 2 ? 5 : 1,

        sellerStore: this.erCurrentFiche.storeNumber,
        inquiryStore: AccountService.getUserStoreId(),
        inquiryPerson: AccountService.employeeInfo.EfficiencyRecord,

        customerName: customerFullName ?? this.erCurrentFiche.customerName,
        customerGsm:
          customerGsm !== undefined && customerGsm !== "0"
            ? customerGsm
            : this.erCurrentFiche.customerPhone,

        processType:
          this.source === 2 ? TransactionType.Broken : TransactionType.Return,
        processTypeSource: 1,
        status: TransactionState.Draft,
      };

      // Network işlemleri
      let res = await axios.post<ServiceResponseBase<EasyReturnTrasaction>>(
        GetServiceUri(ServiceUrlType.ER_TRANSACTION_CREATE),
        model,
        { headers: AccountService.tokenizeHeader() }
      );

      if (res.data.state === FloResultCode.Successfully) {
        res.data.model.easyReturnTrasactionLines = [];
        this.transaction = res.data.model;
      } else {
        throw res.data.message;
      }
    }
  };

  @observable selectedPaymentTypes: { type: string; price: number }[] = [];
  @action InsertTransactionLine = async (
    rowBarcode: string,
    quantity: number
  ) => {
    try {
      let selectedProduct = this.erSelectedReturnProducts.find(
        (x) => x.barcode == rowBarcode
      );

      let productPrice = this.erCurrentFiche?.data.find(
        (x) => x.barcode === rowBarcode
      );
      if (!selectedProduct || !productPrice) return false;

      if (!this.transaction) return false;

      let model: EasyReturnTrasactionLine = {
        id: 0,
        transactionId: this.transaction.id,
        barcode: selectedProduct.barcode,
        productName: productPrice.productName,
        productDescription: productPrice.productDescription,
        sku: productPrice.sku,
        quantity: Number(productPrice.quantity),
        colour: productPrice.color,
        size: productPrice.size,
        productPrice: Number(productPrice.price),
        productReturnCount: Number(quantity),
        productAlreadyReturnCount: Number(productPrice.returnItemCount),
        productReturnPrice: Number(productPrice.returnPrice),
        kdv: productPrice.kdv,
        // Reason Id ürün listesinde seçilen iade nedeni id si buraya basılır
        reasonId:
          this.source === 2
            ? this.erSelectedReturnProducts[0]?.combo?.id
            : this.erSelectedReturnProducts.find(
                (x) => x.barcode === rowBarcode
              )?.combo?.id,
        picture: "",
      };

      let res = await axios.post<ServiceResponseBase<EasyReturnTrasactionLine>>(
        GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_CREATE),
        model,
        { headers: AccountService.tokenizeHeader() }
      );

      // // (res.data);

      if (res.data.state === FloResultCode.Successfully) {
        this.transaction.easyReturnTrasactionLines?.push(res.data.model);
        return true;
      }
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
    }
  };

  @action removePhoneMask = (phone: string) => {
    phone = phone.trim();
    phone = phone.replace("(", "");
    phone = phone.replace(")", "");
    while (phone.indexOf(" ") > 0) phone = phone.replace(" ", "");
    phone = phone.startsWith("0") ? phone.substring(1) : phone;
    return phone;
  };

  @action ErFindFiche = async (filter: {
    orderId?: string;
    activeStore?: string;
    gsm?: string;
    paymentType?: string;
    receiptNumber?: string;
    shippingStore?: string;
    shippingDate?: string;
    barcode?: string;
  }) => {
    try {
      this.isLoading = true;
      // // (filter);
      if (
        filter.gsm === "" &&
        filter.barcode === "" &&
        filter.shippingStore === "" &&
        filter.gsm === "" &&
        filter.receiptNumber === ""
      ) {
        MessageBox.Show(
          translate("servicesEasyReturnService.voucherNotFound"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        return;
      }

      filter.shippingDate = filter.shippingDate || "";

      filter.gsm = this.removePhoneMask(filter.gsm || "");

      var result = await axios.post(
        GetServiceUri(ServiceUrlType.EASY_RETURN_FIND_FICHE),
        filter,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.status === 200) {
        if (result.data.isValid && result.data.state === 1) {
          if (result.data.model.length < 1) {
            MessageBox.Show(
              translate("servicesEasyReturnService.voucherNotFound"),
              MessageBoxDetailType.Information,
              MessageBoxType.Standart,
              () => {},
              () => {}
            );
          } else {
            this.currentFicheList = result.data.model;
            Actions["erFicheResult"]();
          }
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @observable source: number = 1;
  @observable brokenProductTemplate: string = "";
  @action CreateBrokenProductDocument = async (images?: any) => {
    try {
      await this.BrokenProductComplete();

      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects
      //@ts-ignore
      formData.append("detailId", this.transactionLineDetails[0].detail.id);

      for (var i = 0; i < images.length; i++) {
        if (images[i].Url.includes("base64,")) continue;

        let localUri = images[i].Url;
        // telefondaki sabit dosyalardan seçili ise
        if (images[i].Url.startsWith("ph://")) {
         // var ml = await MediaLibrary.getAssetInfoAsync(images[i].Url.slice(5));
          var ml = null;
          if (ml?.localUri === undefined) continue;
          localUri = ml?.localUri;
        }

        let filename = localUri.split("/").pop();

        if (filename === undefined) continue;

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        //@ts-ignore
        formData.append("image", { uri: localUri, name: filename, type });
      }
      var result = await axios.post<ServiceResponseBase<any>>(
        `${GetServiceUri(
          ServiceUrlType.ER_TRANSACTION_BASE
        )}CreateBrokenProductDocument?transactionId=${this.transaction?.id}`,
        formData,
        {
          headers: {
            ...AccountService.tokenizeHeader(),
            "content-type": "multipart/form-data",
          },
        }
      );

      if (result.data.state === FloResultCode.Successfully) {
        this.brokenProductTemplate = result.data.model.brokenProductUrl;
        return true;
      } else MessageBoxNew.show(result.data.message);
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
    }
  };

  @action BrokenProductComplete = async () => {
    try {
      this.isLoading = true;
      let saveUri =
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
        "genius/SendReturnProduct?transactionId=" +
        this.transaction?.id;

      let result = await axios.post(
        saveUri,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
        //@ts-ignore
        this.transaction.brokenProductDocumentNo =
          result.data.model.receipt_Barcode;
        return true;
      }

      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @observable brokenProductFindResult?: BrokenProductSearchModel = undefined;
  @observable brokenProductFindResultList?: BrokenProductSearchModel[] =
    undefined;
  @observable brokenProductSapFiches: BrokenProductSapResult[] = [];
  @action CheckAUINumber = async (
    transactionId: string,
    withPhone?: boolean
  ) => {
    try {
      this.isLoading = true;
      const phone = withPhone ? transactionId : "0";
      var code = withPhone ? "" : transactionId;
      var ficheNumber = "";

      if (code !== "" && !code.startsWith("M")) {
        ficheNumber = code;
        code = "";
      }

      let result = await axios.post<
        ServiceResponseBase<BrokenProductSearchModel[]>
      >(
        `${GetServiceUri(
          ServiceUrlType.ER_BROKEN_PRODUCT_SEARCH
        )}?aui=${code}&phone=${phone}&ficheno=${ficheNumber}`,
        {}
      );

      if (
        result.data.state === FloResultCode.Successfully &&
        result.data.model.length > 0
      ) {
        if (
          result.data.model[0].easyReturnTransaction === null ||
          result.data.model[0].easyReturnTransaction === undefined
        ) {
          var sapResult = result.data.model.map((x) => x.sapResult);
          this.brokenProductSapFiches = sapResult;
          if (Actions.currentScene !== "erBrokenResult")
            Actions["erBrokenResult"]();
          return;
        } else if (phone !== "" && phone !== "0") {
          this.brokenProductFindResultList = result.data.model;
          if (Actions.currentScene !== "erBrokenProductFicheListWithPhone")
            Actions["erBrokenProductFicheListWithPhone"]();
        } else {
          await this.ErFindFicheResult(
            result.data.model[0].easyReturnTransaction?.ficheNumber,
            false,
            true
          );
          this.brokenProductFindResult = result.data.model[0];
          this.transaction = result.data.model[0].easyReturnTransaction;
          this.transaction.processType = TransactionType.BrokenComplete;
          if (Actions.currentScene !== "erBrokenResult")
            Actions["erBrokenResult"]();
        }
      } else MessageBoxNew.show("Her hangi bir belge bulunamadı");
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action CleanTransaction = async () => {
    this.brokenProductFindResultList = undefined;
    this.brokenProductFindResult = undefined;
    this.brokenProductTemplate = "";
    this.isBrokenComplete = false;
    // Kapalı çünkü menü değişince değişecek
    // this.source = 1;
    this.selectedPaymentTypes = [];
    this.erSelectedReturnProducts = [];
    this.erCurrentFiche = undefined;

    this.validationTimer = undefined;
    this.validationTime = 0;
    this.ErOrder = [];
    this.ErFicheList = [];
    this.loadingCompleteReject = false;
    this.transaction = undefined;
    this.transactionLineDetails = [];

    this.CancellationOrderNotFoundPopup = false;

    this.isRejectCargoLoading = false;
    this.omsRejectCargoRes = undefined;
    this.selectedRejectCargos = [];
  };

  @action CheckAIState = async (model: {
    returnReason: number;
    ficheNumber: string;
    orderDate: string;
  }) => {
    try {
      this.isLoading = true;

      let result = await axios.post<
        ServiceResponseBase<{ isAccepted: boolean }>
      >(
        `${GetServiceUri(
          ServiceUrlType.SYSTEM_API
        )}EasyReturnTransaction/SapAICheck`,
        model,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
        return result.data.model.isAccepted;
      } else if (result.data.state === FloResultCode.Exception) {
        MessageBoxNew.show(result.data.message);
      }
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @observable smsValidationTemp: number = 0;
  @action sentValidationSms = async (customerGsm: string) => {
    try {
      let res = await axios.post<ServiceResponseBase<any>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "EasyReturnTransaction/SendSms",
        { phone: customerGsm, transactionId: this.transaction?.id },
        { headers: AccountService.tokenizeHeader() }
      );

      if (res.data.state === FloResultCode.Successfully) {
        this.smsValidationTemp = res.data.model.id;
        return true;
      }
      MessageBoxNew.show(
        "Doğrulama kodu gönderilemedi, Lütfen daha sonra tekrar deneyin."
      );
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
    }
  };

  @action validateSms = async (validationCode: string) => {
    try {
      let res = await axios.post<ServiceResponseBase<any>>(
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
          "EasyReturnTransaction/ApproveSms",
        { code: validationCode, id: this.smsValidationTemp },
        { headers: AccountService.tokenizeHeader() }
      );

      if (res.data.state === FloResultCode.Successfully) {
        MessageBox.Hide();
        if (this.source === 2) Actions.jump("erBrokenComplete");
        else Actions.jump("erFichePaymetTypes");
        return true;
      }
      MessageBoxNew.show("Girdiğiniz kod hatalıdır. Lütfen tekrar deneyiniz.");
      return false;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
    }
  };

  @action GetBrokenProductDocumentWithTransactionId = async () => {
    try {
      let formData = new FormData();
      formData.append("detailId", "11");

      var result = await axios.post<ServiceResponseBase<any>>(
        `${GetServiceUri(
          ServiceUrlType.ER_TRANSACTION_BASE
        )}CreateBrokenProductDocument?transactionId=${this.transaction?.id}`,
        formData,
        {
          headers: {
            ...AccountService.tokenizeHeader(),
            "content-type": "multipart/form-data",
          },
        }
      );

      if (result.data.state === FloResultCode.Successfully) {
        this.brokenProductTemplate = result.data.model.brokenProductUrl;
        return true;
      } else {
        MessageBoxNew.show(result.data.message);
        return false;
      }
    } catch (err: any) {
      MessageBoxNew.show(err);
      //FloDigitalErrorParse(err);
    } finally {
    }
  };

  @action SendBrokenProductCompletedSms = async () => {
    try {
      let saveUri =
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
        "genius/SendBrokenProductCompletedSms?transactionId=" +
        this.transaction?.id;

      var result = await axios.post(saveUri, {});

      if (result.data.state === FloResultCode.Successfully)
        MessageBoxNew.show("SMS Başarıyla Gönderilmiştir.");
      else MessageBoxNew.show(result.data.message);
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };
}

export interface BrokenProductDetailMap {
  index: number;
  barcode: string;
  detail: TransactionLineDetail;
}

export interface CheckEasyReturnRequestModel {
  activeStore: string;
  gsm?: string;
  paymentType?: string;
  receiptNumber?: string;
  shippingStore?: string;
  shippingDate?: string;
  barcode?: string;
}

export interface GeniusResponse {
  state: number;
  message: string;
  model: GeniusFiche[];
  isValid: boolean;
  isError: boolean;
}

export interface GeniusFiche {
  customerName: string;
  customerPhone: string;
  gender: string;
  ficheKey: string;
  ficheRef: string;
  ficheDate: string;
  totalPrice: string;
  paymentType: string;
  storeNumber: string;
  storeName: string;
  storeManagerPhoneList: [string];
  data: GeniusFicheDetail[];
  odeme: PaymentTypeDetail[];
}

export interface GeniusFicheDetail {
  barcode: string;
  productName: string;
  sku: string;
  picture: string;
  variantNo: string;
  quantity: string;
  color: string;
  size: string;
  productDescription: string;
  price: string;
  returnItemCount: string;
  returnPrice: string;
  isCancel: boolean;
  isOmc: boolean;
  kdv: number;
}

export interface GeniusFicheRequestDetail extends GeniusFicheDetail {
  reason?: EasyReturnReason;
  item_quantity: number;
}

export default new EasyReturnService();

export interface ErRejectModel {
  barcode: string;
  qty: number;
}
