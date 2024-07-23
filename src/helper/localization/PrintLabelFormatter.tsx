import I18n from "i18n-js";
import { SayaVeMensei } from "../../assets/static/SayaVeMensei";

const PriceType = {
  F1: "<f1>",
  F1E: "<f1E>",
  F2: "<f2>",
  F2E: "<f2E>",
  F3: "<f3>",
  F3E: "<f3E>",
  F4: "<f4>",
  F4E: "<f4E>",
  F5: "<f5>",
};

export function formatLabel(content: any, alias: any, data: any) {
  let fContent = content;

  fContent = formatPrice(fContent, data, alias);
  fContent = formatTags(fContent, data);
  fContent = formatTrChars(fContent, data);
  fContent = formatLogo(fContent, data, alias);

  let barcodeType = "barcodeType";

  if (data.product.barcode!!.length < 13) {
    fContent = fContent.replaceAll(barcodeType, "BU");
    if (data.product.barcode!!.length < 12)
      fContent = fContent.replaceAll(
        data.product.barcode!!,
        data.product.barcode!!.padStart(12, "0")
      );
  } else {
    fContent = fContent.replaceAll(barcodeType, "BE");
  }

  return fContent;
}
export function formatLabelRussia(content: any, alias: any, data: any) {
  let fContent = content;

  fContent = formatTags(fContent, data);

  return fContent;
}

function formatPrice(fContent: string, data: any, alias: any): string {
  let p1tag = tagToParsedPrice(
    data.tagValue.find((x: any) => x.key === PriceType.F1)
  );

  let p2tag = tagToParsedPrice(
    data.tagValue.find((x: any) => x.key === PriceType.F2)
  );
  let p3tag = tagToParsedPrice(
    data.tagValue.find((x: any) => x.key === PriceType.F3)
  );
  let p4tag = tagToParsedPrice(
    data.tagValue.find((x: any) => x.key === PriceType.F4)
  );

  if (data.tagValue.find((x: any) => x.key === PriceType.F5)) {
    let p5tag = tagToParsedPrice(
      data.tagValue.find((x: any) => x.key === PriceType.F5)
    );
    fContent = fContent.replaceAll(PriceType.F5, p5tag.strIntPart);
  }

  fContent = fContent
    .replaceAll(PriceType.F1, p1tag.strIntPart)
    .replaceAll(PriceType.F1E, p1tag.strDecimalPart)
    .replaceAll(PriceType.F2, p2tag.strIntPart)
    .replaceAll(PriceType.F2E, p2tag.strDecimalPart)
    .replaceAll(PriceType.F3, p3tag.strIntPart)
    .replaceAll(PriceType.F3E, p3tag.strDecimalPart)
    .replaceAll(PriceType.F4, p4tag.strIntPart)
    .replaceAll(PriceType.F4E, p4tag.strDecimalPart)
    .replaceAll(
      "1234567890123",
      data.product.barcode.replaceAll("^0+(?!$)", "")
    );
  return fContent;
}

function tagToParsedPrice(tag: {
  tag: string;
  key: string;
  title: string;
  value: number;
}) {
  let intPart = Math.trunc(tag.value);
  let decimalPart = Math.trunc(Math.round((tag.value - intPart) * 100));
  let spaces = "";
  if (intPart < 10) spaces = "    ";
  else if (intPart < 100) spaces = "  ";

  return {
    intPart,
    strIntPart: `${spaces}${intPart}`,
    decimalPart,
    strDecimalPart: `${decimalPart}${decimalPart < 10 ? "0" : ""}`,
  };
}

function formatTags(content: any, data: any): string {
  data.tagValue.forEach((element: any) => {
    if (element.tag == "MATNR") {
      let sku = element.value.replaceAll("^0+(?!$)", "");

      sku = Number(sku);
      content = content.replaceAll(element.key, sku);
    }

    if (element.key.length > 0) {
      if (element.tag === "LANDX") {
        // Ülkelere göre alfabe değiştirme
        let data = element.value;
        let replacementData = SayaVeMensei.Mensei.find(
          (x) => x.mensei_TR === data
        );

        if (replacementData) {
          let langTag = 'tr';// TODO: EXPO cihaz dili secilecek .

          if (langTag === "tr") data = replacementData?.mensei_TR;
          else if (langTag === "en") data = replacementData?.mensei_EN;
          else if (langTag === "mk") data = replacementData?.mensei_MK;
          else if (langTag === "ua") data = replacementData?.mensei_UKR;
          else if (langTag === "sq") data = replacementData?.mensei_KSV;
        }
        content = content.replaceAll(element.key, data);
      } else if (element.tag == "DATAB1") {
        let date = element.value.split("-");
        content = content.replaceAll(
          element.key,
          date[2] + "." + date[1] + "." + date[0]
        );
      } else {
        content = content.replaceAll(element.key, element.value);
      }
    }
  });

  return content;
}
function formatTrChars(content: any, data: any): string {
  content = content.replaceAll("İ", "I");
  content = content.replaceAll("Ş", "S");
  content = content.replaceAll("Ü", "U");
  content = content.replaceAll("Ö", "O");
  content = content.replaceAll("Ğ", "G");
  content = content.replaceAll("Ç", "C");
  content = content.replaceAll("ş", "s");
  content = content.replaceAll("ü", "u");
  content = content.replaceAll("ö", "o");
  content = content.replaceAll("ğ", "g");
  content = content.replaceAll("ç", "c");

  return content;
}

export function formatKzkChars(content: any): string {
  var newText = "";

  for (var i = 0; i < content.length; i++) {
    var c = content[i];
    switch (c) {
      case "й":
        newText += "_D0_B9";
        break;
      case "Й":
        newText += "_D0_99";
        break;
      case "ц":
        newText += "_D1_86";
        break;
      case "Ц":
        newText += "_D0_A6";
        break;
      case "у":
        newText += "_D1_83";
        break;
      case "У":
        newText += "_D0_A3";
        break;
      case "к":
        newText += "_D0_BA";
        break;
      case "К":
        newText += "_D0_9A";
        break;
      case "е":
        newText += "_D0_B5";
        break;
      case "Е":
        newText += "_D0_95";
        break;
      case "н":
        newText += "_D0_BD";
        break;
      case "Н":
        newText += "_D0_9D";
        break;
      case "г":
        newText += "_D0_B3";
        break;
      case "Г":
        newText += "_D0_93";
        break;
      case "ш":
        newText += "_D1_88";
        break;
      case "Ш":
        newText += "_D0_A8";
        break;
      case "щ":
        newText += "_D1_89";
        break;
      case "Щ":
        newText += "_D0_A9";
        break;
      case "з":
        newText += "_D0_B7";
        break;
      case "З":
        newText += "_D0_97";
        break;
      case "х":
        newText += "_D1_85";
        break;
      case "Х":
        newText += "_D0_A5";
        break;
      case "ъ":
        newText += "_D1_8A";
        break;
      case "Ъ":
        newText += "_D0_AA";
        break;
      case "ф":
        newText += "_D1_84";
        break;
      case "Ф":
        newText += "_D0_A4";
        break;
      case "ы":
        newText += "_D1_8B";
        break;
      case "Ы":
        newText += "_D0_AB";
        break;
      case "в":
        newText += "_D0_B2";
        break;
      case "В":
        newText += "_D0_92";
        break;
      case "а":
        newText += "_D0_B0";
        break;
      case "А":
        newText += "_D0_90";
        break;
      case "п":
        newText += "_D0_BF";
        break;
      case "П":
        newText += "_D0_9F";
        break;
      case "р":
        newText += "_D1_80";
        break;
      case "Р":
        newText += "_D0_A0";
        break;
      case "о":
        newText += "_D0_BE";
        break;
      case "О":
        newText += "_D0_9E";
        break;
      case "л":
        newText += "_D0_BB";
        break;
      case "Л":
        newText += "_D0_9B";
        break;
      case "д":
        newText += "_D0_B4";
        break;
      case "Д":
        newText += "_D0_94";
        break;
      case "ж":
        newText += "_D0_B6";
        break;
      case "Ж":
        newText += "_D0_96";
        break;
      case "э":
        newText += "_D1_8D";
        break;
      case "Э":
        newText += "_D0_AD";
        break;
      case "я":
        newText += "_D1_8F";
        break;
      case "Я":
        newText += "_D0_AF";
        break;
      case "ч":
        newText += "_D1_87";
        break;
      case "Ч":
        newText += "_D0_A7";
        break;
      case "с":
        newText += "_D1_81";
        break;
      case "С":
        newText += "_D0_A1";
        break;
      case "м":
        newText += "_D0_BC";
        break;
      case "М":
        newText += "_D0_9C";
        break;
      case "и":
        newText += "_D0_B8";
        break;
      case "И":
        newText += "_D0_98";
        break;
      case "т":
        newText += "_D1_82";
        break;
      case "Т":
        newText += "_D0_A2";
        break;
      case "ь":
        newText += "_D1_8C";
        break;
      case "Ь":
        newText += "_D0_AC";
        break;
      case "б":
        newText += "_D0_B1";
        break;
      case "Б":
        newText += "_D0_91";
        break;
      case "ю":
        newText += "_D1_8E";
        break;
      case "Ю":
        newText += "_D0_AE";
        break;
      case "ӑ":
        newText += "_D3_91";
        break;
      case "Ӑ":
        newText += "_D3_90";
        break;
      case "ӓ":
        newText += "_D3_93";
        break;
      case "Ӓ":
        newText += "_D3_92";
        break;
      case "ә":
        newText += "_D3_99";
        break;
      case "Ә":
        newText += "_D3_98";
        break;
      case "ӛ":
        newText += "_D3_9B";
        break;
      case "Ӛ":
        newText += "_D3_9A";
        break;
      case "ӕ":
        newText += "_D3_95";
        break;
      case "Ӕ":
        newText += "_D3_94";
        break;
      case "ґ":
        newText += "_D2_91";
        break;
      case "Ґ":
        newText += "_D2_90";
        break;
      case "ѓ":
        newText += "_D1_93";
        break;
      case "Ѓ":
        newText += "_D0_83";
        break;
      case "ғ":
        newText += "_D2_93";
        break;
      case "Ғ":
        newText += "_D2_92";
        break;
      case "ӷ":
        newText += "_D3_B7";
        break;
      case "Ӷ":
        newText += "_D3_B6";
        break;
      case "ҕ":
        newText += "_D2_95";
        break;
      case "Ҕ":
        newText += "_D2_94";
        break;
      case "ђ":
        newText += "_D1_92";
        break;
      case "Ђ":
        newText += "_D0_82";
        break;
      case "ѐ":
        newText += "_D1_90";
        break;
      case "Ѐ":
        newText += "_D0_80";
        break;
      case "ӗ":
        newText += "_D3_97";
        break;
      case "Ӗ":
        newText += "_D3_96";
        break;
      case "ҽ":
        newText += "_D2_BD";
        break;
      case "Ҽ":
        newText += "_D2_BC";
        break;
      case "ҿ":
        newText += "_D2_BF";
        break;
      case "Ҿ":
        newText += "_D2_BE";
        break;
      case "є":
        newText += "_D1_94";
        break;
      case "Є":
        newText += "_D0_84";
        break;
      case "ӂ":
        newText += "_D3_82";
        break;
      case "Ӂ":
        newText += "_D3_81";
        break;
      case "җ":
        newText += "_D2_97";
        break;
      case "Җ":
        newText += "_D2_96";
        break;
      case "ӝ":
        newText += "_D3_9D";
        break;
      case "Ӝ":
        newText += "_D3_9C";
        break;
      case "ҙ":
        newText += "_D2_99";
        break;
      case "Ҙ":
        newText += "_D2_98";
        break;
      case "ӟ":
        newText += "_D3_9F";
        break;
      case "Ӟ":
        newText += "_D3_9E";
        break;
      case "ӡ":
        newText += "_D3_A1";
        break;
      case "Ӡ":
        newText += "_D3_A0";
        break;
      case "ѕ":
        newText += "_D1_95";
        break;
      case "Ѕ":
        newText += "_D0_85";
        break;
      case "ѝ":
        newText += "_D1_9D";
        break;
      case "Ѝ":
        newText += "_D0_8D";
        break;
      case "ӥ":
        newText += "_D3_A5";
        break;
      case "Ӥ":
        newText += "_D3_A4";
        break;
      case "ӣ":
        newText += "_D3_A3";
        break;
      case "Ӣ":
        newText += "_D3_A2";
        break;
      case "і":
        newText += "_D1_96";
        break;
      case "І":
        newText += "_D0_86";
        break;
      case "ї":
        newText += "_D1_97";
        break;
      case "Ї":
        newText += "_D0_87";
        break;
      case "Ӏ":
        newText += "_D3_80";
        break;
      case "ҋ":
        newText += "_D2_8B";
        break;
      case "Ҋ":
        newText += "_D2_8A";
        break;
      case "ј":
        newText += "_D1_98";
        break;
      case "Ј":
        newText += "_D0_88";
        break;
      case "қ":
        newText += "_D2_9B";
        break;
      case "Қ":
        newText += "_D2_9A";
        break;
      case "ҟ":
        newText += "_D2_9F";
        break;
      case "Ҟ":
        newText += "_D2_9E";
        break;
      case "ҡ":
        newText += "_D2_A1";
        break;
      case "Ҡ":
        newText += "_D2_A0";
        break;
      case "ӄ":
        newText += "_D3_84";
        break;
      case "Ӄ":
        newText += "_D3_83";
        break;
      case "ҝ":
        newText += "_D2_9D";
        break;
      case "Ҝ":
        newText += "_D2_9C";
        break;
      case "ӆ":
        newText += "_D3_86";
        break;
      case "Ӆ":
        newText += "_D3_85";
        break;
      case "љ":
        newText += "_D1_99";
        break;
      case "Љ":
        newText += "_D0_89";
        break;
      case "ӎ":
        newText += "_D3_8E";
        break;
      case "Ӎ":
        newText += "_D3_8D";
        break;
      case "ӊ":
        newText += "_D3_8A";
        break;
      case "Ӊ":
        newText += "_D3_89";
        break;
      case "ң":
        newText += "_D2_A3";
        break;
      case "Ң":
        newText += "_D2_A2";
        break;
      case "ӈ":
        newText += "_D3_88";
        break;
      case "Ӈ":
        newText += "_D3_87";
        break;
      case "ҥ":
        newText += "_D2_A5";
        break;
      case "Ҥ":
        newText += "_D2_A4";
        break;
      case "њ":
        newText += "_D1_9A";
        break;
      case "Њ":
        newText += "_D0_8A";
        break;
      case "ӧ":
        newText += "_D3_A7";
        break;
      case "Ӧ":
        newText += "_D3_A6";
        break;
      case "ө":
        newText += "_D3_A9";
        break;
      case "Ө":
        newText += "_D3_A8";
        break;
      case "ӫ":
        newText += "_D3_AB";
        break;
      case "Ӫ":
        newText += "_D3_AA";
        break;
      case "ҩ":
        newText += "_D2_A9";
        break;
      case "Ҩ":
        newText += "_D2_A8";
        break;
      case "ҧ":
        newText += "_D2_A7";
        break;
      case "Ҧ":
        newText += "_D2_A6";
        break;
      case "ҏ":
        newText += "_D2_8F";
        break;
      case "Ҏ":
        newText += "_D2_8E";
        break;
      case "ҫ":
        newText += "_D2_AB";
        break;
      case "Ҫ":
        newText += "_D2_AA";
        break;
      case "ҭ":
        newText += "_D2_AD";
        break;
      case "Ҭ":
        newText += "_D2_AC";
        break;
      case "ћ":
        newText += "_D1_9B";
        break;
      case "Ћ":
        newText += "_D0_8B";
        break;
      case "ќ":
        newText += "_D1_9C";
        break;
      case "Ќ":
        newText += "_D0_8C";
        break;
      case "ў":
        newText += "_D1_9E";
        break;
      case "Ў":
        newText += "_D0_8E";
        break;
      case "ӳ":
        newText += "_D3_B3";
        break;
      case "Ӳ":
        newText += "_D3_B2";
        break;
      case "ӱ":
        newText += "_D3_B1";
        break;
      case "Ӱ":
        newText += "_D3_B0";
        break;
      case "ӯ":
        newText += "_D3_AF";
        break;
      case "Ӯ":
        newText += "_D3_AE";
        break;
      case "ү":
        newText += "_D2_AF";
        break;
      case "Ү":
        newText += "_D2_AE";
        break;
      case "ұ":
        newText += "_D2_B1";
        break;
      case "Ұ":
        newText += "_D2_B0";
        break;
      case "ҳ":
        newText += "_D2_B3";
        break;
      case "Ҳ":
        newText += "_D2_B2";
        break;
      case "һ":
        newText += "_D2_BB";
        break;
      case "Һ":
        newText += "_D2_BA";
        break;
      case "ҵ":
        newText += "_D2_B5";
        break;
      case "Ҵ":
        newText += "_D2_B4";
        break;
      case "ӵ":
        newText += "_D3_B5";
        break;
      case "Ӵ":
        newText += "_D3_B4";
        break;
      case "ҷ":
        newText += "_D2_B7";
        break;
      case "Ҷ":
        newText += "_D2_B6";
        break;
      case "ӌ":
        newText += "_D3_8C";
        break;
      case "Ӌ":
        newText += "_D3_8B";
        break;
      case "ҹ":
        newText += "_D2_B9";
        break;
      case "Ҹ":
        newText += "_D2_B8";
        break;
      case "џ":
        newText += "_D1_9F";
        break;
      case "Џ":
        newText += "_D0_8F";
        break;
      case "ӹ":
        newText += "_D3_B9";
        break;
      case "Ӹ":
        newText += "_D3_B8";
        break;
      case "ҍ":
        newText += "_D2_8D";
        break;
      case "Ҍ":
        newText += "_D2_8C";
        break;
      case "ӭ":
        newText += "_D3_AD";
        break;
      case "Ӭ":
        newText += "_D3_AC";
        break;
      case "Ë":
        newText += "_D0_9E";
        break;
      case "ë":
        newText += "_D1_91";
        break;
      case "":
        newText += "";
        break;
      default:
        newText += c;
        break;
    }
  }
  return newText;
}

function formatLogo(content: any, data: any, alias: any): string {
  let tag = data.tagValue.find((x: any) => x.tag === "LANDX");

  if (!tag) return content;
  let mensei = tag.value.toUpperCase();

  let logo = "";
  let logoRDUCGEN =
    "^GFA,533,533,13,J01gFCJ03gFCJ078X01CJ0FY01CI03CY01CI078U0EI01CI0F07ES0EI01C001E0FEW01C001C3C7I0F1CFE7F1C0EI01C001C78380073CFE7F9C0EI01C001FF01C007B8FC7F9C0EI01C001FE01E003F8E073DC0EI01C001FC00E003F0FE73DC0EI01CM07001F0FE7F9C0EI01C8K0C3801E0FC7F9C0EI01CCJ01C1C00E0E07F1C0EI01CE1F800E0E00E0FE771FCEI01CF7F80870F00E0FE739FCEI01CFF1C1C38700E0FE739FCEI01CFE1C0E1C38T01CFC1F0F0E38T01CF87F870E3833N0EI01CF8F38387F837N0EI01CF9E1C1C3F8T01CFFC3E0E3F8F39FC3FBFCE7071CFF87F0F3F8F39FE3FBFEE78F1CFF0F387FF8F39FF3FBFCE78F1CFF1E383FF8F39C738070E7DF1CIFC3C3FF8F39C73F870E7FF1CIF07JF8F39FF3F870E7FF1CIF0KF8F39FE3F870EI71CIF1E3IF8F39FC38070EI71CJFC3IF87F9CE38070E7271CJF07IF87F9CE3F870E7071CIFE0JF83F1C73F870E7071CIFE1JF8T01CJF7JF8T01COF8T01CgKFC::";

  let logoRDGondol =
    "^GFA,1168,1168,8,OFE,OFC,OF,NFE,NFC,NF8,LFDF,LF8F8,LF07C,LF03E,LF81E,LFC1E,JFE3E0E,JFC1E0E,JFC0F0E,JFE0F8E,KF07FE0FF,IF0F83FE0FF8,IF0781FE0FF8,IF03C1F00E7C,IF81E3C00E3E,IFC1FFC00E1F,FE3E0FF800E0F8,FC1F07F800E07C,FC1F07CI0F03E,FE0F8FJ0F83E,FF07FFJ07C1F,FF83FE01003C0F8,FFC1FE07801E07C,FFC1F00F800F03C,FFE3C01F800F83C,JF803FI0783C,JF807CI0383C,JF01F8080383C,JF03F01C0383C,JF07E07C0383C,JF0FC0FC0783C,LF01F01F83C,KFE03E03F03C,KFC07C07E03C,KFC1F80F803C,KF83F01F003C,KFC7E07E003C,MF80FC003C,MF01F8003C,LFE03FI03C,LFE07CI03C,LFC1F8I03C,LFE3FJ03C,NFEJ03C,NFCJ03C,NFK03C,F8Q03C,FR03C,::::F03IFK0E03C,F07IFJ03E03C,F07IF7I0FE03C,F0JF7003FE03C,F0FC0071IFC03C,F0FI021FFE003C,F0FJ01FF8003C,F0F80071FFC003C,F0JF71IF003C,F0JF7007FC03C,F07IF2001FE03C,F03IFJ07E03C,F00IFJ01E03C,FP0603C,FR03C,F0JFM03C,F0JF01IFE03C,:::F0078F01E7BE03C,F00F8F01E79E03C,F03F8F01E79E03C,F07IF01E79E03C,F0JF01E79E03C,F0IFE01E79E03C,F0F3FE01CJ03C,F0C1F8M03C,FR03C,FL01IFE03C,F0JF01IFE03C,::F0JF001E3E03C,F0JF001E1E03C,F0F3CF003E1E03C,F0F3CF00FF3C03C,F0F3CF01IFC03C,:F0F3CF01E7FC03C,F0F18F0187F803C,FL0101E003C,FJ0EM03C,FJ0FM03C,FJ0F01IFE03C,:F0JF01IFE03C,:F0JF01EJ03C,::FJ0F01EJ03C,::FR03C,:F0JF01IFCC3C,F0JF71IFEE3C,::F0JF71IFCC3C,FR03C,::F0JFM03C,:::F001FEM03C,F003F8M03C,F00FEN03C,F01FCN03C,F00FEN03C,F003F8M03C,F001FEM03C,F0JFM03C,:::F07FFEM03C,FR03C,:::TFC,:::";

  let logoPonpon =
    "^GFA,533,533,13,J01gFCJ03gFCJ078X01CJ0FY01CI03CY01CI078U0EI01CI0F07ES0EI01C001E0FEW01C001C3C7I0F1CFE7F1C0EI01C001C78380073CFE7F9C0EI01C001FF01C007B8FC7F9C0EI01C001FE01E003F8E073DC0EI01C001FC00E003F0FE73DC0EI01CM07001F0FE7F9C0EI01C8K0C3801E0FC7F9C0EI01CCJ01C1C00E0E07F1C0EI01CE1F800E0E00E0FE771FCEI01CF7F80870F00E0FE739FCEI01CFF1C1C38700E0FE739FCEI01CFE1C0E1C38T01CFC1F0F0E38T01CF87F870E3833N0EI01CF8F38387F837N0EI01CF9E1C1C3F8T01CFFC3E0E3F8F39FC3FBFCE7071CFF87F0F3F8F39FE3FBFEE78F1CFF0F387FF8F39FF3FBFCE78F1CFF1E383FF8F39C738070E7DF1CIFC3C3FF8F39C73F870E7FF1CIF07JF8F39FF3F870E7FF1CIF0KF8F39FE3F870EI71CIF1E3IF8F39FC38070EI71CJFC3IF87F9CE38070E7271CJF07IF87F9CE3F870E7071CIFE0JF83F1C73F870E7071CIFE1JF8T01CJF7JF8T01COF8T01CgKFC::";

  let logoSticker =
    "^GFA,385,385,11,!:ES0!CS0!CS0JF1!C70EE18FEE71F0IFE1!C70EE38FE773F8IFC3!C76EE380EI7B8IF877!C76EE380E7F738IFDE3!C7FEE387E7F738JFC3!C7FEE387EFF738FFCF87!C7FEE380EE7738FFC30E!C79EE7E0EE7738FFC39C7!C79EEFEFE7F738FFE1F87!C70EEFEFE3F738FC71F0!CS0FC3063C!CI0EL01B0FE18778!CS0C71C3E1!CS0E38E1C3!CI0E7EE77E0C061C60C7!CI0EFE677F0C070C007E7CI0E7E770F0C0386007C3CI0E0E7F071C01C7J01CI0E0EFF7F1E00EK01CI0E0EE77F1E007007C,CI0E0EE7073F00300FE,CI0E0EFF7F7300381FE,CI0E0E7F7F73801C78E,CI06040E3E61800FE1E,CI06Q07C3C,CI06S07,CW0E,CV01C,XF8,XF,";

  let logoVitrin =
    "^GFA,292,292,4,JFE,JFC,JF8,IFB,IF18,IF8C,FF98C,FF8CC,FCC7CF,FC670F8,FE360DC,E73E0CE,E3300C6,F1F0063,F9E30318FD870198FF0E0198FF1C6198IF0C398FFE18718FFE70C18FFEE3818IFC7018IF8E018IFDC018JF0018CK018::C7F00218CFF40E18CC04FC18CC01F818CFF4FE18C7F00E18CJ0218CK018CFF1FE18:C331B618C7B1B618CFF19618C9EI018CI0FE18CFF1FE18CFF0FE18CDB07618CDB0F618CDB1FE18CI01C18C03I018C031FE18CFF1FE18CFF1C018C0318018:CK018CFF4FE98CFF5FE98CK018:CFFI018:C1EI018C38I018C1CI018C1FI018CFFI018:CK018:MF8:";

  let logoRDSIS =
    "^GFA,385,385,11,!:ES0!CS0!CS0JF1!C70EE18FEE71F0IFE1!C70EE38FE773F8IFC3!C76EE380EI7B8IF877!C76EE380E7F738IFDE3!C7FEE387E7F738JFC3!C7FEE387EFF738FFCF87!C7FEE380EE7738FFC30E!C79EE7E0EE7738FFC39C7!C79EEFEFE7F738FFE1F87!C70EEFEFE3F738FC71F0!CS0FC3063C!CI0EL01B0FE18778!CS0C71C3E1!CS0E38E1C3!CI0E7EE77E0C061C60C7!CI0EFE677F0C070C007E7CI0E7E770F0C0386007C3CI0E0E7F071C01C7J01CI0E0EFF7F1E00EK01CI0E0EE77F1E007007C,CI0E0EE7073F00300FE,CI0E0EFF7F7300381FE,CI0E0E7F7F73801C78E,CI06040E3E61800FE1E,CI06Q07C3C,CI06S07,CW0E,CV01C,XF8,XF,";

  if (
    mensei == "TÜRKÝYE" ||
    mensei == "TURKÝYE" ||
    mensei == "TÜRKIYE" ||
    mensei == "TURKIYE" ||
    mensei == "TR" ||
    mensei == "TÜRKİYE"
  ) {
    switch (alias) {
      case "RDGONDOL":
        logo = logoRDGondol;
        break;

      case "RDPONPON":
        logo = logoPonpon;
        break;

      case "RDSTICKER":
        logo = logoSticker;
        break;
      case "RDDUZELTME":
        logo = logoSticker;
        break;

      case "RDSTICKERI":
        logo = logoSticker;
        break;

      case "RDVITRIN":
        logo = logoVitrin;
        break;
      case "RDSISD":
        logo = logoRDSIS;
        break;
      case "RDSIS":
        logo = logoRDSIS;
        break;

      case "RDUCGEN":
        logo = logoRDUCGEN;
        break;

      default:
        logo = "^FD";
    }
  }
  content = content.replaceAll("<LOGO>", logo);

  return content;
}

declare global {
  interface String {
    replaceAll(searchValue: string, replaceValue: string): string;
  }
}

String.prototype.replaceAll = function (searchVal, replaceVal) {
  let s = String(this);
  while (s.includes(searchVal)) {
    s = s.replace(searchVal, replaceVal);
  }

  return s;
};

