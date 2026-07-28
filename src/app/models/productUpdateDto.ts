export interface ProductUpdateDto{
    id: number;
    name: string;
    categoryId: number;
    description: string;
    price: number;
    status?: string;
}