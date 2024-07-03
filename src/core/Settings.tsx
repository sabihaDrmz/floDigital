import ApplicationGlobalService from "./services/ApplicationGlobalService";

export enum ServiceUrlType {
  BASE_URL,
  CRM_BASE,
  AUTH_BASE,
  CRM_LOGIN,
  CRM_CASE,
  CRM_TEAM,
  GET_GROUP_ROLE,
  GET_PERMS,
  SYSTEM_API,
  GET_ANNOUNCEMENT,
  GET_FILES,
  GET_STOCK,
  PRINTER_CONFIG,
  VKORG_API,
  BASKET_BASE,
  ADD_BASKET,
  BASKET_COMPLETE,
  GET_BASKET_LIST,
  UPDATE_BASKET,
  DELETE_BASKET,
  DELETE_BASKET_ITEM,
  BASKET_STOCK,
  CITY_BASE,
  ALL_CITY,
  GET_DISTRICT_BY_CITY_ID,
  GET_NEIGHBOURHOOD_BY_DISTRICT_ID,
  SEND_KVKK_SMS,
  APPROVE_KVKK_SMS,
  SENT_CONTRACT_SMS,
  RE_SENT_CONTRACT_SMS,
  APPROVE_CONTACT_SMS,
  EASY_RETURN_BASE,
  EASY_RETURN_CHECK_FICHE,
  EASY_RETURN_FIND_FICHE,
  HELP_LINK,
  SAP_STORE,
  PAYMENT_TYPE,
  EASY_RETURN_REASONS,
  ER_TRANSACTION_BASE,
  ER_TRANSACTION_CREATE,
  ER_TRANSACTION_UPDATE,
  ER_TRANSACTION_LINE_BASE,
  ER_TRANSACTION_LINE_CREATE,
  ER_TRANSACTION_LINE_UPDATE,
  ER_TRANSACTION_LINE_REMOVE,
  ER_TRANSACTION_LINE_DETAIL_CREATE,
  ER_TRANSACTION_LINE_DETAIL_UPDATE,
  ER_TRANSACTION_LINE_DETAIL_DELTE,
  ER_TRANSACTION_LINE_DETAIL_GET,
  ER_TRANSACTION_LINE_DETAIL_GET_IMAGES,
  ER_TRANSACTION_LINE_DETAIL_CREATE_IMAGE,
  ER_TRANSACTION_LINE_DETAIL_DELETE_IMAGE,
  EASY_RETURN_COMMIT,
  ER_SENT_SMS,
  ER_APPROVE_SMS,
  ER_BROKEN_PRODUCT_SEARCH,
  ER_PRODUCT_GROUPS,
  ER_PRODUCT_GROUPS_REASONS,
  VERSION,
  CRM_ORDER_CHECK,
  ADDRES_CHECK,
  CRM_COMPLAINT_LIST,
  CRM_COMPLAINT_DETAIL,
  CRM_COMPLAINT_SAVE_OR_CREATE,
  OMS_BASE,
  OMS_STATE_REPORT,
  OMS_ORDERS,
  OMS_ORDER_PICK_LIST,
  OMS_ORDER_PICK_LIST_ORDER,
  OMS_ORDER_ASSIGN_TO_ME,
  OMS_TEST_AUTH,
  OMS_ORDER_PACKAGE_LIST,
  OMS_ORDER_COMPLETE_COLLECT,
  CRM_SET_SATE,
  ECOM_STORE,
}

export const GetServiceUri = (uriType: ServiceUrlType): string => {
  let isTest = ApplicationGlobalService.testMode;
  if (ApplicationGlobalService.restoredTestMode) {
    ApplicationGlobalService.restoreTestMode().then((x) => {
      isTest = x;
    });
  }

  switch (uriType) {
    case ServiceUrlType.BASE_URL: {
      return isTest ? "http://10.0.60.12:5902/" : "https://digital.flo.com.tr/";
    }
    case ServiceUrlType.CRM_BASE:
      return GetServiceUri(ServiceUrlType.BASE_URL) + "crm/api/";
    case ServiceUrlType.OMS_TEST_AUTH:
      return "http://10.0.60.12:5001/IAMHubApi/api";
    case ServiceUrlType.AUTH_BASE:
      return isTest
        ? "https://merkezilogin.flo.com.tr/api/"
        : "https://merkezilogin.flo.com.tr/api/";
    case ServiceUrlType.OMS_BASE:
      return GetServiceUri(ServiceUrlType.BASE_URL) + "oms/api/";
    case ServiceUrlType.CRM_LOGIN:
      return GetServiceUri(ServiceUrlType.CRM_BASE) + "CrmLogin";
    case ServiceUrlType.CRM_CASE:
      return GetServiceUri(ServiceUrlType.CRM_BASE) + "CrmCase";
    case ServiceUrlType.CRM_TEAM:
      return GetServiceUri(ServiceUrlType.CRM_BASE) + "CrmTeam";
    case ServiceUrlType.GET_GROUP_ROLE:
      return GetServiceUri(ServiceUrlType.AUTH_BASE) + "UserGroupRole/GetList";
    case ServiceUrlType.GET_PERMS:
      return GetServiceUri(ServiceUrlType.AUTH_BASE) + "User/CheckMenuItemPriv";
    case ServiceUrlType.SYSTEM_API:
      return GetServiceUri(ServiceUrlType.BASE_URL) + "sys/api/";
    case ServiceUrlType.GET_ANNOUNCEMENT:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "Announcement/Get";
    case ServiceUrlType.GET_FILES:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "Document/Get";
    case ServiceUrlType.GET_STOCK:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "Stock";
    case ServiceUrlType.PRINTER_CONFIG:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
        "PtcConfigCategory/GetCategoryWithPtcConfig"
      );
    case ServiceUrlType.VKORG_API:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "User/GetUserByPernr";
    case ServiceUrlType.BASKET_BASE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "basket/";
    case ServiceUrlType.ADD_BASKET:
      return GetServiceUri(ServiceUrlType.BASKET_BASE) + "AddBasket";
    case ServiceUrlType.BASKET_COMPLETE:
      return GetServiceUri(ServiceUrlType.BASKET_BASE) + "SetBasketStatus";
    case ServiceUrlType.GET_BASKET_LIST:
      return GetServiceUri(ServiceUrlType.BASKET_BASE) + "GetBasket";
    case ServiceUrlType.UPDATE_BASKET:
      return GetServiceUri(ServiceUrlType.BASKET_BASE) + "UpdateById";
    case ServiceUrlType.DELETE_BASKET:
      return GetServiceUri(ServiceUrlType.BASKET_BASE) + "DeleteBasket";
    case ServiceUrlType.DELETE_BASKET_ITEM:
      return GetServiceUri(ServiceUrlType.BASKET_BASE) + "DeleteBasketItem";
    case ServiceUrlType.BASKET_STOCK:
      return (
        GetServiceUri(ServiceUrlType.BASKET_BASE) + "CheckStockBasketItems"
      );
    case ServiceUrlType.CITY_BASE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "city/";
    case ServiceUrlType.ALL_CITY:
      return GetServiceUri(ServiceUrlType.CITY_BASE) + "GetCity";
    case ServiceUrlType.GET_DISTRICT_BY_CITY_ID:
      return GetServiceUri(ServiceUrlType.CITY_BASE) + "GetDistrictByCityId/";
    case ServiceUrlType.GET_NEIGHBOURHOOD_BY_DISTRICT_ID:
      return (
        GetServiceUri(ServiceUrlType.CITY_BASE) + "GetNeighborhoodByDistrictId/"
      );
    case ServiceUrlType.SEND_KVKK_SMS:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "Kvkk/GetKvkkSmsCode";
    case ServiceUrlType.APPROVE_KVKK_SMS:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Kvkk/GetApproveSmsCode"
      );
    case ServiceUrlType.SENT_CONTRACT_SMS:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Agreement/SendMss?basketId="
      );
    case ServiceUrlType.RE_SENT_CONTRACT_SMS:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "Agreement/ReSend";
    case ServiceUrlType.APPROVE_CONTACT_SMS:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Agreement/ApproveBasket"
      );
    case ServiceUrlType.EASY_RETURN_BASE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "Genius/";
    case ServiceUrlType.EASY_RETURN_COMMIT:
      return (
        GetServiceUri(ServiceUrlType.EASY_RETURN_COMMIT) +
        "Genius/SendReturnProduct"
      );
    case ServiceUrlType.EASY_RETURN_CHECK_FICHE:
      return GetServiceUri(ServiceUrlType.EASY_RETURN_BASE) + "GetByFicheKey";
    case ServiceUrlType.EASY_RETURN_FIND_FICHE:
      return (
        GetServiceUri(ServiceUrlType.EASY_RETURN_BASE) + "GetByCustomerInfo"
      );
    case ServiceUrlType.HELP_LINK:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
        "HelpCategory/GetListWithHelps"
      );
    case ServiceUrlType.SAP_STORE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "SapStore";
    case ServiceUrlType.PAYMENT_TYPE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "PaymentType";
    case ServiceUrlType.EASY_RETURN_REASONS:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "EasyReturn";
    case ServiceUrlType.ER_TRANSACTION_BASE:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "EasyReturnTransaction/"
      );
    case ServiceUrlType.ER_TRANSACTION_CREATE:
      return GetServiceUri(ServiceUrlType.ER_TRANSACTION_BASE) + "Create";
    case ServiceUrlType.ER_TRANSACTION_UPDATE:
      return GetServiceUri(ServiceUrlType.ER_TRANSACTION_BASE) + "UPDATE";

    case ServiceUrlType.ER_TRANSACTION_LINE_BASE:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "EasyReturnTransactionLine/"
      );
    case ServiceUrlType.ER_TRANSACTION_LINE_CREATE:
      return GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_BASE) + "Create";
    case ServiceUrlType.ER_TRANSACTION_LINE_UPDATE:
      return GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_BASE) + "UPDATE";
    case ServiceUrlType.ER_TRANSACTION_LINE_REMOVE:
      return GetServiceUri(ServiceUrlType.ER_TRANSACTION_LINE_BASE) + "Delete";
    case ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_CREATE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "ertld/DetailCreate";
    case ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_UPDATE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "ertld/DetailUpdate";
    case ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_DELTE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "ertld/DetailDelete";
    case ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_GET:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "ertld/GetDetails";
    case ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_GET_IMAGES:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "ertld/GetDetailImages";
    case ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_CREATE_IMAGE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "ertld/ImageCreate";
    case ServiceUrlType.ER_TRANSACTION_LINE_DETAIL_DELETE_IMAGE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "ertld/ImageDelete";
    case ServiceUrlType.ER_SENT_SMS:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
        "EasyReturnTransaction/SendSms"
      );
    case ServiceUrlType.ER_APPROVE_SMS:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) +
        "EasyReturnTransaction/ApproveSms"
      );
    case ServiceUrlType.ER_BROKEN_PRODUCT_SEARCH:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "Genius/BrokenProductSearch"
      );
    case ServiceUrlType.ER_PRODUCT_GROUPS:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "ProductGroup/Get";
    case ServiceUrlType.ER_PRODUCT_GROUPS_REASONS:
      return (
        GetServiceUri(ServiceUrlType.SYSTEM_API) + "ProductGroupReason/Get"
      );
    case ServiceUrlType.VERSION:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "Version";
    case ServiceUrlType.CRM_ORDER_CHECK:
      return GetServiceUri(ServiceUrlType.CRM_BASE) + "CrmOrders?orderid=";
    case ServiceUrlType.ADDRES_CHECK:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "Adress?phone=";
    case ServiceUrlType.CRM_COMPLAINT_LIST:
      return GetServiceUri(ServiceUrlType.CRM_BASE) + "CrmGetCaseList";
    case ServiceUrlType.CRM_SET_SATE:
      return GetServiceUri(ServiceUrlType.CRM_BASE) + "CrmGetCaseList/setsate";
    case ServiceUrlType.CRM_COMPLAINT_DETAIL:
      return GetServiceUri(ServiceUrlType.CRM_BASE) + "CrmGetCaseList/getbyid";
    case ServiceUrlType.CRM_COMPLAINT_SAVE_OR_CREATE:
      return GetServiceUri(ServiceUrlType.CRM_BASE) + "CrmGetCaseList/update";
    case ServiceUrlType.OMS_STATE_REPORT:
      return GetServiceUri(ServiceUrlType.OMS_BASE) + "omc/orderreport";
    case ServiceUrlType.OMS_ORDERS:
      return GetServiceUri(ServiceUrlType.OMS_BASE) + "collectall/getlist";
    case ServiceUrlType.OMS_ORDER_PICK_LIST:
      return (
        GetServiceUri(ServiceUrlType.OMS_BASE) +
        "Mypicklist/GetAllListForPicklistNoBC"
      );
    case ServiceUrlType.OMS_ORDER_PICK_LIST_ORDER:
      return (
        GetServiceUri(ServiceUrlType.OMS_BASE) + "Mypicklist/GetBCPickList"
      );
    case ServiceUrlType.OMS_ORDER_ASSIGN_TO_ME:
      return (
        GetServiceUri(ServiceUrlType.OMS_BASE) + "OrderStats/SetStatusByOrderNo"
      );
    case ServiceUrlType.OMS_ORDER_PACKAGE_LIST:
      return GetServiceUri(ServiceUrlType.OMS_BASE) + "PackageList/GetList";
    case ServiceUrlType.OMS_ORDER_COMPLETE_COLLECT:
      return GetServiceUri(ServiceUrlType.OMS_BASE) + "MyPickList/SaveOrder";
    case ServiceUrlType.ECOM_STORE:
      return GetServiceUri(ServiceUrlType.SYSTEM_API) + "EcomStore";
    default:
      return "/";
  }
};

//GetByFicheKey
//GetByCustomerInfo
