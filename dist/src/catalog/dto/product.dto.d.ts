export declare class CreateProductDto {
    sku: string;
    name: string;
    categoryId?: number;
    brandId?: number;
    unitId: number;
    barcode?: string;
    description?: string;
    costPrice: number;
    salePrice: number;
    isTaxable: boolean;
    minStock: number;
    image_url?: string;
}
export declare class UpdateProductDto {
    sku?: string;
    name?: string;
    categoryId?: number;
    brandId?: number;
    unitId?: number;
    barcode?: string;
    description?: string;
    costPrice?: number;
    salePrice?: number;
    isTaxable?: boolean;
    minStock?: number;
    image_url?: string;
}
