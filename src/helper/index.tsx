import { AppColor } from "@flomagazacilik/flo-digital-components";
import { phonePrefix } from "../constant";
import moment from "moment";

const
    turkishtoEnglish = (txt: string) => {
        return txt
            .replace("Ğ", "g")
            .replace("Ü", "u")
            .replace("Ş", "s")
            .replace("I", "i")
            .replace("İ", "i")
            .replace("Ö", "o")
            .replace("Ç", "c")
            .replace("ğ", "g")
            .replace("ü", "u")
            .replace("ş", "s")
            .replace("ı", "i")
            .replace("ö", "o")
            .replace("ç", "c");
    },

    removePhoneMask = (phone: string) => {
        if (phone === "") return phone;
        phone = phone.trim();
        if (phone === "") return phone;
        phone = phone.replace("(", "");
        phone = phone.replace(")", "");
        while (phone.indexOf(" ") > 0) phone = phone.replace(" ", "");
        phone = phone.startsWith("0") ? phone.substring(1) : phone;
        return phone;
    },

    isPhone = (phone: string) => {
        phone = removePhoneMask(phone);

        return phone.startsWith("0")
            ? phone.length > 3 &&
            phonePrefix.filter(
                (x: any) =>
                    x === phone.substring(0, 3) || x.includes(phone.substring(0, 3))
            ).length > 0
            : phone.length >= 3 &&
            phonePrefix.filter(
                (x: any) =>
                    x === phone.substring(0, 3) || x.includes(phone.substring(0, 3))
            ).length > 0;
    },

    getStateColor = (state?: string) => {
        let iState = Number(state);

        switch (iState) {
            case 1:
            case 8:
                return AppColor.FD.Functional.Error;
            case 4:
            case 2:
            case 9:
                return AppColor.OMS.Background.Success;
            case 3:
            case 5:
            case 6:
            case 7:
            default:
                return AppColor.FD.Brand.Solid;
        }
    };

// time like  14:30
const compareTimes = (time1: string, time2: string) => {
    let a = moment(time1, "HH:mm:ss");
    let b = moment(time2, "HH:mm:ss");
    return a.diff(b)
};
const isEqualDates = (date1: Date, date2: Date) => {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
};



export { turkishtoEnglish, removePhoneMask, isPhone, getStateColor, compareTimes, isEqualDates }
