declare class PurchaseItemDto {
    productId: number;
    qty: number;
    unitCost: number;
    taxRate?: number;
}
export declare class CreatePurchaseDto {
    supplierId: number;
    invoiceNumber?: string;
    purchaseDate?: string;
    items: PurchaseItemDto[];
}
export {};
