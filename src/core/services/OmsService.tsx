import axios from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { Platform } from "react-native";
import { Actions } from "react-native-router-flux";
import { OmsErrorReasonModel } from "../models/OmsErrorReasonModel";
import { OmsOrderDetail, OmsOrderModel } from "../models/OmsOrderModel";
import { OmsOrderResponse } from "../models/OmsOrderResponse";
import { OmsPackageModel, PackageOrder } from "../models/OmsPackageModel";
import { OmsResponseBase } from "../models/OmsResponseBase";
import { OmsStatePageData } from "../models/OmsStatePageData";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import AccountService from "./AccountService";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
import PrinterConfigService from "./PrinterConfigService";
// import Crashlystic from '@react-native-firebase/crashlytics';
import MessageBoxNew from "./MessageBoxNew";
import React from "react";
import { CloseIco } from "../../screens/OMS/OmsPackage";
import { FloDigitalErrorParse } from "../HttpModule";
import linq from "linq";
import { OmsChiefReportModel } from "../models/OmsChiefReportModel";
import { isInRole } from "../../components/RoleGroup";
import ApplicationGlobalService from "./ApplicationGlobalService";
import { translate } from "../../helper/localization/locaizationMain";
import { tr } from "../../helper/localization/lang/_tr";
import moment from "moment";
class OmsService {
  constructor() {
    makeAutoObservable(this);
  }

  @observable omsConsensusStartDate: Date = new Date();
  @observable omsConsensusEndDate?: Date;
  @observable statePageData?: OmsStatePageData;
  @observable omsOrders?: OmsOrderModel[];
  @observable loadingContent: boolean = false;
  @observable assignTemp: number[] = [];
  @observable assignLoading: { isLoading: boolean; orderId: number } = {
    isLoading: false,
    orderId: 0,
  };
  @observable omsPickList: OmsOrderDetail[] = [];
  @observable omsPickListGroup: OmsOrderDetail[] = [];
  @observable omsPickListOrder: OmsOrderModel[] = [];
  @observable errorReasons: OmsErrorReasonModel[] = [];

  @action loadStatePage = async () => {
    try {
      runInAction(() => {
        this.loadingContent = true;
        this.statePageData = undefined;
      });

      if (isInRole("omc-oms-store-chief")) {
        await this.getChiefReport();
      }
      let result = await axios.post<OmsResponseBase<OmsStatePageData>>(
        GetServiceUri(ServiceUrlType.OMS_STATE_REPORT),
        {},
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (result.data.Status === 1) {
        runInAction(() => {
          this.statePageData = result.data.Data;
          this.loadingContent = false;
        });
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.loadingContent = false));
    }
  };

  @action loadAllOrders = async () => {
    try {
      runInAction(() => (this.loadingContent = true));
      let result = await axios.post<OmsResponseBase<OmsOrderResponse>>(
        GetServiceUri(ServiceUrlType.OMS_ORDERS),
        { storeId: AccountService.getUserStoreId() },
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (result.data.Status === 1) {
        let model: OmsOrderModel[] = [];
        result.data.Data.Orders.map((x) => {
          model.push({
            ...x,
            OrderItems: result.data.Data.OrderItems.filter(
              (y) => y.OrderID === x.ID
            ),
          });
        });

        this.assignTemp = [];
        this.omsOrders = model;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.loadingContent = false));
    }
  };

  @action addAssignQueue = async (
    assignType: "all" | "order" | "timeLeft",
    type: "check" | "uncheck",
    orderNumber: number
  ) => {
    if (assignType === "all") {
      if (type === "uncheck") this.assignTemp = [];
      else {
        if (this.omsOrders) {
          this.omsOrders.map((x) => {
            if (!this.assignTemp.includes(x.ID)) {
              this.assignTemp.push(x.ID);
            }
          });
        }
      }
    } else if (assignType === "order") {
      if (type === "uncheck") {
        let index = this.assignTemp.indexOf(orderNumber);
        if (index > -1) this.assignTemp.splice(index, 1);
      } else {
        if (!this.assignTemp.includes(orderNumber))
          this.assignTemp.push(orderNumber);
      }
    }
  };

  @action assignOrderToMe = async (orderId: number) => {
    try {
      runInAction(() => (this.assignLoading = { isLoading: true, orderId }));

      const order = this.omsOrders?.find((x) => x.ID === orderId);
      if (!order) {
        runInAction(
          () => (this.assignLoading = { isLoading: false, orderId: -1 })
        );
        return;
      }

      let model = [
        {
          OrderNo: order.OrderNo,
          ID: orderId,
          CreateDate: order?.CreateDate,
          ProductCount: order?.ProductCount,
          picklistCount: 0,
          ChannelCode: "BC",
          SourceCode: "FLO",
          Duration: order.Duration,
          Remainder: order.Remainder,
          DurationName: order.DurationName,
          StatusID: 0,
          OrderStatusID: 2,
          ActionByID: null,
        },
      ];
      // {"BarcodeNo": "8681711368614", "BodySize": "37", "Brand": "POLARİS 5 NOKTA", "CargoCompany": null, "Category": "AKSESUAR", "ChannelCode": "BC", "Color": "TABA", "CreateDate": "0001-01-01T00:00:00", "CreatedDate": null, "CurrentStock": null, "Desi": 1, "FoundCount": 0, "GiftNote": null, "ID": 4627, "ImageUrl": "https://www.flo.com.tr/V1/product/image?sku=100314025", "IsGift": 0, "IsPackaged": null, "IsPrinted": false, "LeftHours": 0, "ModelName": "81.111080.Z", "NotFoundProductPrintStatusID": 0, "OrderID": 4627, "OrderItemID": null, "OrderNo": "72900000001959", "OrderStatusID": "2", "ProductBarcode": "8681711368614                                     ", "ProductBarcodes": null, "ProductNo": "POLARİS 5 NOKTA 81.111080.Z TABA KADIN BASİC COMFORT", "ProductStatus": true, "ProductStatusDescription": "", "ProductStatusImage": "assets/images/approve.png", "Quantity": "1", "SKUNo": "000000100314025002", "SourceCode": null, "StoreCode": "4081", "StoreIP": null, "StoreName": "41 Gebze Center"}, {"BarcodeNo": "8681711368614", "BodySize": "37", "Brand": "POLARİS 5 NOKTA", "CargoCompany": null, "Category": "AKSESUAR", "ChannelCode": "BC", "Color": "TABA", "CreateDate": "0001-01-01T00:00:00", "CreatedDate": null, "CurrentStock": null, "Desi": 1, "FoundCount": 0, "GiftNote": null, "ID": 4627, "ImageUrl": "https://www.flo.com.tr/V1/product/image?sku=100314025", "IsGift": 0, "IsPackaged": null, "IsPrinted": false, "LeftHours": 0, "ModelName": "81.111080.Z", "NotFoundProductPrintStatusID": 0, "OrderID": 4627, "OrderItemID": null, "OrderNo": "72900000001959", "OrderStatusID": "2", "ProductBarcode": "8681711368614                                     ", "ProductBarcodes": null, "ProductNo": "POLARİS 5 NOKTA 81.111080.Z TABA KADIN BASİC COMFORT", "ProductStatus": true, "ProductStatusDescription": "", "ProductStatusImage": "assets/images/approve.png", "Quantity": "1", "SKUNo": "000000100314025002", "SourceCode": null, "StoreCode": "4081", "StoreIP": null, "StoreName": "41 Gebze Center"}

      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_ORDER_ASSIGN_TO_ME),
        model,
        {
          headers: AccountService.tokenizeHeader(true),
        }
      );

      if (result.data.Status === 1) {
        await this.loadAllOrders();
      } else {
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(
        () => (this.assignLoading = { isLoading: false, orderId: -1 })
      );
    }
  };

  @action loadMyPickList = async () => {
    try {
      runInAction(() => (this.loadingContent = true));
      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_ORDER_PICK_LIST),
        {},
        { headers: AccountService.tokenizeHeader(true) }
      );

      let result2 = await axios.post<OmsResponseBase<OmsOrderResponse>>(
        GetServiceUri(ServiceUrlType.OMS_ORDER_PICK_LIST_ORDER),
        {},
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (result.data.Status === 1) {
        let d = await this.makeGroupPicking(result.data.Data);
        runInAction(() => {
          this.omsPickList = result.data.Data;
          this.omsPickListGroup = d;
        });
      }

      if (result2.data.Status === 1) {
        let model: OmsOrderModel[] = [];
        result2.data.Data.Orders.map((x) => {
          model.push({
            ...x,
            OrderItems: this.GroupingBC(
              result2.data.Data.OrderItems,
              x.CreateDate,
              x.ID
            ),
          });
        });

        this.assignTemp = [];
        this.omsOrders = model;
        runInAction(() => (this.omsPickListOrder = model));
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.loadingContent = false));
    }
  };

  @action GroupingBC = (model: OmsOrderDetail[], d: any, oi: number) => {
    let m: OmsOrderDetail[] = [];

    model
      .filter((x) => x.OrderID === oi)
      .map((x) => {
        x.ChannelCode = "BC";
        x.CreateDate = d;
        m.push(x);
      });

    return m;
  };

  @action makeGroupPicking = async (model: OmsOrderDetail[]) => {
    let m: OmsOrderDetail[] = [];

    model.map((x) => {
      let index = m.findIndex(
        (y) =>
          y.BarcodeNo === x.BarcodeNo &&
          ((y.ChannelCode === "CC" && x.ChannelCode === "CC") ||
            (y.ChannelCode === "BC" && x.ChannelCode === "CC") ||
            (y.ChannelCode !== "BGK" && y.ChannelCode !== "BC"))
      );

      if (index === -1) m.push({ ...x });
      else {
        m[index].Quantity = (
          Number(m[index].Quantity) + Number(x.Quantity)
        ).toString();
      }
    });

    return m;
  };

  @action loadErrorReasons = async () => {
    try {
      if (this.errorReasons.length === 0) {
        let result = await axios.post<OmsResponseBase<OmsErrorReasonModel[]>>(
          GetServiceUri(ServiceUrlType.OMS_BASE) +
          "Mypicklist/GetNotFoundReasonList",
          {},
          { headers: AccountService.tokenizeHeader(true) }
        );

        // Servisten gelen datayı isme göre yakalayıp çeviriyor
        result.data.Data.forEach((x) => {
          Object.entries(tr.omsErrorReasons).forEach(([key, value]) => {
            if (value == x.OmsName) {
              x.OmsName = translate("omsErrorReasons." + key);
            }
          });
        });

        this.errorReasons = result.data.Data;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      // Crashlystic().log('OMS Nedenler yüklenirken hata oluştu');
    } finally {
    }
  };

  @observable cancelLoading: boolean = false;
  @action cancelOrder = async (
    orderDetail: OmsOrderDetail,
    reason: string,
    skipRefresh?: boolean
  ) => {
    let model = {
      ID: orderDetail.ID,
      Brand: orderDetail.Brand,
      ModelName: orderDetail.ModelName,
      Color: orderDetail.Color,
      Category: orderDetail.Category,
      BodySize: orderDetail.BodySize,
      Quantity: orderDetail.Quantity,
      BarcodeNo: orderDetail.BarcodeNo,
      ProductBarcode: orderDetail.ProductBarcode,
      ProductBarcodes: orderDetail.ProductBarcodes,
      SKUNo: orderDetail.SKUNo,
      CurrentStock: null,
      OrderNo: orderDetail.OrderNo,
      OrderID: 0,
      ProductNo: orderDetail.ProductNo,
      OrderStatusID: "2",
      StoreCode: orderDetail.StoreCode,
      StoreName: orderDetail.StoreName,
      ImageUrl: orderDetail.ImageUrl,
      ProductStatus: 0,
      ProductStatusImage: null,
      ProductStatusDescription: reason,
      SourceCode: orderDetail.SourceCode,
      IsPackaged: null,
      CreateDate: orderDetail.CreateDate,
      CreatedDate: null,
      LeftHours: 0,
      IsPrinted: false,
      NotFoundProductPrintStatusID: 0,
      OrderItemID: null,
      IsGift: 0,
      GiftNote: null,
      FoundCount: 0,
      StoreIP: null,
      CargoCompany: null,
      Desi: orderDetail.Desi,
      ChannelCode: orderDetail.ChannelCode,
    };
    try {
      this.cancelLoading = true;

      let r = await axios.post<OmsResponseBase<boolean>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "PackageList/WayBillControl",
        { OrderNo: model.OrderNo },
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (r.data.Data) {
        MessageBoxNew.show(translate("omsService.ordersCannotCanceled"));
        runInAction(() => {
          this.cancelLoading = false;
        });
        return false;
      }

      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "SAP/GetRealTimeStock",
        model,
        { headers: AccountService.tokenizeHeader(true) }
      );

      MessageBoxNew.show(
        result.data.Data < 1
          ? `${translate("ProductDetail.areYouSure")}`
          : `Bu üründen ${result.data.Data} adet stok bulunuyor, yinede iptal etmek istiyormusun ?`,
        {
          type: MessageBoxType.YesNo,
          yesButtonEvent: () => {
            this.completeCancelMethod(model, orderDetail, skipRefresh);
          },
          noButtonEvent: () => {
            runInAction(() => {
              this.cancelLoading = false;
            });
          },
        }
      );

      return true;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      MessageBoxNew.show(translate("omsService.orderCancelingError"));
      return false;
    } finally {
    }
  };

  @action private completeCancelMethod = async (
    model: any,
    orderDetail: any,
    skipRefresh: any
  ) => {
    try {
      let result2 = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_ORDER_COMPLETE_COLLECT),
        [model],
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (orderDetail.ChannelCode === "BC") {
        let cancelRes = await axios.post(
          GetServiceUri(ServiceUrlType.OMS_BASE) +
          "OMC/CancelOrderBC?orderNo=" +
          orderDetail.OrderNo,
          {},
          { headers: AccountService.tokenizeHeader() }
        );
      }

      if (result2.data.Status === 1 && !skipRefresh) {
        await this.loadMyPickList();
        await this.loadAllPackageList();
        await this.loadStatePage();
        return true;
      } else if (result2.data.Data && skipRefresh) return true;
      // MessageBoxNew.show("Sipariş iptal edilirken bir hata oluştu");
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => {
        this.cancelLoading = false;
      });
    }

    return false;
  };

  @observable continiousOrder: string | undefined;
  @observable pickingTemp: OmsOrderDetail[] = [];
  @action collectProduct = async (
    order: { type: string; orderNo: string },
    productId: string,
    quantity?: number
  ) => {
    if (this.continiousOrder && this.continiousOrder != order.orderNo) {
      MessageBox.yesButton = translate("omsService.cancel");
      MessageBox.Show(
        translate("omsService.cancelTransactionQuestion"),
        MessageBoxDetailType.Danger,
        MessageBoxType.YesNo,
        () => {
          runInAction(() => (this.continiousOrder = undefined));
          runInAction(() => (this.pickingTemp = []));
          this.collectProduct(order, productId, quantity);
        },
        () => { }
      );
      return;
    }
    this.continiousOrder = order.orderNo;

    if (order.type === "BC") {
      var orderr = this.omsPickListOrder.find(
        (x) => x.OrderNo === order.orderNo
      );
      var items = orderr?.OrderItems.filter(
        (x) =>
          x.ProductBarcode === productId || x.ProductBarcode.includes(productId)
      );

      var item: OmsOrderDetail | undefined = undefined;

      if (items && items.length > 0) {
        for (var i = 0; i < items?.length; i++) {
          let x = items[i];
          if (this.pickingTemp.findIndex((y) => y.ID === x.ID) === -1) {
            item = x;
            break;
          }
        }

        if (!item) item = items[0];
      }

      if (
        item &&
        !this.pickingTemp.find(
          (x) => x.BarcodeNo === item?.BarcodeNo && x.ID === item.ID
        )
      ) {
        let i = { ...item };
        // if (quantity) i.Quantity = quantity.toString();
        this.pickingTemp.push(i);
      } else if (
        item &&
        this.pickingTemp.find((x) => x.BarcodeNo === item?.BarcodeNo)
      ) {
        let index = this.pickingTemp.findIndex(
          (x) => x.BarcodeNo === item?.BarcodeNo
        );

        if (index !== -1 && quantity) {
          this.pickingTemp[index].Quantity = (
            Number(this.pickingTemp[index].Quantity) + quantity
          ).toString();
        }
      }

      let ord = this.omsPickListOrder.find((x) => x.OrderNo === order.orderNo);
      if (ord && ord.OrderItems.length > this.pickingTemp.length) {
        if (Actions.currentScene !== "omsPick") Actions["omsPick"]();
      } else
        MessageBox.Show(
          this.continiousOrder + "|" + (item ? item.ImageUrl : ""),
          MessageBoxDetailType.Danger,
          MessageBoxType.OmsComplete,
          async () => {
            this.loadingContent = true;
            if (Actions.currentScene === "omsPick") Actions.popTo("omsDb");
            // Tamamlandı işlemi
            let res = await this.completeCollect();
            if (res) {
              runInAction(() => (this.continiousOrder = undefined));
              runInAction(() => (this.pickingTemp = []));
            }
          },
          () => { }
        );
    } else {
      var item = this.omsPickList.find(
        (x) =>
          x.ProductBarcode === productId || x.ProductBarcode.includes(productId)
      );
      if (
        item &&
        !this.pickingTemp.find((x) => x.BarcodeNo === item?.BarcodeNo)
      )
        this.pickingTemp.push(item);

      if (
        this.omsPickList.filter((x) => x.OrderNo === order.orderNo).length >
        this.pickingTemp.length
      ) {
        if (Actions.currentScene !== "omsPick") Actions["omsPick"]();
      } else
        MessageBox.Show(
          this.continiousOrder + "|" + (item ? item.ImageUrl : ""),
          MessageBoxDetailType.Danger,
          MessageBoxType.OmsComplete,
          async () => {
            if (Actions.currentScene === "omsPick") Actions.popTo("omsDb");
            this.loadingContent = true;
            // Tamamlandı işlemi
            let res = await this.completeCollect();
            if (res) {
              runInAction(() => (this.continiousOrder = undefined));
              runInAction(() => (this.pickingTemp = []));
            }
          },
          () => { }
        );
    }
  };

  @observable loadingGroupCollect: boolean = false;
  @action collectGroupProduct = async (
    productGroup: OmsOrderDetail,
    quantity: number,
    reason?: OmsErrorReasonModel,
    continueLater?: boolean
  ) => {
    try {
      this.loadingGroupCollect = true;
      // Crashlystic().log(
      //   `Oms Toplu Ürün toplama [Mağaza Kodu = ${AccountService.getUserStoreId()} - Ürün Kodu : ${
      //     productGroup.BarcodeNo
      //   }]`,
      // );

      let collectModel: OmsOrderDetail[] = [];
      let removeModel: OmsOrderDetail[] = [];
      let remainingQuantity = quantity;

      // Toplama listesinde okutulan ürünü bul
      var bpick = linq
        .from(this.omsPickList)
        .firstOrDefault((x) => x.BarcodeNo === productGroup.BarcodeNo);

      // Toplama listesinde okutulan üründen başka aynı siparişe ait ürün var mı ?
      let c = linq
        .from(this.omsPickList)
        .any(
          (x) =>
            bpick !== undefined &&
            x.OrderNo === bpick.OrderNo &&
            x.BarcodeNo !== bpick.BarcodeNo
        );

      this.omsPickList
        .filter((x) => x.BarcodeNo === productGroup.BarcodeNo)
        .sort((x) => Number(x.Quantity))
        .map((x) => {
          if (Number(x.Quantity) <= remainingQuantity) {
            let temp = { ...x };
            temp.ProductStatus = 1;
            temp.ProductStatusDescription = translate(
              "omsService.productHasFound"
            );
            collectModel.push(x);
            remainingQuantity = remainingQuantity - Number(x.Quantity);
          } else if (!continueLater && reason) {
            let temp = { ...x };
            temp.ProductStatus = 0;
            temp.ProductStatusDescription = reason.OmsName;
            removeModel.push(x);
          } else if (Number(x.Quantity) > remainingQuantity && continueLater) {
            let temp = { ...x };
            temp.Quantity = remainingQuantity.toString();
            temp.ProductStatus = 1;
            temp.ProductStatusDescription = translate(
              "omsService.productHasFound"
            );
            collectModel.push(x);
            remainingQuantity = 0;
          }
        });

      if (reason)
        for (var i = 0; i < removeModel.length; i++) {
          await this.cancelOrder(removeModel[i], reason.OmsName, true);
        }

      let m = collectModel.map((x) => {
        return {
          ID: x.ID,
          OrderNo: x.OrderNo,
          Quantity: x.Quantity,
          Desi: x.Desi,
          Brand: "",
          ModelName: "",
          Color: "",
          Category: "",
          BodySize: "",
          BarcodeNo: "",
          ProductBarcode: "",
          ProductBarcodes: "",
          SKUNo: "",
          CurrentStock: null,
          OrderID: 0,
          ProductNo: "",
          OrderStatusID: "2",
          StoreCode: "",
          StoreName: null,
          ImageUrl: "",
          ProductStatus: 1,
          ProductStatusImage: null,
          ProductStatusDescription: "",
          SourceCode: null,
          IsPackaged: null,
          CreateDate: x.CreateDate,
          CreatedDate: null,
          LeftHours: 0,
          IsPrinted: false,
          NotFoundProductPrintStatusID: 0,
          OrderItemID: null,
          IsGift: 0,
          GiftNote: null,
          FoundCount: 0,
          StoreIP: null,
          CargoCompany: null,
          ChannelCode: "",
        };
      });

      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_ORDER_COMPLETE_COLLECT),
        m,
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (result.data.Status === 1) {
        await this.loadMyPickList();

        if (c)
          MessageBoxNew.show(translate("omsService.allOrdersPackingCompleted"));
        return true;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      // Crashlystic().log(JSON.stringify(err));
    } finally {
      this.loadingGroupCollect = false;
    }
  };

  @action completeCollect = async () => {
    let m: any[] = [];
    try {
      this.pickingTemp.map((x) => {
        // for (var i = 0; i < Number(x.Quantity); i++) {
        m.push({
          ID: x.ID,
          OrderNo: x.OrderNo,
          Quantity: x.Quantity,
          Desi: x.Desi,
          Brand: "",
          ModelName: "",
          Color: "",
          Category: "",
          BodySize: "",
          BarcodeNo: "",
          ProductBarcode: "",
          ProductBarcodes: "",
          SKUNo: "",
          CurrentStock: null,
          OrderID: 0,
          ProductNo: "",
          OrderStatusID: "2",
          StoreCode: "",
          StoreName: null,
          ImageUrl: "",
          ProductStatus: 1,
          ProductStatusImage: null,
          ProductStatusDescription: "",
          SourceCode: null,
          IsPackaged: null,
          CreateDate: x.CreateDate,
          CreatedDate: null,
          LeftHours: 0,
          IsPrinted: false,
          NotFoundProductPrintStatusID: 0,
          OrderItemID: null,
          IsGift: 0,
          GiftNote: null,
          FoundCount: 0,
          StoreIP: null,
          CargoCompany: null,
          ChannelCode: "",
        });
        // }
      });
      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_ORDER_COMPLETE_COLLECT),
        m,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.Status === 1) {
        await this.loadMyPickList();
        return true;
      } else {
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
    return false;
  };

  @observable assignableEmployee: any[] = [];
  @action loadAssignableEmployee = async () => {
    try {
      if (this.assignableEmployee && this.assignableEmployee.length > 0) return;
      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "CollectAll/GetUsers",
        {},
        {
          headers: AccountService.tokenizeHeader(true),
        }
      );

      this.assignableEmployee = result.data.Data;
    } catch (err) { }
  };

  @action completeAssignQueue = async (UserID: number) => {
    const model: any[] = [];
    if (!this.assignTemp || this.assignTemp.length === 0) {
      MessageBox.Show(
        translate("omsService.selectOrderAssign"),
        MessageBoxDetailType.Danger,
        MessageBoxType.Standart,
        () => { },
        () => { }
      );

      return;
    }
    this.assignTemp.forEach((x) => {
      let order = this.omsOrders?.find((y) => y.ID === x);

      if (order) {
        model.push({
          ActionByID: UserID,
          ChannelCode: order?.ChannelCode,
          CreateDate: order?.CreateDate,
          Duration: order?.Duration,
          DurationName: order?.DurationName,
          ID: order?.ID,
          OrderNo: order?.OrderNo,
          OrderStatusID: 2,
          ProductCount: order?.ProductCount,
          Remainder: order?.Remainder,
          SourceCode: order?.SourceCode,
          StatusID: order?.StatusID,
          picklistCount: order?.picklistCount,
        });
      }
    });

    let result = await axios.post<OmsResponseBase<any>>(
      GetServiceUri(ServiceUrlType.OMS_ORDER_ASSIGN_TO_ME),
      model,
      {
        headers: AccountService.tokenizeHeader(true),
      }
    );

    if (result.data.Status === 1) {
      await this.loadAllOrders();
    } else {
    }
  };

  @observable packageList: OmsPackageModel[] = [];
  @action loadAllPackageList = async () => {
    runInAction(() => (this.loadingContent = true));

    try {
      let result = await axios.post<OmsResponseBase<OmsPackageModel[]>>(
        GetServiceUri(ServiceUrlType.OMS_ORDER_PACKAGE_LIST),
        {},
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (result.data.Status === 1) this.packageList = result.data.Data;
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.loadingContent = false));
    }
  };

  @observable packageContiniousOrder: string | undefined;
  @observable packagingTemp: PackageOrder[] = [];
  @observable hasWaybillComplete: boolean = true;
  @action pickItem = async (orderId: string, productId: string) => {
    if (this.packageContiniousOrder && this.packageContiniousOrder != orderId) {
      MessageBox.yesButton = translate("omsService.cancel2");
      MessageBox.Show(
        translate("omsService.packageTransactionQuestion"),
        MessageBoxDetailType.Danger,
        MessageBoxType.YesNo,
        () => {
          runInAction(() => (this.packageContiniousOrder = undefined));
          runInAction(() => (this.packagingTemp = []));
          this.pickItem(orderId, productId);
        },
        () => { }
      );
      return;
    }
    this.tempZpl = [];
    this.hasWaybillComplete = false;
    this.packageContiniousOrder = orderId;

    var order = this.packageList.find((x) => x.OrderNo === orderId);

    if (order) {
      const items = order.Orders.filter((x) => x.BarcodeNo === productId);
      //8683121424263
      let item: PackageOrder | undefined = undefined;
      for (var i = 0; i < items.length; i++) {
        const x = items[i];

        if (this.packagingTemp.findIndex((y) => y.ID === x.ID) === -1) {
          item = x;
          break;
        }
      }

      if (item === undefined && items.length > 0) {
        item = items[0];
      }
      if (item) {
        if (this.packagingTemp.findIndex((x) => x.ID === item?.ID) === -1) {
          item.ProductStatus = true;
          this.packagingTemp.push(item);
        }

        if (Number(item.Quantity) > 1) {
          MessageBox.Show(
            translate("OmsPackageCard.requiredOrder", {
              qty: item.Quantity,
            }),
            MessageBoxDetailType.Danger,
            MessageBoxType.Standart,
            () => {
              if (Actions.currentScene !== "omsPackage")
                Actions["omsPackage"]();
            },
            () => { }
          );
        } else if (Actions.currentScene !== "omsPackage")
          Actions["omsPackage"]();
      }
    }
  };

  @observable onLoadingPrintLabel: boolean = false;
  @action printLabel = async () => {
    if (
      !this.CheckPrinterConfiguration(
        translate("omsService.configurePackagegingProcess")
      )
    ) {
      return;
    }
    this.onLoadingPrintLabel = true;
    const order = this.packageList.find(
      (x) => x.OrderNo === this.packageContiniousOrder
    );

    if (order) {
      const sendOrderModel = {
        OrderNo: order.OrderNo,
        TotalCount: order.TotalCount,
        CompletedCount: order.TotalCount,
        IsAllOrderPackaged: order.IsAllOrderPackaged,
        IsWayBill: false,
        IsOrderDesi: false,
        IsGibMatbu: false,
        IsSentGib: false,
        OrderDesi: null,
        IsGift: 0,
        StoreIP: order.StoreIP,
        Orders: null,
        CargoCompany: "BC",
      };

      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "SAP/SendOrder",
        sendOrderModel,
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (result.data.Status === 1 || result.data.Status === 2) {
        const desiControlModel = {
          TotalCount: order.TotalCount,
          SourceCode: "BC",
          CargoCompany: "BC",
          OrderNo: order.OrderNo,
        };

        let desiResult = await axios.post<OmsResponseBase<any>>(
          GetServiceUri(ServiceUrlType.OMS_BASE) +
          "PackageList/OrderDesiControl",
          desiControlModel,
          { headers: AccountService.tokenizeHeader(true) }
        );

        if (desiResult.data.Status === 1) {
          const saveDesiModel = {
            OrderNo: order.OrderNo,
            Barcode: "BC",
            Desi: "3",
            SAPDesi: "1",
            IsPackage: true,
          };

          let desires = await axios.post<OmsResponseBase<any>>(
            GetServiceUri(ServiceUrlType.OMS_BASE) +
            "PackageList/SaveOrderDesi",
            saveDesiModel,
            { headers: AccountService.tokenizeHeader(true) }
          );

          const zpl: string[] =
            desires.data.Messages["BCdummyBarcode"].split("SECOSULO");
          sendOrderModel.IsAllOrderPackaged = true;
          sendOrderModel.IsWayBill = true;
          sendOrderModel.IsOrderDesi = true;

          let zplRes = await axios.post<OmsResponseBase<any>>(
            GetServiceUri(ServiceUrlType.OMS_BASE) + "Gib/BelgeGonder",
            sendOrderModel,
            { headers: AccountService.tokenizeHeader(true) }
          );

          var res = await axios.post<OmsResponseBase<any>>(
            GetServiceUri(ServiceUrlType.OMS_BASE) +
            "PackageList/CompleteOrder",
            [sendOrderModel],
            { headers: AccountService.tokenizeHeader(true) }
          );

          zpl.forEach((x) => {
            this.Print(x, order.OrderNo);
          });

          await this.loadAllPackageList();
          Actions.popTo("omsDb");
          this.onLoadingPrintLabel = false;
          runInAction(() => (this.packageContiniousOrder = undefined));
          runInAction(() => (this.packagingTemp = []));
        }
      }
    }
  };

  @observable isPackageLoading: boolean = false;
  @action pickBagBarcodeStart = async () => {
    try {
      this.isPackageLoading = true;
      if (
        !this.CheckPrinterConfiguration(
          translate("omsService.configurePackagegingProcess")
        )
      ) {
        runInAction(() => (this.isPackageLoading = false));
        return false;
      }
      const order = this.packageList.find(
        (x) => x.OrderNo === this.packageContiniousOrder
      );

      if (order) {
        const sendOrderModel = {
          OrderNo: order.OrderNo,
          TotalCount: order.TotalCount,
          CompletedCount: order.TotalCount,
          IsAllOrderPackaged: true,
          IsWayBill: true,
          IsOrderDesi: true,
          IsGibMatbu: false,
          IsSentGib: true,
          OrderDesi: null,
          IsGift: 0,
          StoreIP: "00",
          Orders: null,
          CargoCompany:
            order.Orders.length > 0 ? order.Orders[0].CargoCompany : "",
        };

        let result = await axios.post<OmsResponseBase<any>>(
          GetServiceUri(ServiceUrlType.OMS_BASE) + "SAP/SendOrder",
          sendOrderModel,
          { headers: AccountService.tokenizeHeader(true) }
        );

        runInAction(() => (this.isPackageLoading = false));
        if (!result.data.Data) {
          MessageBoxNew.show(this.mergeMessages(result.data.Messages), {
            icon: <CloseIco />,
          });
          return false;
        }
        return true;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
      runInAction(() => (this.isPackageLoading = false));
    }
  };

  @action pickBagBarcodeStep2 = async (
    barcode: string,
    packageCount: number
  ) => {
    try {
      this.isPackageLoading = true;
      const order = this.packageList.find(
        (x) => x.OrderNo === this.packageContiniousOrder
      );

      if (order) {
        const desiControlModel = {
          TotalCount: 2,
          SourceCode: barcode,
          OrderNo: order.OrderNo,
        };

        let desiResult = await axios.post<OmsResponseBase<any>>(
          GetServiceUri(ServiceUrlType.OMS_BASE) +
          "PackageList/OrderDesiControl",
          desiControlModel,
          { headers: AccountService.tokenizeHeader(true) }
        );

        if (!desiResult.data.Data) {
          MessageBoxNew.show(this.mergeMessages(desiResult.data.Messages), {
            icon: <CloseIco />,
          });
          runInAction(() => (this.isPackageLoading = false));
          return false;
        }

        if (desiResult.data.Data.IsPackaged) {
          MessageBoxNew.show(translate("omsService.scannedBarcocedIncorrect"), {
            icon: <CloseIco />,
          });
          runInAction(() => (this.isPackageLoading = false));
          return false;
        }

        let IsPackage = desiResult.data.Data.ImageUrl === "Koli";

        if (IsPackage) {
          MessageBoxNew.show(
            translate("omsService.totalDecisQuestion1") +
            " " +
            desiResult.data.Data.CurrentStock +
            " " +
            translate("omsService.totalDecisQuestion2") +
            " " +
            desiResult.data.Data.GiftNote +
            " " +
            translate("omsService.totalDecisQuestion3"),
            {
              type: MessageBoxType.YesNo,
              yesButtonEvent: () => {
                this.saveSize(
                  order,
                  barcode,
                  desiResult.data.Data.GiftNote,
                  desiResult.data.Data.CurrentStock,
                  IsPackage,
                  packageCount
                );
                this.pickBagBarcodeStart();
              },
            }
          );
        } else {
          this.saveSize(
            order,
            barcode,
            desiResult.data.Data.GiftNote,
            desiResult.data.Data.CurrentStock,
            IsPackage,
            packageCount
          );
          this.pickBagBarcodeStart();
        }

        return true;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
      runInAction(() => (this.isPackageLoading = false));
    }
  };

  @observable completePickBag: boolean = false;
  @observable tempZpl: [] = [];
  @observable tempPdf: string[] = [];
  @action saveSize = async (
    order: OmsPackageModel,
    barcode: string,
    desi: any,
    sapDesi: any,
    isPackage: boolean,
    packageCount: number
  ) => {
    try {
      this.tempZpl = [];
      this.hasWaybillComplete = false;
      const saveDesiModel = {
        OrderNo: order.OrderNo,
        Barcode: barcode,
        Desi: desi,
        SAPDesi: sapDesi.replace(",", "."),
        IsPackage: isPackage,
        PackageCount: packageCount,
      };
      let desires = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "PackageList/SaveOrderDesi",
        saveDesiModel,
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (desires.data.Messages && desires.data.Messages["BCdummyBarcode"]) {
        this.tempZpl =
          desires.data.Messages["BCdummyBarcode"].split("SECOSULO");
      }

      if (desires.data.Data) {
        this.completePickBag = true;
        MessageBox.Show(
          translate("omsService.parcelAndBagScanSuccess"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => { },
          () => { }
        );
      } else {
        if (desires.data.Messages) {
          // SaveOrderDesi Error
          if (desires.data.Messages["SaveOrderDesi"]) {
            desires.data.Messages["SaveOrderDesi"] = translate(
              "omsService.selectParselAndBagWarning"
            );
            this.completePickBag = true;
          }

          MessageBox.Show(
            this.mergeMessages(desires.data.Messages),
            MessageBoxDetailType.Danger,
            MessageBoxType.Standart,
            () => { },
            () => { }
          );
        } else {
          MessageBox.Show(
            "Bilinmeyen bir hata oluştu",
            MessageBoxDetailType.Danger,
            MessageBoxType.Standart,
            () => { },
            () => { }
          );
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @observable waybillLoading: boolean = false;
  @action waybillPrint = async (barcode: string) => {
    try {
      this.waybillLoading = true;
      const order = this.packageList.find(
        (x) => x.OrderNo === this.packageContiniousOrder
      );

      if (order) {
        const sendOrderModel = {
          OrderNo: order.OrderNo,
          TotalCount: order.TotalCount,
          CompletedCount: order.TotalCount,
          IsGibMatbu: false,
          IsSentGib: false,
          IsAllOrderPackaged: true,
          IsWayBill: true,
          IsOrderDesi: true,
          OrderDesi: null,
          IsGift: 0,
          StoreIP: "00",
          Orders: null,
          CargoCompany:
            order.Orders.length > 0 ? order.Orders[0].CargoCompany : "",
        };

        var res = await axios.post<OmsResponseBase<any>>(
          GetServiceUri(ServiceUrlType.OMS_BASE) + "Gib/BelgeGonder",
          sendOrderModel,
          { headers: AccountService.tokenizeHeader(true) }
        );

        if (res.data.Status) {
          if (
            ApplicationGlobalService.omsPrintPdfBarcode &&
            Platform.OS === "web"
          ) {
            const result = await axios.post(
              GetServiceUri(ServiceUrlType.OMS_BASE) +
              "CargoReconciliation/PrintPdf",
              { orderNo: order.OrderNo },
              { headers: AccountService.tokenizeHeader() }
            );
            this.hasWaybillComplete = true;

            this.tempPdf = result.data.Data;
            this.tempPdf.forEach((x) => {
              this.downloadPdf(x);
            });
          } else {
            await this.getZplData(order.OrderNo);
            this.hasWaybillComplete = true;

            this.tempZpl.forEach((x) => {
              this.Print(x, order.OrderNo);
            });
          }
        } else {
          MessageBox.Show(
            this.mergeMessages(res.data.Messages),
            MessageBoxDetailType.Danger,
            MessageBoxType.Standart,
            () => { },
            () => { }
          );
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.waybillLoading = false;
    }
  };
  @action getZplData = async (orderNo: string) => {
    try {
      this.tempZpl = [];
      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "ARASCargo/GetBarcode",
        { OrderNo: orderNo },
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (result.data.Data) {
        this.tempZpl = result.data.Data.split("SECOSULO");
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };

  @observable completePackageLoading: boolean = false;
  @action completePackage = async () => {
    try {
      this.completePackageLoading = true;
      const order = this.packageList.find(
        (x) => x.OrderNo === this.packageContiniousOrder
      );

      if (order) {
        const sendOrderModel = {
          OrderNo: order.OrderNo,
          TotalCount: order.TotalCount,
          CompletedCount: order.TotalCount,
          IsGibMatbu: false,
          IsSentGib: false,
          IsAllOrderPackaged: true,
          IsWayBill: true,
          IsOrderDesi: true,
          OrderDesi: null,
          IsGift: 0,
          StoreIP: "00",
          Orders: null,
          CargoCompany:
            order.Orders.length > 0 ? order.Orders[0].CargoCompany : "",
        };

        var res = await axios.post<OmsResponseBase<any>>(
          GetServiceUri(ServiceUrlType.OMS_BASE) + "PackageList/CompleteOrder",
          [sendOrderModel],
          { headers: AccountService.tokenizeHeader(true) }
        );
        if (res.data.Data) {
          this.loadAllPackageList();
          this.completePackageLoading = false;
          this.waybillLoading = false;
          this.tempZpl = [];
          Actions.pop();
          this.packagingTemp = [];
          this.completePickBag = false;
          this.packageContiniousOrder = "";
        } else {
          MessageBox.Show(
            this.mergeMessages(res.data.Messages),
            MessageBoxDetailType.Danger,
            MessageBoxType.Standart,
            () => { },
            () => { }
          );
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.completePackageLoading = false;
    }
  };

  @observable cargoConsensusRes: any[] = [];
  @observable isConsensusCargoLoading: boolean = false;
  @action getCargoConsensus = async (
    cargoCompany: string,
    isWaitingCargo: boolean
  ) => {
    try {
      this.isConsensusCargoLoading = true;
      console.log(cargoCompany);
      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "CargoReconciliation/GetList",
        isWaitingCargo
          ? {
            CargoCompany: cargoCompany.trim(),
            AccetptenceNo: "0",
            OrderNo: "",
            OrderDate: `${this.omsConsensusStartDate.getDate()}.${this.omsConsensusStartDate.getMonth() + 1
              }.${this.omsConsensusStartDate.getFullYear()}`,
            ChannelCode: "0",
            IsGift: isWaitingCargo,
          }
          : {
            CargoCompany: cargoCompany.trim(),
            OrderDate: `${this.omsConsensusStartDate.getDate()}.${this.omsConsensusStartDate.getMonth() + 1
              }.${this.omsConsensusStartDate.getFullYear()}`,
            ChannelCode: "0",
            IsGift: isWaitingCargo,
          },
        { headers: AccountService.tokenizeHeader(true) }
      );

      console.log(result.data.Data);
      this.cargoConsensusRes = result.data.Data || [];
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isConsensusCargoLoading = false));
    }
  };

  @action getRealtimeQuantity = async (
    orderDetail: OmsOrderDetail,
    reason: string
  ) => {
    let model = {
      ID: orderDetail.ID,
      Brand: orderDetail.Brand,
      ModelName: orderDetail.ModelName,
      Color: orderDetail.Color,
      Category: orderDetail.Category,
      BodySize: orderDetail.BodySize,
      Quantity: orderDetail.Quantity,
      BarcodeNo: orderDetail.BarcodeNo,
      ProductBarcode: orderDetail.ProductBarcode,
      ProductBarcodes: orderDetail.ProductBarcodes,
      SKUNo: orderDetail.SKUNo,
      CurrentStock: null,
      OrderNo: orderDetail.OrderNo,
      OrderID: 0,
      ProductNo: orderDetail.ProductNo,
      OrderStatusID: "2",
      StoreCode: orderDetail.StoreCode,
      StoreName: orderDetail.StoreName,
      ImageUrl: orderDetail.ImageUrl,
      ProductStatus: 0,
      ProductStatusImage: null,
      ProductStatusDescription: reason,
      SourceCode: orderDetail.SourceCode,
      IsPackaged: null,
      CreateDate: orderDetail.CreateDate,
      CreatedDate: null,
      LeftHours: 0,
      IsPrinted: false,
      NotFoundProductPrintStatusID: 0,
      OrderItemID: null,
      IsGift: 0,
      GiftNote: null,
      FoundCount: 0,
      StoreIP: null,
      CargoCompany: null,
      Desi: orderDetail.Desi,
      ChannelCode: orderDetail.ChannelCode,
    };
    this.cancelLoading = true;

    let r = await axios.post<OmsResponseBase<boolean>>(
      GetServiceUri(ServiceUrlType.OMS_BASE) + "PackageList/WayBillControl",
      { OrderNo: model.OrderNo },
      { headers: AccountService.tokenizeHeader(true) }
    );

    if (r.data.Data) {
      MessageBoxNew.show(
        "Bu siparişin irsaliyesi kesildiğinden dolayı sipariş iptal edilemez"
      );
      this.cancelLoading = false;
      return false;
    }

    let result = await axios.post<OmsResponseBase<any>>(
      GetServiceUri(ServiceUrlType.OMS_BASE) + "SAP/GetRealTimeStock",
      model,
      { headers: AccountService.tokenizeHeader(true) }
    );

    console.log(result.data);
  };
  @observable selectedCensusList: any[] = [];
  @observable printContractLoadingState: boolean = false;
  @action printContract = async (
    model: { OrderNo: string; AccetptenceNo: string }[]
  ) => {
    try {
      if (
        !this.CheckPrinterConfiguration(
          translate("omsService.configurePackagegingProcess")
        )
      ) {
        return false;
      }
      this.printContractLoadingState = false;
      let act = linq
        .from(model)
        .select((x) => x.AccetptenceNo)
        .distinct()
        .where((x) => x !== null && x !== undefined && x !== "")
        .toArray();

      if (act.length > 0) {
        act.map(async (x) => {
          if (Platform.OS === "web") {
            const result = await axios.post(
              GetServiceUri(ServiceUrlType.OMS_BASE) +
              "CargoReconciliation/GetCargoReconciliationPdf",
              { AccetptenceNo: x },
              { headers: AccountService.tokenizeHeader() }
            );

            this.downloadPdf(result.data.Data);
          } else {
            let zplRes = await axios.post<OmsResponseBase<string[]>>(
              GetServiceUri(ServiceUrlType.OMS_BASE) +
              "CargoReconciliation/GetZpl",
              { AccetptenceNo: x },
              { headers: AccountService.tokenizeHeader(true) }
            );

            zplRes.data.Data.map((x) => {
              this.Print(x);
            });
          }
        });

        return true;
      }

      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) +
        "CargoReconciliation/SaveCargoReconciliation",
        model,
        { headers: AccountService.tokenizeHeader(true) }
      );

      if (Platform.OS === "web") {
        const res2 = await axios.post(
          GetServiceUri(ServiceUrlType.OMS_BASE) +
          "CargoReconciliation/GetCargoReconciliationPdf",
          { AccetptenceNo: result.data.Data.AccetptenceNo },
          { headers: AccountService.tokenizeHeader() }
        );

        this.downloadPdf(res2.data.Data);
      } else {
        let zplRes = await axios.post<OmsResponseBase<string[]>>(
          GetServiceUri(ServiceUrlType.OMS_BASE) + "CargoReconciliation/GetZpl",
          { AccetptenceNo: result.data.Data.AccetptenceNo },
          { headers: AccountService.tokenizeHeader(true) }
        );

        zplRes.data.Data.map((x) => {
          this.Print(x);
        });
      }
      this.printContractLoadingState = false;
      return true;
    } catch (err: any) {
      if (
        err?.response?.status === 700 ||
        err?.response?.status === 401 ||
        err?.response?.status === 409
      )
        FloDigitalErrorParse(err);
      else MessageBoxNew.show(translate("omsService.suppressionFailed"));

      return false;
    } finally {
      runInAction(() => (this.printContractLoadingState = false));
    }
  };

  @action downloadPdf = (b64: string) => {
    const linkSource = `data:application/octet-stream;base64,${b64}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download =
      "mutabakat-" + moment(new Date()).format("DD-MM-YYYY") + ".pdf";
    downloadLink.click();
    downloadLink.remove();
  };

  @action printZpl = async (orderId: string) => {
    try {
      if (ApplicationGlobalService.omsPrintPdfBarcode) {
        if (Platform.OS === "web") {
          const result = await axios.post(
            GetServiceUri(ServiceUrlType.OMS_BASE) +
            "CargoReconciliation/PrintPdf",
            { orderNo: orderId },
            { headers: AccountService.tokenizeHeader() }
          );

          this.tempPdf = result.data.Data;
          this.tempPdf.forEach((x) => {
            this.downloadPdf(x);
          });
          this.hasWaybillComplete = true;

          // this.downloadPdf()
        }
      }
      if (
        !this.CheckPrinterConfiguration(
          translate("omsService.configurePackagegingProcess")
        )
      ) {
        return;
      }
      await this.getZplData(orderId);
      this.hasWaybillComplete = true;

      this.tempZpl.forEach((x) => {
        this.Print(x, orderId);
      });
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.tempZpl = []));
    }
  };

  @action printOrderLabel = async (barcode: string) => {
    try {
      if (
        ApplicationGlobalService.omsPrintPdfBarcode &&
        Platform.OS === "web"
      ) {
        const result = await axios.post(
          GetServiceUri(ServiceUrlType.OMS_BASE) +
          "CargoReconciliation/PrintPdf",
          { orderNo: this.packageContiniousOrder },
          { headers: AccountService.tokenizeHeader() }
        );
        this.hasWaybillComplete = true;

        this.tempPdf = result.data.Data;
        this.tempPdf.forEach((x) => {
          this.downloadPdf(x);
        });
      } else {
        if (
          !this.CheckPrinterConfiguration(
            translate("omsService.configurePackagegingProcess")
          )
        ) {
          return false;
        }
        this.hasWaybillComplete = true;

        this.tempZpl.forEach((x) => {
          this.Print(x, this.packageContiniousOrder);
        });
      }
    } catch {
      MessageBoxNew.show(translate("omsService.printingFailed"));
    }
  };

  @observable notfoundItems: NotFoundProductModel[] = [];
  @observable startNotFoundDate?: Date;
  @observable endNotFoundDate?: Date;
  @action loadNotFoundItems = async () => {
    try {
      this.loadingContent = true;
      this.notfoundItems = [];

      var model = {
        StartDate: moment(this.startNotFoundDate).format("YYYY-MM-DD 00:00:00"),
        FinishDate: moment(this.endNotFoundDate).format("YYYY-MM-DD 23:59:59"),
      };

      let result = await axios.post<OmsResponseBase<NotFoundProductModel[]>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) +
        "NotFoundProduct/GetNotFoundList",
        model,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.Data) this.notfoundItems = result.data.Data;

      if (Platform.OS === "web") {
        this.startNotFoundDate = moment(this.startNotFoundDate)
          .add(1, "day")
          .toDate();
        this.endNotFoundDate = moment(this.endNotFoundDate)
          .add(1, "day")
          .toDate();
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.loadingContent = false));
    }
  };

  @action GetOrderProductList = async (orderNo: string) => {
    try {
      let result = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) +
        "CargoReconciliation/GetOrderDetail",
        { OrderNo: orderNo },
        { headers: AccountService.tokenizeHeader() }
      );

      return result.data.Data;
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @observable orderHistory?: OrderHistoryModel;
  @action loadOrderHistory = async (query: string, pageNumber?: number) => {
    try {
      if (query === "" && (pageNumber === undefined || pageNumber === 1))
        this.loadingContent = true;

      let response = await axios.post<OmsResponseBase<OrderHistoryModel>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "History/GetList",
        { searchCriteria: query, PageNumber: pageNumber || 1 },
        { headers: AccountService.tokenizeHeader() }
      );

      // Servisten gelen datayı isme göre yakalayıp çeviriyor
      response.data.Data.Orders.forEach((x) => {
        Object.entries(tr.OmsOrderHistoryActions).forEach(([key, value]) => {
          if (value == x.Action) {
            x.Action = translate("OmsOrderHistoryActions." + key);
          }
        });
      });

      response.data.Data.OrderStats.forEach((x) => {
        Object.entries(tr.OmsOrderHistoryActions).forEach(([key, value]) => {
          if (value == x.Action) {
            x.Action = translate("OmsOrderHistoryActions." + key);
          }
        });
      });

      if (pageNumber === 1 || pageNumber === undefined) {
        this.orderHistory = response.data.Data;
      } else if (this.orderHistory) {
        this.orderHistory.Orders = [
          ...this.orderHistory.Orders,
          ...response.data.Data.Orders,
        ];
        this.orderHistory.OrderStats = [
          ...this.orderHistory.OrderStats,
          ...response.data.Data.OrderStats,
        ];
        this.orderHistory.HistoryCharts = [
          ...this.orderHistory.HistoryCharts,
          ...response.data.Data.HistoryCharts,
        ];
      } else {
        this.orderHistory = response.data.Data;
      }

      return response.data.Data;
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.loadingContent = false));
    }
  };

  @action GetWaybillStatus = async (startDate: Date, endDate: Date) => {
    try {
      const result = await axios.post(
        GetServiceUri(ServiceUrlType.OMS_BASE) +
        "Reporting/GetStatusWaybillStore",
        { StartDate: startDate, FinishDate: endDate },
        { headers: AccountService.tokenizeHeader() }
      );

      return result.data.Data;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return [];
    }
  };

  @action printWaybillTry = async (orderId: string) => {
    try {
      if (
        !this.CheckPrinterConfiguration(
          translate("omsService.configurePrinterBeforeWaybill")
        )
      ) {
        return;
      }

      if (ApplicationGlobalService.omsPrintPdfBarcode) {
        if (Platform.OS === "web") {
          const result = await axios.post(
            GetServiceUri(ServiceUrlType.OMS_BASE) +
            "CargoReconciliation/PrintPdf",
            { orderNo: orderId },
            { headers: AccountService.tokenizeHeader() }
          );

          this.tempPdf = result.data.Data;
          this.tempPdf.forEach((x) => {
            this.downloadPdf(x);
          });
          this.hasWaybillComplete = true;

          // this.downloadPdf()
        }
      } else {
        await this.getZplData(orderId);
        this.hasWaybillComplete = true;
        this.tempZpl.forEach((x) => {
          debugger;
          this.Print(x, orderId);
        });
      }
      // await this.getZplData(orderId);

      // this.Print(this.tempZpl, orderId);
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.tempZpl = []));
    }
  };

  @action waybillComplete = async (sendOrderModel: any) => {
    try {
      var res = await axios.post<OmsResponseBase<any>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) + "PackageList/CompleteOrder",
        [sendOrderModel],
        { headers: AccountService.tokenizeHeader(true) }
      );

      return res.data.Data;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return [];
    }
  };

  @action getOrderItemByOrderNo = async (orderNo: string) => {
    try {
      var res = await axios.post<OmsResponseBase<OrderItemDetail>>(
        GetServiceUri(ServiceUrlType.OMS_BASE) +
        "History/GetOrderItemByOrderNo?orderNo=" +
        orderNo,
        {},
        { headers: AccountService.tokenizeHeader() }
      );
      return res.data.Data;
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return [];
    }
  };

  @observable chiefReport: OmsChiefReportModel[] = [];
  @action getChiefReport = async () => {
    try {
      const uri =
        GetServiceUri(ServiceUrlType.OMS_BASE) + "OMC/GetEmployeeOrderReport";
      const result = await axios.post<OmsResponseBase<OmsChiefReportModel[]>>(
        uri,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.Status === 1) {
        runInAction(() => (this.chiefReport = result.data.Data));
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @observable toPoolLoading: boolean = false;
  @action userOrdersToPool = async (actionById: number) => {
    try {
      this.toPoolLoading = true;
      const uri =
        GetServiceUri(ServiceUrlType.OMS_BASE) +
        "OMC/UnAssignEmployeeOrder?ActionByID=" +
        actionById;

      const result = await axios.post<OmsResponseBase<OmsChiefReportModel[]>>(
        uri,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.Status === 1) {
        this.getChiefReport();
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.toPoolLoading = false));
    }
  };

  private CheckPrinterConfiguration(errorMsg: string) {
    if (Platform.OS === "web") return true;
    if (__DEV__) return true;

    if (
      PrinterConfigService.selectedPrinter === undefined ||
      PrinterConfigService.printerConfig === undefined ||
      Object.keys(PrinterConfigService.selectedPrinter).length == 0 ||
      Object.keys(PrinterConfigService.printerConfig).length == 0
    ) {
      MessageBox.Show(
        errorMsg,
        MessageBoxDetailType.Information,
        MessageBoxType.Standart,
        () => { },
        () => { }
      );

      return false;
    }

    return true;
  }

  private Print(zpl: string, orderId?: string) {
    if (Platform.OS === "web") {
      if (orderId === undefined) return;

      const uri = ApplicationGlobalService.testMode
        ? "http://10.203.2.5:4326/?OrderNo="
        : "http://10.201.12.4:4325/?OrderNo=";

      var w = window.open(uri + orderId, "_blank ");
    } else {
      PrinterConfigService.print(
        Platform.OS === "ios"
          ? PrinterConfigService.selectedPrinter.id
          : PrinterConfigService.selectedPrinter.address,
        zpl
      );
    }
  }

  CleanPicklist = () => {
    runInAction(() => {
      this.pickingTemp = [];
      this.continiousOrder = "";
    });
  };

  private mergeMessages = (obj: any) => {
    let messageStr = "";

    for (var key in obj) {
      messageStr += `${obj[key]}`;
    }

    return messageStr;
  };

  CleanPackageList = () => {
    runInAction(() => {
      this.packagingTemp = [];
      this.packageContiniousOrder = "";
    });
  };
}

export default new OmsService();

export interface HistoryOrder {
  OrderNo: string;
  Action: string;
  ActionID: number;
  ActionByName: string;
  ActionDate: Date;
  Duration: number;
  ActionFinishDate: Date;
  CargoRecDate: Date;
  Atf: string;
}

export interface OrderChartStats {
  OrderNo: string;
  Status1: number;
  Status2: number;
  Status3: number;
}

export interface OrderHistoryModel {
  Orders: HistoryOrder[];
  OrderStats: HistoryOrder[];
  HistoryCharts: OrderChartStats[];
}
export interface NotFoundProductModel {
  BarcodeNo: string;
  BodySize: string;
  Brand: string;
  CargoCompany?: any;
  Category: string;
  ChannelCode?: any;
  Color: string;
  CreateDate: Date;
  CreatedDate: Date;
  CurrentStock?: any;
  Desi: number;
  FoundCount: number;
  GiftNote?: any;
  ID: number;
  ImageUrl: string;
  IsGift: number;
  IsPackaged?: any;
  IsPrinted: boolean;
  LeftHours: number;
  ModelName: string;
  NotFoundProductPrintStatusID: number;
  OrderID: number;
  OrderItemID: number;
  OrderNo: string;
  OrderStatusID: string;
  ProductBarcode: string;
  ProductBarcodes?: any;
  ProductNo: string;
  ProductStatus: boolean;
  ProductStatusDescription: string;
  ProductStatusImage: string;
  Quantity: string;
  Remainder: number;
  SKUNo: string;
  SourceCode?: any;
  StoreCode: string;
  StoreIP?: any;
  StoreName: string;
  ActionDate?: Date;
}

export interface OrderItemDetail {
  BarcodeNo: string;
  Brand: string;
  Color: string;
  BodySize: string;
  Quantity: number;
}
