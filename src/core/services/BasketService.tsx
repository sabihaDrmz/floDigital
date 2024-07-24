import axios, { AxiosResponse } from "axios";
import i18n from 'i18next';
import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { Actions } from "react-native-router-flux";
import { translate } from "../../helper/localization/locaizationMain";
import { FloDigitalErrorParse } from "../HttpModule";
import {
  FloResultCode,
  ServiceResponseBase,
} from "../models/ServiceResponseBase";
import { GetServiceUri, ServiceUrlType } from "../Settings";
import { chekcAuthError, toOrganization } from "../Util";
import AccountService from "./AccountService";
import ApplicationGlobalService from "./ApplicationGlobalService";
import MessageBox, { MessageBoxDetailType, MessageBoxType } from "./MessageBox";
import MessageBoxNew from "./MessageBoxNew";
import ProductService, { ProductModel } from "./ProductService";
// import Crashlytics from '@react-native-firebase/crashlytics';
// import Analyrics from "@react-native-firebase/analytics";

class BasketService {
  //#region Props
  @observable updateted: boolean = false;
  @observable lastPhone: string = "";
  @observable lastEmail: string = "";
  @observable isLoading: boolean = false;
  @observable isStoreAddress: boolean = false;
  @observable deliveredStore: string = "";
  @observable basketStockItems: BasketStockItem[] = [];
  @observable address: BasketAddress = {
    aliciAdi: "",
    aliciSoyadi: "",
    adres: "",
    ilce: undefined,
    il: undefined,
    mahalle: undefined,
    telefon: "",
    ePosta: "",
    addressTitle: "",
    isCreateCustomer: false,
  };

  @observable selectedBasket: Basket = {
    basketItems: [],
    basketId: 0,
    basketTitle: "",
    basketStatusId: 0,
    companyCode: "",
    employeeId: "",
    id: 0,
    order: undefined,
  };

  @observable tempBasket: Basket = {
    basketItems: [],
    basketId: 0,
    basketTitle: "",
    basketStatusId: 0,
    companyCode: "",
    employeeId: "",
    id: 0,
    order: undefined,
  };

  @observable basketList: Basket[] = [];

  @observable incrementInterval: any;
  @observable basketAddressSearch: EcomAddress[] = [];
  @observable searchPhone: string = "";
  // @observable showAddressMessage: boolean = false;
  //#endregion

  //#region Ctor
  constructor() {
    makeAutoObservable(this);
    // makeObservable(this, {
    //   isLoading: observable,
    //   address: observable,
    //   selectedBasket: observable,
    //   basketList: observable,
    //   basketAddressSearch: observable,
    //   addProduct: action,
    //   removeProduct: action,
    //   updateProduct: action,
    //   removeBasket: action,
    //   completeBasket: action,
    //   selectBasket: action,
    //   paymentBasket: action,
    //   getAllBaskets: action,
    //   clearBasket: action,
    //   sentKvkk: action,
    //   validateKvkk: action,
    //   sentContract: action,
    //   validateContract: action,
    //   isValidAddress: action,
    //   selectAddress: action,
    //   checkAddress: action,
    // });
  }
  //#endregion

  //#region Product
  @action addProduct = async (isOmc: boolean) => {
    // Crashlytics().log('Sepete ürün atıldı');
    try {
      if (this.selectedBasket === null || this.selectedBasket === undefined) {
        this.selectedBasket = {
          basketItems: [],
          basketId: 0,
          basketTitle: "",
          basketStatusId: 0,
          companyCode: "",
          employeeId: "",
          id: 0,
          order: undefined,
        };
      }
      if (this.isLoading) return;
      this.isLoading = true;

      let product = ProductService.product;

      if (!product) return;

      const {
        barcode,
        sku,
        parentSku,
        price,
        images,
        name,
        size,
        color,
        brand,
        outlet,
      } = product?.product;
      const { ecomProductFooter, sizes } = product;
      // Analyrics().logEvent("basket_event", {
      //   type: "add_product",
      //   isOmc,
      //   barcode,
      //   sku,
      //   parentSku,
      // });

      if (price === 0) {
        MessageBox.Show(
          translate("basketPriceZeroError"),
          MessageBoxDetailType.Danger,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        return;
      }

      const isExist = this.isInBasket(barcode, isOmc);

      // ? Sepette adet güncelleme
      if (isExist && this.isCurrentBasketExsist()) {
        let basketItem = this.findBasketItem(barcode, isOmc);

        // Sepetteki ürün var ise adeti bir arttır ve güncelle
        if (basketItem !== undefined) {
          Actions["isoBasket"]();
          this.updateProduct(barcode, isOmc, basketItem.quantity + 1, true);
        }
      }
      // ? Sepete yeni ürün olarak ekle
      else {
        let model = {
          id: this.isCurrentBasketExsist() ? this.selectedBasket.id : 0,
          storeId: AccountService.getUserStoreId(),
          employeeId: AccountService.employeeInfo.EfficiencyRecord,
          companyCode: toOrganization(
            AccountService.employeeInfo.ExpenseLocationCode
          ),
          basketStatusId: this.isCurrentBasketExsist()
            ? this.selectedBasket.basketStatusId
            : 0,
          item: {
            basketId: this.selectedBasket.id,
            sku,
            parentSku,
            price: product.tagValue.find((x) => x.tag === "KBETR3")?.value,
            name,
            barcode,
            title: brand,
            description: name,
            size,
            color,
            productImage: images[0],
            storeStock: sizes.store.find((x) => x.barcode === barcode)?.qty,
            ecomStock: sizes.ecom.find((x) => x.barcode === barcode)?.qty,
            ecomPrice: ecomProductFooter.price,
            isOmc,
            outlet,
            quantity: 1,
          },
        };

        // NOTE: Sepete Ürün Ekle
        let result = await axios.post<ServiceResponseBase<Basket[]>>(
          GetServiceUri(ServiceUrlType.ADD_BASKET),
          model,
          { headers: AccountService.tokenizeHeader() }
        );

        this.changeBasketTracker(result);

        if (result.data && result.data.state === FloResultCode.Successfully)
          Actions["isoBasket"]();
        // //?Başarılı bir sonuç döndü ise
        // if (result.data && result.data.state === FloResultCode.Successfully) {
        //   this.selectedBasket = result.data.model[0];
        //   Actions["isoBasket"]();
        // }
        // //?Sepete atma işlemi başarısız
        // else {
        //   this.basketCompleteTest(result);
        // }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action basketCompleteTest = async (result: any) => {
    // debugger;

    if (
      result.data.message === "be.errors.basketCheckout" ||
      result.data.message === "be.errors.cardBilled"
    ) {
      await this.getAllBaskets();
      Actions.pop();
    }

    MessageBoxNew.show(
      result.data.message.startsWith("be.")
        ? i18n.t(result.data.message)
        : result.data.message
    );
  };

  @action removeProduct = async (lineNumber: number) => {
    try {
      this.isLoading = true;

      if (this.isCurrentBasketExsist()) {
        let check = this.selectedBasket.basketItems.findIndex(
          (x) => x.id === lineNumber
        );

        if (check !== -1) {
          // NOTE: Sepetten Ürün Silme
          // Analyrics().logEvent("basket_event", {
          //   type: "remove_product_from_basket",
          //   barcode: this.selectedBasket.basketItems[check].barcode,
          //   isOmc: this.selectedBasket.basketItems[check].isOmc,
          //   sku: this.selectedBasket.basketItems[check].sku,
          //   parentSKU: this.selectedBasket.basketItems[check].parentSKU,
          //   basketId: this.selectedBasket.basketItems[check].id,
          // });
          let result = await axios.post<ServiceResponseBase<Basket[]>>(
            `${GetServiceUri(
              ServiceUrlType.DELETE_BASKET_ITEM
            )}?id=${lineNumber}`,
            {},
            { headers: AccountService.tokenizeHeader() }
          );

          this.changeBasketTracker(result);
          // if (result.data && result.data.state === FloResultCode.Successfully) {

          //   if (result.data.model.length === 0) {
          //     Actions.pop();
          //     await this.getAllBaskets();
          //     await this.clearBasket();
          //   } else {
          //     this.selectedBasket = result.data.model[0];
          //     this.updateBasketList(
          //       this.selectedBasket.id,
          //       this.selectedBasket.basketItems
          //     );
          //   }
          // } else {
          //   this.basketCompleteTest(result);
          // }
        }
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action updateBasketList = async (basketId: any, lines: any) => {
    const index = this.basketList.findIndex((x) => x.id === basketId);

    if (index >= 0) this.basketList[index].basketItems = lines;
  };

  @action changeBasketTracker = async (
    result: AxiosResponse<ServiceResponseBase<Basket[]>>
  ) => {
    // debugger;
    if (
      result.data.model !== undefined &&
      result.data.model !== null &&
      result.data.model.length === 0
    ) {
      Actions.pop();
      await this.getAllBaskets();
      await this.clearBasket();
      return;
    }

    if (
      this.selectedBasket.isAddressComplate &&
      result.data.model.length > 0 &&
      !result.data.model[0].isAddressComplate
    ) {
      if (
        result.data.model !== undefined &&
        result.data.model !== null &&
        result.data.model.length > 0
      ) {
        this.selectedBasket = result.data.model[0];
        this.updateBasketList(
          this.selectedBasket.id,
          result.data.model[0].basketItems
        );
      }
      MessageBoxNew.show(
        i18n.t("isoBasket.showMssMessage"),
        result.data.state !== FloResultCode.Successfully
          ? {
              onHide: () => {
                // this.updateBasketList(this.selectedBasket.id, result.model[0]);

                this.basketCompleteTest(result);
              },
            }
          : undefined
      );
      return;
    } else if (result.data.state !== FloResultCode.Successfully)
      this.basketCompleteTest(result);

    if (
      result.data.model !== undefined &&
      result.data.model !== null &&
      result.data.model.length > 0
    ) {
      this.selectedBasket = result.data.model[0];
      this.updateBasketList(
        this.selectedBasket.id,
        result.data.model[0].basketItems
      );
    }
  };

  @action updateProduct = async (
    // barkod no
    barcode: string,
    // omcli ürün mü
    isOmc: boolean,
    // yeni adet
    quantity: number,
    // Loading kesmeyi ez
    forceLoading?: boolean,
    // Is Omc değiştir
    newOmcState?: boolean
  ) => {
    if (quantity <= 0 || quantity > 20) return;
    try {
      if (!forceLoading && this.isLoading) return;

      this.isLoading = true;
      let basketItem = this.findBasketItem(barcode, isOmc);

      if (basketItem !== undefined) {
        // Analyrics().logEvent("basket_event", {
        //   type: "update",
        //   barcode: basketItem.barcode,
        //   sku: basketItem.sku,
        //   parentSKU: basketItem.parentSKU,
        //   oldQuantity: basketItem.quantity,
        //   newQuantity: quantity,
        // });
        basketItem.quantity = quantity;

        if (newOmcState !== undefined) basketItem.isOmc = newOmcState;
        //NOTE: eğer satır id yoksa hata mesajı göster

        if (basketItem.id === 0) return;

        if (!this.incrementInterval) this.tempBasket = this.selectedBasket;

        if (this.incrementInterval) clearTimeout(this.incrementInterval);

        this.incrementInterval = setTimeout(async () => {
          try {
            runInAction(() => (this.isLoading = true));
            //NOTE: Sepet Güncelleme
            let result = await axios.post<ServiceResponseBase<Basket[]>>(
              GetServiceUri(ServiceUrlType.UPDATE_BASKET),
              basketItem,
              { headers: AccountService.tokenizeHeader() }
            );
            this.changeBasketTracker(result);
          } catch (err) {
          } finally {
            runInAction(() => (this.isLoading = false));
          }
        }, 500);
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      this.selectedBasket = this.tempBasket;
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };
  //#endregion

  //#region  Basket
  //TODO: Bu kısım eklenecek
  @action removeBasket = async (basketId: number) => {
    try {
      this.isLoading = true;

      // Analyrics().logEvent("basket_event", {
      //   type: "remove_basket",
      //   basketId: basketId,
      // });

      let result = await axios.post<ServiceResponseBase<Basket[]>>(
        `${GetServiceUri(ServiceUrlType.DELETE_BASKET)}?id=${basketId}`,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
        if (
          this.selectedBasket !== undefined &&
          this.selectedBasket !== null &&
          (this.selectedBasket.id === basketId ||
            this.selectedBasket.basketId === basketId)
        )
          this.clearBasket();
        this.basketList = this.basketList.filter((x) => x.id !== basketId);
      } else {
        this.basketCompleteTest(result);
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action completeBasket = async () => {
    try {
      this.isLoading = true;
      // Analyrics().logEvent("basket_event", {
      //   type: "cmplete",
      //   basketId: this.selectedBasket.id,
      // });

      let result = await axios.post<ServiceResponseBase<Basket>>(
        GetServiceUri(ServiceUrlType.BASKET_COMPLETE),
        {
          id: this.selectedBasket.id,
          basketID: this.selectedBasket.id,
          basketStatusID: 2,
          statusInfo: "Complete",
        },
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
        if (
          result.data.model.basketItemResults &&
          result.data.model.basketItemResults.length > 0
        ) {
          // ! Stoklarda değişiklik oldu sepetteki ürünler güncellendi bilgisi gösterilecek
          this.selectedBasket = result.data.model;
          MessageBoxNew.show(
            result.data.message.startsWith("be.")
              ? i18n.t(result.data.message)
              : result.data.message
          );
        } else {
          /*
           * Sepet başarıyla oluştu sepet numarasını kullanıcıya göster
           * Tamam tuşuna basıldığında sepet temizlenir ve ürün sorgulama ekranına gönderilir.
           */
          if (result.data.model.basketTicketId)
            MessageBox.Show(
              result.data.model.basketTicketId.toString(),
              MessageBoxDetailType.Information,
              MessageBoxType.BasketNumber,
              () => {
                this.clearBasket();
                Actions.popTo("isoBarcodeCheck");
              },
              () => {}
            );
        }
      } else {
        this.basketCompleteTest(result);
      }
    } catch (err: any) {
      runInAction(() => (this.basketList = []));

      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  // Sepet seçildi
  @action isValidAddress = () => {
    // Yeni müşteri oluşturulacak ve eposta adresi yok ise
    if (
      this.address.isCreateCustomer &&
      (this.address.ePosta === undefined ||
        this.address.ePosta === null ||
        this.address.ePosta.length < 5 ||
        !this.address.ePosta.includes("@"))
    ) {
      // Hata mesajını göster
      MessageBox.Show(
        translate("errorMsgs.emailRequiredNewCustomer"),
        MessageBoxDetailType.Danger,
        MessageBoxType.Standart,
        () => {},
        () => {}
      );
      return false;
    }

    if (
      !this.isStoreAddress &&
      (this.address.mahalle === undefined || this.address.mahalle === null)
    )
      return false;

    // Adres bilgilerinde eksiklik var mı ?
    if (
      this.address.aliciAdi?.trim().length > 0 &&
      this.address.aliciSoyadi?.trim().length > 0 &&
      this.address.adres?.trim().length > 10 &&
      this.address.ilce &&
      this.address.il &&
      this.address.telefon?.length > 0 &&
      this.address.telefon?.length === "9 ( 999 ) 999 99 99".length
    )
      return true;

    //TODO: Hata mesajı burada olmayacak
    // Hata mesajı göster
    // MessageBox.Show(
    //   'Lütfen girmiş olduğunuz bilgileri kontrol edin.',
    //   MessageBoxDetailType.Danger,
    //   MessageBoxType.Standart,
    //   () => {},
    //   () => {},
    // );
    return false;
  };

  // Sepet seç
  @action selectBasket = async (basketId: number) => {
    try {
      this.isLoading = true;

      await this.checkStock(basketId);
      let currentBasket = this.basketList.find((x) => x.id === basketId);
      // Analyrics().logEvent("basket_event", {
      //   type: "show_basket",
      //   basketId: basketId,
      // });
      if (currentBasket) {
        // Şehir listesi henüz çekilmedi ise şehir listesini yeniden iste
        if (
          !ApplicationGlobalService.cityes ||
          ApplicationGlobalService.cityes.length === 0
        )
          await ApplicationGlobalService.getAllCities();

        // Bu sepete daha önceden adres girilmiş mi ?
        if (currentBasket.order) {
          let locales = ["tr", "TR", "tr-TR", "tr-u-co-search", "tr-x-turkish"];

          let customerAddress = {
            aliciAdi: currentBasket.order.aliciAdi,
            aliciSoyadi: currentBasket.order.aliciSoyadi,
            adres: currentBasket.order.adres,
            il: undefined,
            ilce: undefined,
            mahalle: undefined,
            isCreateCustomer: false,
            telefon: currentBasket.order.telefon,
            ePosta: currentBasket.order.ePosta,
            addressTitle: "----",
          };

          this.lastPhone = this.address?.telefon;
          this.lastEmail = this.address?.ePosta;

          if (currentBasket.order.il) {
            customerAddress.il = ApplicationGlobalService.cityes.find(
              (x) =>
                ApplicationGlobalService.turkishtoEnglish(
                  x.name
                ).toLocaleUpperCase(locales) ===
                ApplicationGlobalService.turkishtoEnglish(
                  //@ts-ignore
                  currentBasket.order.il
                ).toLocaleUpperCase(locales)
            );

            await ApplicationGlobalService.getDistrictByCity(
              //@ts-ignore
              customerAddress.il?.id
            );

            customerAddress.ilce = ApplicationGlobalService.districts.find(
              (x) =>
                ApplicationGlobalService.turkishtoEnglish(
                  x.name
                ).toLocaleUpperCase(locales) ===
                ApplicationGlobalService.turkishtoEnglish(
                  //@ts-ignore
                  currentBasket?.order?.ilce
                ).toLocaleUpperCase(locales)
            );

            if (customerAddress.ilce) {
              await ApplicationGlobalService.getNeighborhoodByDistrictId(
                //@ts-ignore
                customerAddress.ilce.id
              );

              customerAddress.mahalle =
                ApplicationGlobalService.neighbourhoods.find(
                  (x) =>
                    ApplicationGlobalService.turkishtoEnglish(
                      x.name
                    ).toLocaleUpperCase(locales) ===
                    ApplicationGlobalService.turkishtoEnglish(
                      //@ts-ignore
                      currentBasket?.order?.mahalle
                    ).toLocaleUpperCase(locales)
                );
            }
          }
          this.address = customerAddress;
          this.deliveredStore = currentBasket.order.deliveredStore;
        }

        this.selectedBasket = currentBasket;

        Actions["isoBasket"]({ resetToBack: true });
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action paymentBasket = async () => {
    this.isLoading = true;
    // Analyrics().logEvent("basket_event", {
    //   type: "payment_confirm",
    //   basketId: this.selectedBasket?.id,
    // });
    let model = {
      sepetId: this.selectedBasket?.id.toString(),
      dukkanId: Number(AccountService.getUserStoreId()),
      aliciAdi: this.address.aliciAdi,
      aliciSoyadi: this.address.aliciSoyadi,
      adres: this.address.adres,
      ilce: this.address.ilce?.name,
      il: this.address.il?.name,
      mahalle: this.address.mahalle?.name,
      telefon: this.address.telefon,
      ePosta: this.address.ePosta,
      isCreateCustomer: this.address.isCreateCustomer,
      newCustomer: this.address.isCreateCustomer,
      id: 0,
      musteriId: 0,
      platformId: 0,
      platform: "string",
      status: "string",
      message: "string",
      error: "string",
      orderId: "string",
      kampanyaKodu: "string",
      deliveredStore: this.deliveredStore ?? "",
    };

    try {
      let result = await axios.post(
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Order/Create",
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (result.status === 200 && result.data.state === 1) {
        MessageBox.Show(
          translate("errorMsgs.sentToGenius"),
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {
            this.getAllBaskets();
            Actions.popTo("isoBarcodeCheck");
            this.clearBasket();
          },
          () => {}
        );
      } else {
        this.basketCompleteTest(result);
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
      this.isLoading = false;
    }
  };

  // Tüm sepetleri sunucudan getir.
  @action getAllBaskets = async (ignoreClear?: boolean) => {
    try {
      // Analyrics().logEvent("basket_event", {
      //   type: "list_baskets",
      // });
      runInAction(() => (this.isLoading = true));

      let response = await axios.post<ServiceResponseBase<Basket[]>>(
        GetServiceUri(ServiceUrlType.GET_BASKET_LIST) +
          "?storeId=" +
          AccountService.getUserStoreId(),
        null,
        { headers: AccountService.tokenizeHeader() }
      );

      if (response.data.state === FloResultCode.Successfully) {
        if (ignoreClear !== true) await this.clearBasket();
        runInAction(() => (this.basketList = response.data.model));
      } else {
        runInAction(() => (this.basketList = []));
      }
    } catch (err: any) {
      runInAction(() => (this.basketList = []));
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  // Seçili sepeti ve adres bilgilerini temizle
  @action clearBasket = async () => {
    runInAction(() => {
      this.selectedBasket = {
        basketItems: [],
        basketId: 0,
        basketTitle: "",
        basketStatusId: 0,
        companyCode: "",
        employeeId: "",
        id: 0,
        order: undefined,
      };
      this.address = {
        aliciAdi: "",
        aliciSoyadi: "",
        adres: "",
        ilce: undefined,
        il: undefined,
        mahalle: undefined,
        telefon: "",
        ePosta: "",
        addressTitle: "",
        isCreateCustomer: false,
      };
    });
  };

  //#endregion

  //#region  Sms
  @action sentKvkk = async (onBackAction?: () => void) => {
    try {
      this.isLoading = true;
      let model: SubscriptionModel = {
        phone: this.address?.telefon,
        storeId: Number(AccountService.getUserStoreId()),
        newCustomer: this.address?.isCreateCustomer,
        pos: 0,
        createdById: 0,
        message: "string",
        isPersonel: true,
        agreementTypeId: 1,
        token: "string",
      };

      let result = await axios.post(
        GetServiceUri(ServiceUrlType.SEND_KVKK_SMS),
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );
      if (result.status === 200 && result.data.state === 200) {
        if (result.data.model?.model?.permission) {
          if (onBackAction) {
            onBackAction();
          }
          Actions.popTo("isoBasket");
          // return;
        } else {
          MessageBox.Show(
            "",
            MessageBoxDetailType.Information,
            MessageBoxType.SmsValidation,
            () => {},
            () => {},
            (validationCode) => {
              this.validateKvkk(validationCode);
            },
            () => this.sentKvkk(onBackAction)
          );
        }
      } else await this.unexceptedError();
    } catch (err: any) {
      runInAction(() => (this.basketList = []));
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };
  @action validateKvkk = async (validationCode: string) => {
    try {
      // MessageBox.onComplete ? MessageBox.onComplete() : undefined;
      // MessageBox.Hide();
      let model = {
        phone: this.address?.telefon,
        email: this.address?.ePosta,
        code: validationCode,
        isPersonel: false,
        transactionValue: this.address?.telefon,
        agreementTypeId: 1,
        token: "",
      };

      this.lastEmail = this.address?.ePosta;
      this.lastPhone = this.address?.telefon;

      let result = await axios.post(
        GetServiceUri(ServiceUrlType.APPROVE_KVKK_SMS),
        model,
        {
          headers: AccountService.tokenizeHeader(),
        }
      );

      if (
        result.status === 200 &&
        result.data.state === 200 &&
        result.data.model.state === 1
      ) {
        MessageBox.Hide();
        if (MessageBox.onComplete) MessageBox.onComplete();
        Actions.popTo("isoBasket");
      } else {
        MessageBox.message = "Doğrulama kodunuz geçerli değil.";
      }
    } catch (err) {
      MessageBox.message = "Doğrulama kodunuz geçerli değil.";
    } finally {
    }
  };

  @action sentContract = async () => {
    try {
      if (this.isLoading) return;
      this.isLoading = true;

      var checkOmcsProduct = this.selectedBasket?.basketItems.filter(
        (x) => x.isOmc
      );

      if (!checkOmcsProduct || checkOmcsProduct?.length === 0) {
        await this.paymentBasket();
        return;
      }

      let model = {
        aliciAdi: this.address.aliciAdi,
        aliciSoyadi: this.address.aliciSoyadi,
        adres: this.address.adres,
        ilce: this.address.ilce?.name,
        il: this.address.il?.name,
        telefon: this.address.telefon,
        ePosta: this.address.ePosta,
      };

      let contractRes = await axios.post<ServiceResponseBase<any>>(
        GetServiceUri(ServiceUrlType.SENT_CONTRACT_SMS) +
          this.selectedBasket?.id,
        {
          aliciAdi: this.address.aliciAdi,
          aliciSoyadi: this.address.aliciSoyadi,
          adres: this.address.adres,
          ilce: this.address.ilce?.name,
          il: this.address.il?.name,
          telefon: this.address.telefon,
          ePosta: this.address.ePosta,
        },
        { headers: AccountService.tokenizeHeader() }
      );
      if (
        contractRes.status === 200 &&
        contractRes.data.state === 1 &&
        contractRes.data.isValid
      ) {
        MessageBox.Show(
          "",
          MessageBoxDetailType.Information,
          MessageBoxType.SmsValidation,
          () => {},
          () => {},
          (validationCode) => {
            this.validateContract(validationCode);
          },
          () => this.sentContract()
        );
      } else {
        const basketIdTemp = this.selectedBasket.id;
        await this.getAllBaskets(true);

        let currentBasket = this.basketList.find((x) => x.id === basketIdTemp);
        if (currentBasket) this.selectedBasket = currentBasket;

        MessageBox.Show(
          contractRes.data.message.startsWith("be.")
            ? i18n.t(contractRes.data.message)
            : contractRes.data.message,
          MessageBoxDetailType.Information,
          MessageBoxType.Standart,
          () => {},
          () => {}
        );
        await this.getAllBaskets();
        Actions.pop();
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      await this.getAllBaskets();
      Actions.pop();
    } finally {
      this.isLoading = false;
    }
  };
  @action validateContract = async (validationCode: string) => {
    try {
      let validateResult = await axios.post(
        GetServiceUri(ServiceUrlType.APPROVE_CONTACT_SMS) +
          `?basketId=${this.selectedBasket?.id}&approveCode=${validationCode}`,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      if (validateResult.status === 200 && validateResult.data.model) {
        this.paymentBasket();
      } else {
        MessageBox.message = "Doğrulama kodunuz geçerli değil.";
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    } finally {
    }
  };
  //#endregion

  //#region Address
  @action checkAddress = async (phone: string) => {
    try {
      this.isLoading = true;
      if (phone && phone.length > 0) {
        let result = await axios.get<ServiceResponseBase<EcomAddress[]>>(
          GetServiceUri(ServiceUrlType.ADDRES_CHECK) + phone,
          { headers: AccountService.tokenizeHeader() }
        );

        if (result.data.state === FloResultCode.Successfully) {
          this.searchPhone = phone;
          this.basketAddressSearch = result.data.model;
          Actions["isoAddressList"]();
        }
      }
    } catch (err: any) {
      runInAction(() => (this.basketList = []));
      FloDigitalErrorParse(err);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  @action selectAddress = async (addressIndex: number) => {
    if (
      this.basketAddressSearch === undefined ||
      this.basketAddressSearch === null ||
      this.basketAddressSearch.length < addressIndex
    )
      return;

    let address = this.basketAddressSearch[addressIndex];

    this.address = {
      aliciAdi: address.firstname,
      aliciSoyadi: address.lastname,
      addressTitle: "--",
      adres: address.street,

      ilce: undefined,
      il: undefined,
      mahalle: undefined,
      telefon: this.searchPhone,
      ePosta: "",
      isCreateCustomer: false,
    };

    let locales = ["tr", "TR", "tr-TR", "tr-u-co-search", "tr-x-turkish"];
    let il = ApplicationGlobalService.cityes.find(
      (x) =>
        ApplicationGlobalService.turkishtoEnglish(x.name).toLocaleUpperCase(
          locales
        ) ===
        ApplicationGlobalService.turkishtoEnglish(
          address.region
        ).toLocaleUpperCase(locales)
    );

    if (il) {
      this.address.il = il;

      await ApplicationGlobalService.getDistrictByCity(il.id);

      let ilce = ApplicationGlobalService.districts.find(
        (x) =>
          ApplicationGlobalService.turkishtoEnglish(x.name).toLocaleUpperCase(
            locales
          ) ===
          ApplicationGlobalService.turkishtoEnglish(
            address.city
          ).toLocaleUpperCase(locales)
      );
      this.address.ilce = ilce;
      if (ilce) {
        await ApplicationGlobalService.getNeighborhoodByDistrictId(ilce.id);

        if (address.neighborhood_name) {
          let mahalle = ApplicationGlobalService.neighbourhoods.find(
            (x) =>
              ApplicationGlobalService.turkishtoEnglish(
                x.name
              ).toLocaleUpperCase(locales) ===
              ApplicationGlobalService.turkishtoEnglish(
                address.neighborhood_name
              ).toLocaleUpperCase(locales)
          );
          this.address.mahalle = mahalle;
        }
      }
    }
    if (this.isValidAddress()) Actions.popTo("isoBasket");
    else Actions.pop();
  };
  //#endregion

  //#region MessageBox
  @action unAuthorized = async () => {
    MessageBox.Show(
      translate("errorMsgs.sessionTimeout"),
      MessageBoxDetailType.Danger,
      MessageBoxType.Standart,
      () => {},
      () => {}
    );
    AccountService.logOut();
  };

  @action unexceptedError = async () => {
    MessageBox.Show(
      translate("errorMsgs.unexceptedError"),
      MessageBoxDetailType.Danger,
      MessageBoxType.Standart,
      () => {},
      () => {}
    );
  };
  //#endregion

  @action updateAdress = (
    il: any,
    ilce: any,
    mahalle: any,
    adres: string,
    isStore: boolean,
    deliveredStore: string
  ) => {
    this.address.adres = adres;
    this.address.il = il;
    this.address.ilce = ilce;
    this.address.mahalle = mahalle;
    this.isStoreAddress = isStore;
    this.deliveredStore = deliveredStore;
  };

  //#region Basket internal events
  private isInBasket = (barcode: string, isOmc: boolean): boolean => {
    if (this.isCurrentBasketExsist()) {
      let index = this.selectedBasket.basketItems.findIndex(
        (x) => x.barcode === barcode && x.isOmc === isOmc
      );
      return index !== -1;
    }

    return false;
  };

  private isCurrentBasketExsist = (): boolean => {
    return (
      this.selectedBasket !== undefined &&
      this.selectedBasket !== null &&
      this.selectedBasket.id !== 0
    );
  };

  @action findBasketItem = (
    barcode: string,
    isOmc: boolean
  ): BasketItem | undefined => {
    if (this.isCurrentBasketExsist() && this.isInBasket(barcode, isOmc))
      return this.selectedBasket.basketItems.find(
        (x) => x.barcode === barcode && x.isOmc === isOmc
      );

    return undefined;
  };
  //#endregion

  @action checkStock = async (basketId: number) => {
    try {
      let basketState = await axios.post<ServiceResponseBase<BasketStockModel>>(
        `${GetServiceUri(ServiceUrlType.BASKET_STOCK)}?basketId=${basketId}`,
        {},
        { headers: AccountService.tokenizeHeader() }
      );

      this.basketStockItems = [];

      if (basketState.data.state === FloResultCode.Successfully) {
        this.basketStockItems = basketState.data.model.items;
      } else {
        if (
          basketState.data.message === "be.errors.basketCheckout" ||
          basketState.data.message === "be.errors.cardBilled"
        ) {
          await this.getAllBaskets();
        }

        MessageBoxNew.show(
          basketState.data.message.startsWith("be.")
            ? i18n.t(basketState.data.message)
            : basketState.data.message
        );
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
    }
  };

  @action checkBasketEditableState = async (basketId: number) => {
    try {
      var result = await axios.get<ServiceResponseBase<boolean>>(
        `${GetServiceUri(
          ServiceUrlType.BASKET_BASE
        )}CheckBasketEditableState?basketId=${basketId}`,
        { headers: AccountService.tokenizeHeader() }
      );

      if (result.data.state === FloResultCode.Successfully) {
        return result.data.model;
      } else {
        this.basketCompleteTest(result);
        return false;
      }
    } catch (err: any) {
      FloDigitalErrorParse(err);
      return false;
    } finally {
    }
  };
}

//#region Properties

export type BasketStockModel = {
  result: boolean;
  items: BasketStockItem[];
  message: string;
  errorCode: string;
};

export type BasketStockItem = {
  sku: string;
  quantity: number;
  rowStatus: boolean;
  availableQty: number;
};

export type Basket = {
  storeId?: string;
  basketItems: BasketItem[];
  basketId: number;
  id: number;
  basketTitle?: string;
  employeeId: string;
  companyCode: string;
  basketStatusId: number;
  basketTicketId?: number;
  creatorName?: string;
  order: BasketOrder | undefined;
  basketItemResults?: {
    sku: string;
    lastQuantity: number;
    quantity: number;
    rowState: number;
  }[];
  isAddressComplate?: boolean;
};

export type BasketOrder = {
  adres: string;
  aliciAdi: string;
  aliciSoyadi: string;
  ePosta: string;
  il: string;
  ilce: string;
  telefon: string;
  deliveredStore: string;
};

export type BasketItem = {
  id: number;
  basketId: number;
  sku: string;
  barcode: string;
  quantity: number;
  price: number;
  isOmc: boolean;
  parentSKU: string;
  productImage: string;
  title: string;
  description: string;
  size?: string;
  color?: string;
  isDeleted: boolean;
};

export type SubscriptionModel = {
  newCustomer: boolean;
  storeId: number;
  phone: string;

  pos: number;
  createdById: number;
  message: string;
  isPersonel: true;
  agreementTypeId: number;
  token: string;
};

export type BasketAddress = {
  aliciAdi: string;
  aliciSoyadi: string;
  adres: string;
  ilce: any;
  il: any;
  mahalle: any;
  telefon: string;
  ePosta: string;
  addressTitle: string;
  isCreateCustomer: boolean;
};

export type EcomAddress = {
  firstname: string;
  lastname: string;
  country_id: string;
  region: string;
  street: string;
  address_type: string;
  is_billling: boolean;
  is_shippingn: boolean;
  city: string;
  neighborhood_name: string;
};
//#endregion
export default new BasketService();
