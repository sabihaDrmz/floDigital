import { translate } from "../helper/localization/locaizationMain";
import {
    FloResultCode,
    ServiceResponseBase,
} from "../core/models/ServiceResponseBase";
import { toOrganization } from "../core/Util";
import i18n from 'i18next';
import { AxiosResponse } from "axios";
import { turkishtoEnglish } from "../helper";
import { MessageBoxType } from "./model/MessageBoxOptions";
import { BasketStockItem } from "./model/BasketStockItem";
import { BasketAddress } from "./model/BasketAddress";
import { Basket } from "./model/Basket";
import { EcomAddress } from "./model/EcomAddress";
import { SubscriptionModel } from "./model/SubscriptionModel";
import { BasketItem } from "./model/BasketItem";
import { BasketStockModel } from "./model/BasketStockModel";
import { create } from "zustand";
import * as RootNavigation from "../core/RootNavigation"
import { useApplicationGlobalService } from "./ApplicationGlobalService";
import { useMessageBoxService } from "./MessageBoxService";
import { SystemApi, useAccountService } from "./AccountService";
import { useProductService } from "./ProductService";

interface BasketServiceModel {
    lastPhone: string;
    lastEmail: string;
    isLoading: boolean;
    isStoreAddress: boolean;
    deliveredStore: string;
    basketStockItems: BasketStockItem[];
    address: BasketAddress;
    selectedBasket: Basket;
    tempBasket: Basket;
    basketList: Basket[];
    incrementInterval: any;
    basketAddressSearch: EcomAddress[];
    searchPhone: string;
    addProduct: (isOmc: boolean) => Promise<void>;
    basketCompleteTest: (result: any) => Promise<void>;
    removeProduct: (lineNumber: any) => Promise<void>;
    updateBasketList: (basketId: any, lines: any) => Promise<void>;
    changeBasketTracker: (
        result: AxiosResponse<ServiceResponseBase<Basket[]>>
    ) => Promise<void>;
    updateProduct: (
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
    ) => any;
    removeBasket: (basketId: number) => any;
    completeBasket: () => any;
    isValidAddress: () => boolean;
    selectBasket: (basketId: number) => any;
    paymentBasket: () => any;
    getAllBaskets: (ignoreClear?: boolean) => any;
    clearBasket: () => any;
    sentKvkk: (onBackAction?: () => void) => any;
    validateKvkk: (validationCode: string, onBackAction?: () => void) => any;
    sentContract: () => any;
    validateContract: (validationCode: string) => any;
    updateAdress: (
        il: any,
        ilce: any,
        mahalle: any,
        adres: string,
        isStore: boolean,
        deliveredStore: string
    ) => void;
    findBasketItem: (barcode: string, isOmc: boolean) => any;
    checkStock: (basketId: number) => Promise<any>;
    checkBasketEditableState: (basketId: number) => any;
    checkAddress: (phone: string) => any;
    selectAddress: (addressIndex: number) => Promise<boolean>;
    updateAddressText: (str: string) => void;
    updateAddressAliciAdi: (aliciAdi: string) => void;
    updateAddressAliciSoyadi: (aliciSoyadi: string) => void;
    updateAddressEmail: (email: string) => void;
    updateAddressIsCreateCustomer: (isCreateCustomer: boolean) => void;
    updateAddressTelefon: (telefon: string) => void;
    isInBasket: (barcode: string, isOmc: boolean) => boolean;
    isCurrentBasketExsist: () => boolean;
    isoCheckControl: (arg: any) => Promise<any>;
    isoOrderExchange: (arg: any) => Promise<any>;
    isoLoading: boolean;
}
export const useBasketService = create<BasketServiceModel>((set, get) => ({
    lastPhone: "",
    lastEmail: "",
    isLoading: false,
    isStoreAddress: false,
    deliveredStore: "",
    basketStockItems: [],
    address: {
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
    },
    selectedBasket: {
        basketItems: [],
        basketId: 0,
        basketTitle: "",
        basketStatusId: 0,
        companyCode: "",
        employeeId: "",
        id: 0,
        order: undefined,
    },
    tempBasket: {
        basketItems: [],
        basketId: 0,
        basketTitle: "",
        basketStatusId: 0,
        companyCode: "",
        employeeId: "",
        id: 0,
        order: undefined,
    },
    basketList: [],
    incrementInterval: null,
    basketAddressSearch: [],
    searchPhone: "",
    isoLoading: false,
    addProduct: async (isOmc: boolean) => {
        // Crashlytics().log('Sepete ürün atıldı');
        const { selectedBasket, isLoading, isInBasket, isCurrentBasketExsist, findBasketItem, updateProduct, changeBasketTracker } = get();
        const MessageBoxService = useMessageBoxService.getState();
        const AccountService = useAccountService.getState();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const ProductService = useProductService.getState();
        try {
            if (selectedBasket === null || selectedBasket === undefined) {
                set((state) => ({
                    ...state,
                    selectedBasket: {
                        basketItems: [],
                        basketId: 0,
                        basketTitle: "",
                        basketStatusId: 0,
                        companyCode: "",
                        employeeId: "",
                        id: 0,
                        order: undefined,
                    }
                }));
            }
            if (isLoading) return;

            set((state) => ({
                ...state,
                isLoading: true
            }));

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

            if (price === 0) {
                MessageBoxService.show(translate("basketPriceZeroError"));
                return;
            }

            const isExist = isInBasket(barcode, isOmc);

            // ? Sepette adet güncelleme
            if (isExist && isCurrentBasketExsist()) {
                let basketItem = findBasketItem(barcode, isOmc);

                // Sepetteki ürün var ise adeti bir arttır ve güncelle
                if (basketItem !== undefined) {
                    RootNavigation.navigate('Iso', { screen: 'Basket' })
                    updateProduct(barcode, isOmc, basketItem.quantity + 1, true);
                }
            }
            // ? Sepete yeni ürün olarak ekle
            else {
                const storeId = AccountService.getUserStoreId();
                var store = ApplicationGlobalService.allStore.find((x) => x.werks === storeId);

                let model = {
                    id: isCurrentBasketExsist() ? selectedBasket.id : 0,
                    storeId: storeId,
                    employeeId: AccountService.employeeInfo.EfficiencyRecord,
                    companyCode: toOrganization(
                        AccountService.employeeInfo.ExpenseLocationCode,
                        store
                    ),
                    basketStatusId: isCurrentBasketExsist()
                        ? selectedBasket.basketStatusId
                        : 0,
                    item: {
                        basketId: selectedBasket.id,
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
                let result = await SystemApi.post<ServiceResponseBase<Basket[]>>(
                    "basket/AddBasket",
                    model
                );

                changeBasketTracker(result);

                if (result.data && result.data.state === FloResultCode.Successfully) {
                    RootNavigation.navigate('Iso', { screen: 'Basket' })
                }
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    basketCompleteTest: async (result: any) => {
        const { getAllBaskets } = get();
        const MessageBoxService = useMessageBoxService.getState();
        if (
            result.data.message === "be.errors.basketCheckout" ||
            result.data.message === "be.errors.cardBilled"
        ) {
            await getAllBaskets();
            RootNavigation.goBack()
        }

        MessageBoxService.show(
            result.data.message.startsWith("be.")
                ? i18n.t(result.data.message)
                : result.data.message
        );
    },
    removeProduct: async (lineNumber: number) => {
        try {
            const { isCurrentBasketExsist, selectedBasket, changeBasketTracker } = get();
            set((state) => ({
                ...state,
                isLoading: true
            }));

            if (isCurrentBasketExsist()) {
                let check = selectedBasket.basketItems.findIndex(
                    (x) => x.id === lineNumber
                );

                if (check !== -1) {
                    let result = await SystemApi.post<ServiceResponseBase<Basket[]>>(
                        "basket/DeleteBasketItem?id=" + lineNumber
                    );

                    // Sepetin takibini değiştir
                    changeBasketTracker(result);
                }
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    updateBasketList: async (basketId: any, lines: any) => {
        const { basketList } = get();
        const index = basketList.findIndex((x) => x.id === basketId);

        if (index >= 0) {
            set((state) => ({
                ...state,
                basketList: {
                    ...state.basketList,
                    [index]: {
                        ...state.basketList[index],
                        basketItems: lines
                    }
                },
            }));
        }
    },
    changeBasketTracker: async (
        result: AxiosResponse<ServiceResponseBase<Basket[]>>
    ) => {
        const { getAllBaskets, clearBasket, selectedBasket, updateBasketList, basketCompleteTest } = get();
        const MessageBoxService = useMessageBoxService.getState();

        if (
            result.data.model !== undefined &&
            result.data.model !== null &&
            result.data.model.length === 0
        ) {
            RootNavigation.goBack()
            await getAllBaskets();
            await clearBasket();
            return;
        }

        if (
            selectedBasket.isAddressComplate &&
            result.data.model.length > 0 &&
            !result.data.model[0].isAddressComplate
        ) {
            if (
                result.data.model !== undefined &&
                result.data.model !== null &&
                result.data.model.length > 0
            ) {
                set((state) => ({
                    ...state,
                    selectedBasket: result.data.model[0]
                }));
                updateBasketList(selectedBasket.id, result.data.model[0].basketItems);
            }
            MessageBoxService.show(
                i18n.t("isoBasket.showMssMessage"),
                result.data.state !== FloResultCode.Successfully
                    ? {
                        onHide: () => {
                            // updateBasketList(selectedBasket.id, result.model[0]);
                            basketCompleteTest(result);
                        },
                    }
                    : undefined
            );
            return;
        } else if (result.data.state !== FloResultCode.Successfully) {
            basketCompleteTest(result);
        }

        if (
            result.data.model !== undefined &&
            result.data.model !== null &&
            result.data.model.length > 0
        ) {
            set((state) => ({
                ...state,
                selectedBasket: result.data.model[0]
            }));
            updateBasketList(selectedBasket.id, result.data.model[0].basketItems);
        }
    },
    updateProduct: async (
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
        const { isLoading, findBasketItem, incrementInterval, selectedBasket, changeBasketTracker, tempBasket } = get();
        if (quantity <= 0 || quantity > 20) return;
        try {
            if (!forceLoading && isLoading) return;
            set((state) => ({
                ...state,
                isLoading: true
            }));
            let basketItem = findBasketItem(barcode, isOmc);

            if (basketItem !== undefined) {
                basketItem.quantity = quantity;

                if (newOmcState !== undefined) basketItem.isOmc = newOmcState;
                //NOTE: eğer satır id yoksa hata mesajı göster

                if (basketItem.id === 0) return;

                if (!incrementInterval)
                    set((state) => ({
                        ...state,
                        tempBasket: selectedBasket
                    }));

                if (incrementInterval) clearTimeout(incrementInterval);

                const itv = setTimeout(async () => {
                    try {
                        set((state) => ({
                            ...state,
                            isLoading: true
                        }));
                        //NOTE: Sepet Güncelleme
                        const result = await SystemApi.post<ServiceResponseBase<Basket[]>>(
                            "basket/UpdateById",
                            basketItem
                        );
                        changeBasketTracker(result);
                    } catch (err) {
                    } finally {
                        set((state) => ({
                            ...state,
                            isLoading: false
                        }));
                    }
                }, 500);

                set((state) => ({
                    ...state,
                    incrementInterval: itv
                }));
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                selectedBasket: tempBasket
            }));
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    removeBasket: async (basketId: number) => {
        try {
            const { selectedBasket, clearBasket, basketList, basketCompleteTest } = get();
            set((state) => ({
                ...state,
                isLoading: true
            }));

            let result = await SystemApi.post<ServiceResponseBase<Basket[]>>(
                `basket/DeleteBasket?id=${basketId}`
            );

            if (result.data.state === FloResultCode.Successfully) {
                if (
                    selectedBasket !== undefined &&
                    selectedBasket !== null &&
                    (selectedBasket.id === basketId ||
                        selectedBasket.basketId === basketId)
                )
                    clearBasket();
                set((state) => ({
                    ...state,
                    basketList: basketList.filter((x) => x.id !== basketId)
                }));
            } else {
                basketCompleteTest(result);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    completeBasket: async () => {
        try {
            const { selectedBasket, clearBasket, basketCompleteTest } = get();
            const MessageBoxService = useMessageBoxService.getState();

            set((state) => ({
                ...state,
                isLoading: true
            }));

            let result = await SystemApi.post<ServiceResponseBase<Basket>>(
                "basket/SetBasketStatus",
                {
                    id: selectedBasket.id,
                    basketID: selectedBasket.id,
                    basketStatusID: 2,
                    statusInfo: "Complete",
                }
            );

            if (result.data.state === FloResultCode.Successfully) {
                if (
                    result.data.model.basketItemResults &&
                    result.data.model.basketItemResults.length > 0
                ) {
                    // ! Stoklarda değişiklik oldu sepetteki ürünler güncellendi bilgisi gösterilecek
                    set((state) => ({
                        ...state,
                        selectedBasket: result.data.model
                    }));
                    MessageBoxService.show(
                        result.data.message.startsWith("be.")
                            ? i18n.t(result.data.message)
                            : result.data.message
                    );
                } else {
                    /*
                     * Sepet başarıyla oluştu sepet numarasını kullanıcıya göster
                     * Tamam tuşuna basıldığında sepet temizlenir ve ürün sorgulama ekranına gönderilir.
                     */
                    if (result.data.model.basketTicketId) {
                        MessageBoxService.show(
                            JSON.stringify({
                                basketTicketId: result.data.model.basketTicketId,
                                isShowMessage:
                                    selectedBasket.basketItems.filter((x) => !x.isOmc).length > 0,
                            }),
                            {
                                type: MessageBoxType.BasketNumber,
                                onHide: () => {
                                    clearBasket();
                                    RootNavigation.navigate('Main', { screen: 'Search' })
                                },
                            }
                        );
                    }
                }
            } else {
                basketCompleteTest(result);
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                basketList: []
            }));
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    isValidAddress: () => {
        const { isStoreAddress, address } = get();
        // // Yeni müşteri oluşturulacak ve eposta adresi yok ise
        // if (
        //   address.isCreateCustomer &&
        //   (address.ePosta === undefined ||
        //     address.ePosta === null ||
        //     address.ePosta.length < 5 ||
        //     !address.ePosta.includes("@"))
        // ) {
        //   // Hata mesajını göster
        //   MessageBox.show(
        //     translate("errorMsgs.emailRequiredNewCustomer", {
        //       type: MessageBoxType.Standart,
        //     })
        //   );
        //   return false;
        // }

        if (
            !isStoreAddress &&
            (address.mahalle === undefined || address.mahalle === null)
        )
            return false;
        // if (
        //     address.isCreateCustomer == true &&
        //     (address.ePosta?.trim().length === 0 || address.ePosta?.trim().length === null || address.ePosta?.trim().length === undefined)
        // )
        //     return false;

        // Adres bilgilerinde eksiklik var mı ?
        if (
            address.aliciAdi?.trim().length > 0 &&
            address.aliciSoyadi?.trim().length > 0 &&
            address.adres?.trim().length > 10 &&
            address.ilce &&
            address.il &&
            address.telefon?.length > 0 &&
            address.telefon?.length === "9 ( 999 ) 999 99 99".length
        )
            return true;

        return false;
    },
    selectBasket: async (basketId: number) => {
        try {
            const { checkStock, basketList, address } = get();
            const ApplicationGlobalService = useApplicationGlobalService.getState();
            set((state) => ({
                ...state,
                isLoading: true
            }));

            await checkStock(basketId);
            let currentBasket = basketList.find((x) => x.id === basketId);
            if (currentBasket?.order) {
                // Şehir listesi henüz çekilmedi ise şehir listesini yeniden iste
                if (!ApplicationGlobalService.cities || ApplicationGlobalService.cities.length === 0)
                    await ApplicationGlobalService.getAllCities();

                // Bu sepete daha önceden adres girilmiş mi ?
                if (currentBasket.order) {
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

                    set((state) => ({
                        ...state,
                        lastEmail: address?.ePosta,
                        lastPhone: address?.telefon
                    }));

                    if (currentBasket.order.il) {
                        customerAddress.il = ApplicationGlobalService.cities.find(
                            (x) =>
                                turkishtoEnglish(x.name).toUpperCase() ===
                                turkishtoEnglish(
                                    //@ts-ignore
                                    currentBasket.order.il
                                ).toUpperCase()
                        );

                        const districts = (await ApplicationGlobalService.getDistrictByCity(
                            //@ts-ignore
                            customerAddress.il?.id
                        )) as any[];

                        customerAddress.ilce = districts.find(
                            (x) =>
                                turkishtoEnglish(x.name).toUpperCase() ===
                                turkishtoEnglish(
                                    //@ts-ignore
                                    currentBasket?.order?.ilce
                                ).toUpperCase()
                        );

                        if (customerAddress.ilce) {
                            let neighborhoods =
                                await ApplicationGlobalService.getNeighborhoodByDistrictId(
                                    //@ts-ignore
                                    customerAddress?.ilce?.id
                                );
                            customerAddress.mahalle = neighborhoods.find(
                                (x: any) =>
                                    turkishtoEnglish(x.name).toUpperCase() ===
                                    turkishtoEnglish(
                                        //@ts-ignore
                                        currentBasket?.order?.mahalle
                                    ).toLocaleUpperCase()
                            );
                        }
                    }
                    set((state) => ({
                        ...state,
                        address: customerAddress,
                        deliveredStore: currentBasket?.order?.deliveredStore
                    }));
                }
                set((state) => ({
                    ...state,
                    selectedBasket: currentBasket,
                }));
                RootNavigation.navigate('Iso', { screen: 'Basket' })
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    paymentBasket: async () => {
        const { selectedBasket, address, deliveredStore, getAllBaskets, clearBasket, basketCompleteTest } = get();
        const MessageBoxService = useMessageBoxService.getState();
        const AccountService = useAccountService.getState();
        set((state) => ({
            ...state,
            isLoading: true,
        }));
        // Analyrics().logEvent("basket_event", {
        //   type: "payment_confirm",
        //   basketId: selectedBasket?.id,
        // });
        let model = {
            sepetId: selectedBasket?.id.toString(),
            dukkanId: Number(AccountService.getUserStoreId()),
            aliciAdi: address.aliciAdi,
            aliciSoyadi: address.aliciSoyadi,
            adres: address.adres,
            ilce: address.ilce?.name,
            il: address.il?.name,
            mahalle: address.mahalle?.name,
            telefon: address.telefon,
            ePosta: address.ePosta,
            isCreateCustomer: address.isCreateCustomer,
            newCustomer: address.isCreateCustomer,
            id: 0,
            musteriId: 0,
            platformId: 0,
            platform: "string",
            status: "string",
            message: "string",
            error: "string",
            orderId: "string",
            kampanyaKodu: "string",
            deliveredStore: deliveredStore ?? "",
        };

        try {
            let result = await SystemApi.post("Order/Create", model);

            if (result.status === 200 && result.data.state === 1) {
                MessageBoxService.show(translate("errorMsgs.sentToGenius"), {
                    onHide: () => {
                        getAllBaskets();
                        RootNavigation.navigate('Main', { screen: 'Search' })
                        clearBasket();
                    },
                });
            } else {
                basketCompleteTest(result);
            }
        } catch (err: any) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false,
            }));
        }
    },
    // Tüm sepetleri sunucudan getir.
    getAllBaskets: async (ignoreClear?: boolean) => {
        const { clearBasket } = get();
        const AccountService = useAccountService.getState();
        try {
            set((state) => ({
                ...state,
                isLoading: true,
            }));

            let response = await SystemApi.post<ServiceResponseBase<Basket[]>>(
                "basket/GetBasket?storeId=" + AccountService.getUserStoreId()
            );

            if (response.data.state === FloResultCode.Successfully) {
                if (ignoreClear !== true) await clearBasket();
                set((state) => ({
                    ...state,
                    basketList: response.data.model,
                }));
            } else {
                set((state) => ({
                    ...state,
                    basketList: []
                }));
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                basketList: []
            }));
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    // Seçili sepeti ve adres bilgilerini temizle
    clearBasket: async () => {
        set((state) => ({
            ...state,
            selectedBasket: {
                basketItems: [],
                basketId: 0,
                basketTitle: "",
                basketStatusId: 0,
                companyCode: "",
                employeeId: "",
                id: 0,
                order: undefined,
            },
            address: {
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
            }
        }));
    },

    sentKvkk: async (onBackAction?: () => void) => {
        const { address, validateKvkk, sentKvkk } = get();
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();

        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));
            let model: SubscriptionModel = {
                phone: address?.telefon,
                storeId: Number(AccountService.getUserStoreId()),
                newCustomer: address?.isCreateCustomer,
                pos: 0,
                createdById: 0,
                message: "string",
                isPersonel: true,
                agreementTypeId: 1,
                token: "string",
            };

            let result = await SystemApi.post("Kvkk/GetKvkkSmsCode", model);

            if (result.status === 200 && result.data.state === 200) {
                if (result.data.model?.model?.permission) {
                    if (onBackAction) {
                        onBackAction();
                    }
                    RootNavigation.navigate('Iso', { screen: 'Basket' })
                    // return;
                } else {
                    MessageBoxService.show("", {
                        type: MessageBoxType.SmsValidation,
                        onValidate: (validationCode: string) => {
                            validateKvkk(validationCode, onBackAction);
                        },
                        reSendSms: () => {
                            sentKvkk(onBackAction);
                        },
                    });
                }
            } else MessageBoxService.show(translate("errorMsgs.unexceptedError"));
        } catch (err: any) {
            set((state) => ({
                ...state,
                basketList: []
            }));
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    validateKvkk: async (validationCode: string, onBackAction?: () => void) => {
        const { address, validateKvkk, sentKvkk } = get();
        const MessageBoxService = useMessageBoxService.getState();

        try {
            let model = {
                phone: address?.telefon,
                email: address?.ePosta,
                code: validationCode,
                isPersonel: false,
                transactionValue: address?.telefon,
                agreementTypeId: 1,
                token: "",
            };

            set((state) => ({
                ...state,
                lastEmail: address?.ePosta,
                lastPhone: address?.telefon
            }));

            let result = await SystemApi.post("Kvkk/GetApproveSmsCode", model);

            if (
                result.status === 200 &&
                result.data.state === 200 &&
                result.data.model.state === 1
            ) {
                MessageBoxService.hide();
                if (MessageBoxService.options?.onHide) MessageBoxService.options.onHide();
                RootNavigation.navigate('Iso', { screen: 'Basket' })
            } else {
                MessageBoxService.show(translate("messageBox.verificationNotValid"), {
                    type: MessageBoxType.SmsValidation,
                    onValidate: (validationCode: string) => {
                        validateKvkk(validationCode, onBackAction);
                    },
                    reSendSms: () => {
                        sentKvkk(onBackAction);
                    },
                });
            }
        } catch (err) {
            MessageBoxService.show(translate("messageBox.verificationNotValid"), {
                type: MessageBoxType.SmsValidation,
                onValidate: (validationCode: string) => {
                    validateKvkk(validationCode, onBackAction);
                },
                reSendSms: () => {
                    sentKvkk(onBackAction);
                },
            });
        } finally {
        }
    },
    sentContract: async () => {
        const { isLoading, selectedBasket, paymentBasket, address, validateContract, sentContract, getAllBaskets, basketList } = get();
        const MessageBoxService = useMessageBoxService.getState();

        try {
            if (isLoading) return;

            set((state) => ({
                ...state,
                isLoading: true
            }));

            var checkOmcsProduct = selectedBasket?.basketItems.filter((x) => x.isOmc);

            if (!checkOmcsProduct || checkOmcsProduct?.length === 0) {
                await paymentBasket();
                return;
            }

            let model = {
                aliciAdi: address.aliciAdi,
                aliciSoyadi: address.aliciSoyadi,
                adres: address.adres,
                il: address.il?.name,
                ilce: address.ilce?.name,
                mahalle: address.mahalle?.name,
                telefon: address.telefon,
                ePosta: address.ePosta,
            };

            let contractRes = await SystemApi.post<ServiceResponseBase<any>>(
                "Agreement/SendMss?basketId=" + selectedBasket?.id,
                model
            );
            if (
                contractRes.status === 200 &&
                contractRes.data.state === 1 &&
                contractRes.data.isValid
            ) {
                MessageBoxService.show("", {
                    type: MessageBoxType.SmsValidation,
                    onValidate(validationCode) {
                        validateContract(validationCode);
                    },
                    reSendSms() {
                        sentContract();
                    },
                });
            } else {
                const basketIdTemp = selectedBasket.id;
                await getAllBaskets(true);

                let currentBasket = basketList.find((x) => x.id === basketIdTemp);
                if (currentBasket)
                    set((state) => ({
                        ...state,
                        selectedBasket: currentBasket
                    }));

                MessageBoxService.show(
                    contractRes.data.message.startsWith("be.")
                        ? i18n.t(contractRes.data.message)
                        : contractRes.data.message
                );
                await getAllBaskets();
                RootNavigation.goBack()
            }
        } catch (err: any) {
            await getAllBaskets();
            RootNavigation.goBack()
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    validateContract: async (validationCode: string) => {
        try {
            const { selectedBasket, paymentBasket, validateContract } = get();
            const MessageBoxService = useMessageBoxService.getState();

            let validateResult = await SystemApi.post(
                `Agreement/ApproveBasket?basketId=${selectedBasket?.id}&approveCode=${validationCode}`
            );

            if (validateResult.status === 200 && validateResult.data.model) {
                paymentBasket();
            } else {
                MessageBoxService.show(translate("messageBox.verificationNotValid"), {
                    type: MessageBoxType.SmsValidation,
                    onValidate(validationCode) {
                        validateContract(validationCode);
                    },
                });
            }
        } catch (err: any) {
        } finally {
        }
    },
    updateAdress: (
        il: any,
        ilce: any,
        mahalle: any,
        adres: string,
        isStore: boolean,
        deliveredStore: string
    ) => {
        const { address } = get();
        set((state) => ({
            ...state,
            isStoreAddress: isStore,
            deliveredStore: deliveredStore,
            address: {
                ...address,
                adres: adres,
                il: il,
                ilce: ilce,
                mahalle: mahalle,
            }
        }));
    },
    updateAddressText: (addr: string) => {
        const { address } = get();
        set((state) => ({
            ...state,
            address: { ...address, adres: addr }
        }));
    },
    updateAddressAliciAdi: (aliciAdi: string) => {
        const { address } = get();
        set((state) => ({
            ...state,
            address: { ...address, aliciAdi: aliciAdi }
        }));
    },
    updateAddressAliciSoyadi: (aliciSoyadi: string) => {
        const { address } = get();
        set((state) => ({
            ...state,
            address: { ...address, aliciSoyadi: aliciSoyadi }
        }));
    },
    updateAddressEmail: (email: string) => {
        const { address } = get();
        set((state) => ({
            ...state,
            address: { ...address, ePosta: email }
        }));
    },
    updateAddressIsCreateCustomer: (isCreateCustomer: boolean) => {
        const { address } = get();
        set((state) => ({
            ...state,
            address: { ...address, isCreateCustomer: isCreateCustomer }
        }));
    },
    updateAddressTelefon: (telefon: string) => {
        const { address } = get();
        set((state) => ({
            ...state,
            address: { ...address, telefon: telefon }
        }));

    },
    isInBasket: (barcode: string, isOmc: boolean): boolean => {
        const { isCurrentBasketExsist, selectedBasket } = get();
        if (isCurrentBasketExsist()) {
            let index = selectedBasket.basketItems.findIndex(
                (x) => x.barcode === barcode && x.isOmc === isOmc
            );
            return index !== -1;
        }

        return false;
    },
    isCurrentBasketExsist: (): boolean => {
        const { selectedBasket } = get();
        return (
            selectedBasket !== undefined &&
            selectedBasket !== null &&
            selectedBasket.id !== 0
        );
    },
    findBasketItem: (
        barcode: string,
        isOmc: boolean
    ): BasketItem | undefined => {
        const { selectedBasket, isInBasket, isCurrentBasketExsist } = get();
        if (isCurrentBasketExsist() && isInBasket(barcode, isOmc))
            return selectedBasket.basketItems.find(
                (x) => x.barcode === barcode && x.isOmc === isOmc
            );

        return undefined;
    },
    //#endregion
    checkStock: async (basketId: number) => {
        const MessageBoxService = useMessageBoxService.getState();
        try {
            const { getAllBaskets } = get();
            let basketState = await SystemApi.post<
                ServiceResponseBase<BasketStockModel>
            >(`basket/CheckStockBasketItems?basketId=${basketId}`);

            set((state) => ({
                ...state,
                basketStockItems: []
            }));

            if (basketState.data.state === FloResultCode.Successfully) {
                set((state) => ({
                    ...state,
                    basketStockItems: basketState.data.model.items
                }));
            } else {
                if (
                    basketState.data.message === "be.errors.basketCheckout" ||
                    basketState.data.message === "be.errors.cardBilled"
                ) {
                    await getAllBaskets();
                }

                MessageBoxService.show(
                    basketState.data.message.startsWith("be.")
                        ? i18n.t(basketState.data.message)
                        : basketState.data.message
                );
            }
        } catch (err: any) { }
    },
    checkBasketEditableState: async (basketId: number) => {
        try {
            const { basketCompleteTest } = get();
            const result = await SystemApi.get<ServiceResponseBase<boolean>>(
                `basket/CheckBasketEditableState?basketId=${basketId}`
            );

            if (result.data.state === FloResultCode.Successfully) {
                return result.data.model;
            } else {
                basketCompleteTest(result);
                return false;
            }
        } catch (err: any) {
            return false;
        } finally {
        }
    },
    checkAddress: async (phone: string) => {
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));
            if (phone && phone.length > 0) {
                let result = await SystemApi.get<ServiceResponseBase<EcomAddress[]>>(
                    "Adress?phone=" + phone
                );

                if (result.data.state === FloResultCode.Successfully) {
                    set((state) => ({
                        ...state,
                        searchPhone: phone,
                        basketAddressSearch: result.data.model
                    }));
                    RootNavigation.navigate('Iso', { screen: 'AddressList' })
                }
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                basketList: []
            }));
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    selectAddress: async (addressIndex: number) => {
        const { basketAddressSearch, searchPhone, isStoreAddress } = get();
        const ApplicationGlobalService = useApplicationGlobalService.getState();
        const MessageBoxService = useMessageBoxService.getState();

        if (
            basketAddressSearch === undefined ||
            basketAddressSearch === null ||
            basketAddressSearch.length < addressIndex
        )
            return false;

        let selectedAddress = basketAddressSearch[addressIndex];

        const model = {
            aliciAdi: selectedAddress.firstname,
            aliciSoyadi: selectedAddress.lastname,
            addressTitle: "--",
            adres: selectedAddress.street,

            ilce: undefined,
            il: undefined,
            mahalle: undefined,
            telefon: searchPhone,
            ePosta: "",
            isCreateCustomer: false,
        };

        let il = ApplicationGlobalService.cities.find(
            (x) =>
                turkishtoEnglish(x.name).toUpperCase() ===
                turkishtoEnglish(selectedAddress.region).toUpperCase()
        );

        if (il) {
            let ilceler = await ApplicationGlobalService.getDistrictByCity(il.id);

            let ilce = ilceler.find(
                (x: any) =>
                    turkishtoEnglish(x.name).toUpperCase() ===
                    turkishtoEnglish(selectedAddress.city).toUpperCase()
            );

            if (ilce) {
                model.ilce = ilce;
                model.il = il;

                let neighborhoods = await ApplicationGlobalService.getNeighborhoodByDistrictId(
                    ilce.id
                );

                if (selectedAddress.neighborhood_name) {
                    model.mahalle = neighborhoods.find(
                        (x: any) =>
                            turkishtoEnglish(x.name).toUpperCase() ===
                            turkishtoEnglish(selectedAddress.neighborhood_name).toUpperCase()
                    );
                }
                set((state) => ({
                    ...state,
                    address: model
                }));

                // Yeni müşteri oluşturulacak ve eposta adresi yok ise
                if (
                    model.isCreateCustomer &&
                    (model.ePosta === undefined ||
                        model.ePosta === null ||
                        model.ePosta.length < 5 ||
                        !model.ePosta.includes("@"))
                ) {
                    // Hata mesajını göster
                    MessageBoxService.show(
                        translate("errorMsgs.emailRequiredNewCustomer", {
                            type: MessageBoxType.Standart,
                        })
                    );
                    return false;
                }

                if (
                    !isStoreAddress &&
                    (model.mahalle === undefined || model.mahalle === null)
                )
                    return false;

                // Adres bilgilerinde eksiklik var mı ?
                if (
                    model.aliciAdi?.trim().length > 0 &&
                    model.aliciSoyadi?.trim().length > 0 &&
                    model.adres?.trim().length > 10 &&
                    model.ilce &&
                    model.il &&
                    model.telefon?.length > 0 &&
                    model.telefon?.length === "9 ( 999 ) 999 99 99".length
                )
                    return true;

                return false;
            } else {
                MessageBoxService.show("Adres Seçilemedi");
                return false;
            }
        }
        return false;
    },
    isoCheckControl: async (arg: any) => {
        set((state) => ({
            ...state,
            isoLoading: true
        }))
        const MessageBoxService = useMessageBoxService.getState();
        let result = await SystemApi.post(
            "IsoOrderExchange/CheckControl",
            arg
        );
        try {
            set((state) => ({
                ...state,
                isoLoading: false
            }))
            if (result.data.state === FloResultCode.Successfully) {
                return result.data
            } else {
                MessageBoxService.show(result.data.message);
                return null
            }
        } catch (err: any) {
            set((state) => ({
                ...state,
                isoLoading: false
            }))
            return null;
        }
    },
    isoOrderExchange: async (arg: any) => {
        const MessageBoxService = useMessageBoxService.getState();
        let result = await SystemApi.post(
            "IsoOrderExchange/OrderExchange",
            arg
        );
        try {
            if (result.data.state === FloResultCode.Successfully) {
                MessageBoxService.show(
                    JSON.stringify({
                        basketTicketId: result.data.model.orderId,
                        message: result.data.message
                    }),
                    {
                        type: MessageBoxType.IsoReturnCode,
                    }
                );
                RootNavigation.navigate('Iso', { screen: 'BasketList' })
                return result.data
            } else {
                //  MessageBoxService.show(result.data.message);
                return result.data
            }
        } catch (err: any) {
            return null;
        }
    }
}));
