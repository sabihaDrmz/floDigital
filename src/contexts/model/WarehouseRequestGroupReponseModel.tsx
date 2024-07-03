export interface WarehouseRequestGroupReponseModel {
    basketKey: string
    warehouseRequests: WarehouseRequestGroupModel[]
}

export interface WarehouseRequestGroupModel {
    isDigitalStore: boolean
    isSalesPersonRequest: boolean
    barcode: string
    sku: string
    parentSku: any
    color: string
    size: string
    model: string
    requestPerson: string
    requestPersonName: string
    store: string
    source: string
    requestNote?: string
    productState: number
    status: number
    cancelReason: any
    completeNote: any
    completePerson: string
    completePersonName: any
    whId: number
    unitQr: string
    id: number
    createDate: string
    image: string;
}