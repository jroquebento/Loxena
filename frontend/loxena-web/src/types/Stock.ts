export interface Stock{
    id: string;
    productId: string;
    locationId: string;
    physicalQuantity: number;
    reservedQuantity: number;
    availableQuantity: number
}