export enum TaskState {
  GorevIadeHataliAtama = 0,
  GörevIadeMTCozmeli = 1,
  GörevIadeYetersizBilgiEksikIcerik = 2,
  TamamlandiOK = 3,
  BeklemeyeAlindi = 7,
}

export const CrmTaskStateArray = [
  { id: 3, text: "Tamamlandı OK" },
  { id: 0, text: "Hatalı Atama" },
  { id: 1, text: "Müşteri Temsilcisi Çözmeli" },
  { id: 2, text: "Eksik veya Yetersiz Bilgi" },
  { id: 7, text: "Beklemeye Alındı" },
];

export function GetCrmStateText(taskState: any) {
  switch (taskState) {
    case -1:
      return "Yeni Kayıt";
    case Number(TaskState.GorevIadeHataliAtama):
      return "Hatali Atama";
    case Number(TaskState.GörevIadeMTCozmeli):
      return "Müşteri Temsilcisi Çözmeli";
    case Number(TaskState.GörevIadeYetersizBilgiEksikIcerik):
      return "Eksik veya Yetersiz Bilgi";
    case Number(TaskState.TamamlandiOK):
      return "Tamamlandı - OK";
    case Number(TaskState.BeklemeyeAlindi):
      return "Beklemeye Alındı";
  }
}

export const ReasonForHolding = [
  { id: 1, text: "Kargo / Lojistik Kaynaklı" },
  { id: 2, text: "Depo Kaynaklı" },
  { id: 3, text: "IT Kaynaklı" },
  { id: 4, text: "Mağaza Kaynaklı" },
];
