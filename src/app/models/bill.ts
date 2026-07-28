export interface BillGenerateRequest{
    name: string,
    email: string,
    contactNumber: string,
    paymentMethod: string,
    total: string,
    isGenerate: boolean,
    productDetails: string,
    uuid: string
}

export interface Bill{
    id: number,
    uuid: string,
    name: string,
    email: string,
    contactNumber: string,
    paymentMethod: string,
    total: string,
    createdBy: string,
    productDetails: string
}