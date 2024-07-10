import { translate } from "../helper/localization/locaizationMain";
//TODO:EXPO MediaLibrary
// import * as MediaLibrary from "expo-media-library";
import { CRMCaseModel } from "../../src/core/models/CrmCaseModel";
import { GeniusFicheModel } from "./model/GeniusFicheModel";
import { create } from "zustand";
import { CrmApi, SystemApi, useAccountService } from "./AccountService";
import { useMessageBoxService } from "./MessageBoxService";
import * as RootNavigation from "../../src/core/RootNavigation"

interface CrmServiceModel {
    showNetworkError: boolean;
    isLoading: boolean;
    cases: CRMCaseModel[];
    crmAccountInfo: any;
    crmTeams: any[];
    reset: boolean;
    selectedCase: CRMCaseModel | undefined;
    complaints: any;
    crmOrders: any;
    currentFicheList: GeniusFicheModel[];
    setsateCustomerComplaint: (model: any) => Promise<void>;
    updateCustomerComplaintDetail: (model: any) => Promise<void>;
    getCustomerComplaintDetail: (model: any) => Promise<void>;
    getCustomerComplaintList: (model: any) => Promise<void>;
    crmGetOrders: (model: any) => Promise<void>;
    updateCase: (model: any) => Promise<void>;
    CrmGetTeams: () => Promise<any>;
    GetCases: (model: any, itemSize: number) => Promise<void>;
    CrmLogin: () => Promise<any>;
    SetSelectedCaseModel: (data: CRMCaseModel) => void;
    ErFindFiche: (filter: {
        orderId?: string;
        activeStore?: string;
        gsm?: string;
        paymentType?: string;
        receiptNumber?: string;
        shippingStore?: string;
        shippingDate?: string;
        barcode?: string;
        endDate?: string;
        isDateRequired?: boolean;
    }) => Promise<void>;
    getAttachmentById: (data: string) => Promise<any>;
    DataURIToBlob: (base64: string) => any;
    removePhoneMask: (phone: string) => string;
}

export const useCrmService = create<CrmServiceModel>((set, get) => ({
    showNetworkError: false,
    isLoading: false,
    cases: [],
    crmAccountInfo: null,
    crmTeams: [],
    reset: false,
    complaints: [],
    selectedCase: undefined,
    crmOrders: undefined,
    currentFicheList: [],
    CrmLogin: async () => {
        const AccountService = useAccountService.getState();
        let model = {
            employeeId: AccountService.employeeInfo.EfficiencyRecord,
            deviceId: "",
        };

        let accInfo = await CrmApi.post("CrmLogin", model);
        if (accInfo.data?.model) {
            set((state) => ({
                ...state,
                crmAccountInfo: accInfo.data.model,
            }));
            return accInfo.data.model;
        }
        return;
    },
    GetCases: async (page: number, itemSize: number = 20) => {
        const { crmAccountInfo, CrmLogin, crmTeams, CrmGetTeams, cases } = get();
        set((state) => ({
            ...state,
            isLoading: true
        }));
        var crmLogin;

        var model = {
            teamId: crmAccountInfo?.teamId,
            pageNumber: page,
            pageSize: itemSize,
        };
        if (!crmAccountInfo) {
            crmLogin = await CrmLogin();
            if (!crmLogin) {
                set((state) => ({
                    ...state,
                    isLoading: false
                }));
                return;
            }
            model.teamId = crmLogin.teamId;
        }
        if (crmTeams.length === 0) {
            var getCrmTeam = await CrmGetTeams();

            if (!getCrmTeam) {
                set((state) => ({
                    ...state,
                    isLoading: false
                }));
                return;
            }
        }

        const res = await CrmApi.post("CrmCase", model);

        if (res?.status && res.data.apiResultState === 0) {
            set((state) => ({
                ...state,
                cases: page === 1 ? res.data.model : [...cases, ...res.data.model],
                reset: page === 1
            }));
        }
        set((state) => ({
            ...state,
            isLoading: false,
        }));
    },
    CrmGetTeams: async () => {
        var res = await CrmApi.get("CrmTeam");

        if (res.status) {
            if (res.data.apiResultState === 0) {
                set((state) => ({
                    ...state,
                    crmTeams: res.data.model
                }));
                return res.data.model;
            } else {
                return;
            }
        } else {
            return;
        }
    },
    DataURIToBlob: (base64: string) => {
        const splitDataURI = base64.split(",");
        const byteString =
            splitDataURI[0].indexOf("base64") >= 0
                ? atob(splitDataURI[1])
                : decodeURI(splitDataURI[1]);
        const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i);

        return new Blob([ia], { type: mimeString });
    },
    updateCase: async (model: any) => {
        const { crmAccountInfo, DataURIToBlob, GetCases } = get();
        const MessageBoxService = useMessageBoxService.getState();
        set((state) => ({
            ...state,
            isLoading: true
        }));
        try {
            let url = `CrmCase/${crmAccountInfo.portalUserId}`;
            let formData = new FormData();

            for (var i = 0; i < model.pickImages.length; i++) {
                if (model.pickImages[i].Url.includes("base64,")) {
                    formData.append("pickImages", DataURIToBlob(model.pickImages[i].Url));
                } else {
                    let localUri = model.pickImages[i].Url;
                    // telefondaki sabit dosyalardan seçili ise
                    if (model.pickImages[i].Url.startsWith("ph://")) {
                       /* var ml = await MediaLibrary.getAssetInfoAsync(
                            model.pickImages[i].Url.slice(5)
                        );
                        if (ml.localUri === undefined) continue;
                        localUri = ml.localUri;

                        */
                    }

                    let filename = localUri.split("/").pop();

                    if (filename === undefined) continue;

                    // Infer the type of the image
                    let match = /\.(\w+)$/.exec(filename);
                    let type = match ? `image/${match[1]}` : `image`;
                    //@ts-ignore
                    formData.append("pickImages", {
                        //@ts-ignore
                        uri: localUri,
                        name: filename,
                        type,
                    });
                }
            }

            formData.append("activityId", model.activityId);
            formData.append("crmTaskStateId", model.crmTaskStateId);
            formData.append("crmTeamId", model.crmTeamId);
            formData.append("inputText", model.inputText);
            formData.append("reasonForHolding", model.reasonForHolding);
            formData.append("onHoldBefore", model.onHoldBefore)

            const res = await CrmApi.post(url, formData, {
                headers: { ...{ "content-type": "multipart/form-data" } },
            });

            if (res && res.status === 200 && res.data.apiResultState === 0) {
                MessageBoxService.show(translate("errorMsgs.recordSuccess"));
                RootNavigation.navigate('Main')
            } else {
                MessageBoxService.show(translate("errorMsgs.recordUpdateFail"));
            }

            set((state) => ({
                ...state,
                isLoading: false
            }));
            await GetCases(1, 20);

        } catch (error: any) {
            console.log(error)
        }
        finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    },
    crmGetOrders: async (orderId: string) => {
        set((state) => ({
            ...state,
            isLoading: true
        }));
        const MessageBoxService = useMessageBoxService.getState();

        var res = await CrmApi.get(`CrmOrders?orderid=${orderId}`);

        if (res.data.apiResultState === 0 && res.data.model) {
            set((state) => ({
                ...state,
                crmOrders: res.data.model
            }));
            RootNavigation.navigate('Crm', { screen: 'OrderDetail' })
        } else {
            MessageBoxService.show(res.data.message);
        }
        set((state) => ({
            ...state,
            isLoading: false
        }));
    },
    getCustomerComplaintList: async (currentPage: number) => {
        const { complaints } = get();
        const AccountService = useAccountService.getState();

        set((state) => ({
            ...state,
            isLoading: true
        }));
        const result = await CrmApi.post("CrmGetCaseList", {
            storeCode: AccountService.getUserStoreId(),
            pageNumber: currentPage.toString(),
        });

        if (result.data.apiResultState === 0) {
            if (currentPage === 1)
                set((state) => ({
                    ...state,
                    complaints: result.data.model
                }));
            else {
                set((state) => ({
                    ...state,
                    complaints: [...complaints, ...result.data.model]
                }));
            }
        }
        set((state) => ({
            ...state,
            isLoading: false
        }));
    },
    getCustomerComplaintDetail: async (taskId: string) => {
        set((state) => ({
            ...state,
            isLoading: true
        }));
        const result = await CrmApi.post(`CrmGetCaseList/getbyid/${taskId}`);

        set((state) => ({
            ...state,
            isLoading: false
        }));
        return result.data.model;
    },
    updateCustomerComplaintDetail: async (model: {
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
        const { DataURIToBlob, getCustomerComplaintList } = get();
        const AccountService = useAccountService.getState();
        const MessageBoxService = useMessageBoxService.getState();

        set((state) => ({
            ...state,
            isLoading: true
        }));
        let formData = new FormData();

        if (
            model.fisrtName.trim() === "" ||
            model.lastName.trim() === "" ||
            model.phone.trim() === "" ||
            model.phone.trim().length < 19 ||
            model.title.trim() === "" ||
            model.description.trim() === ""
        ) {
            MessageBoxService.show("Tüm alanları eksiksiz ve doğru şekilde doldurun.");
            return;
        }

        if (model.complaintType === "1" && model.orderNumber.trim() === "") {
            MessageBoxService.show("Sipariş numarasının girilmesi zorunludur.");
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
            if (model.medias[i].Url.includes("base64,")) {
                formData.append("pickImages", DataURIToBlob(model.medias[i].Url));
            } else {
                let localUri = model.medias[i].Url;
                // telefondaki sabit dosyalardan seçili ise
                if (model.medias[i].Url.startsWith("ph://")) {
                  /*  var ml = await MediaLibrary.getAssetInfoAsync(
                        model.medias[i].Url.slice(5)
                    );
                    if (ml.localUri === undefined) continue;
                    localUri = ml.localUri;

                   */
                }

                let filename = localUri.split("/").pop();

                if (filename === undefined) continue;

                // Infer the type of the image
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                //@ts-ignore
                formData.append("Attachment", { uri: localUri, name: filename, type });
            }
        }

        const result = await CrmApi.post("CrmGetCaseList/update", formData, {
            headers: { ...{ "content-type": "multipart/form-data" } },
        });

        if (result.data.apiResultState === 0) {
            MessageBoxService.show(
                model.taskId && model.taskId.length > 0
                    ? "Kayıt güncellenmiştir."
                    : "Kayıt Oluşturuldu",
                {
                    yesButtonEvent: () => {
                        getCustomerComplaintList(1);
                        RootNavigation.navigate('Crm', { screen: 'CustomerComplaintList' })
                    },
                }
            );
        } else {
            MessageBoxService.show(
                "Kayıt oluşturulamadı, Bilgilerinizi kontrol ederek daha sonra deneyin."
            );
        }
        set((state) => ({
            ...state,
            isLoading: false
        }));
    },
    setsateCustomerComplaint: async (model: {
        crmId: string;
        stateCode: number;
    }) => {
        const { getCustomerComplaintList } = get();
        const MessageBoxService = useMessageBoxService.getState();

        set((state) => ({
            ...state,
            isLoading: true
        }));
        model.stateCode = 2;
        const result = await CrmApi.post("CrmGetCaseList/setsate", model);

        if (result.data.apiResultState === 0) {
            set((state) => ({
                ...state,
                isLoading: false
            }));
            MessageBoxService.show("Kayıt başarıyla iptal edildi", {
                yesButtonEvent: () => {
                    getCustomerComplaintList(1);
                    RootNavigation.navigate('Crm', { screen: 'CustomerComplaintList' })
                },
            });
        } else {
            MessageBoxService.show(translate("crmCrmCreateCustomerComplaint.errorMessage"));
        }
    },
    SetSelectedCaseModel: (data: CRMCaseModel) => {
        set((state) => ({
            ...state,
            selectedCase: data
        }));
    },
    ErFindFiche: async (filter: {
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
            const MessageBoxService = useMessageBoxService.getState();
            const { removePhoneMask } = get();
            set((state) => ({
                ...state,
                isLoading: true
            }));
            if (
                filter.gsm === "" &&
                filter.barcode === "" &&
                filter.shippingStore === "" &&
                filter.gsm === "" &&
                filter.receiptNumber === ""
            ) {
                MessageBoxService.show(translate("servicesEasyReturnService.voucherNotFound"));
                return;
            }

            filter.shippingDate = filter.shippingDate || "";

            filter.gsm = removePhoneMask(filter.gsm || "");

            var result = await SystemApi.post("Genius/GetByCustomerInfo", filter);

            if (result.status === 200) {
                if (result.data.isValid && result.data.state === 1) {
                    if (result.data.model.length < 1) {
                        MessageBoxService.show(
                            translate("servicesEasyReturnService.voucherNotFound")
                        );
                    } else {
                        set((state) => ({
                            ...state,
                            currentFicheList: result.data.model
                        }));
                        RootNavigation.navigate('Crm', { screen: 'CrmFicheResult' })
                    }
                } else {
                    MessageBoxService.show(
                        result.data.message
                    );
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
    removePhoneMask: (phone: string) => {
        phone = phone.trim();
        phone = phone.replace("(", "");
        phone = phone.replace(")", "");
        while (phone.indexOf(" ") > 0) phone = phone.replace(" ", "");
        phone = phone.startsWith("0") ? phone.substring(1) : phone;
        return phone;
    },
    getAttachmentById: async (attachmentId: string) => {
        try {
            set((state) => ({
                ...state,
                isLoading: true
            }));
            const result = await CrmApi.get(`CrmCase/GetAttachmentById?attachmentId=${attachmentId}`)
            return result
        } catch (error) {
        } finally {
            set((state) => ({
                ...state,
                isLoading: false
            }));
        }
    }


}));
