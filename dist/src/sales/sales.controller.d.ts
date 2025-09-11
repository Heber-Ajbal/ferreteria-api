import { SalesService } from './sales.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { SetItemDto } from './dto/set-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
export declare class SalesController {
    private readonly sales;
    constructor(sales: SalesService);
    createOrGetCart(req: any, dto: CreateCartDto): Promise<{
        saleId: number;
        status: import("@prisma/client").$Enums.sales_status;
        taxRate: number;
        items: {
            productId: number;
            name: string;
            qty: number;
            unitPrice: number;
            discountAmt: number;
            lineTotal: number;
        }[];
        subtotal: number;
        taxAmount: number;
        discountTotal: number;
    }>;
    getMyCart(req: any): Promise<{
        saleId: number;
        status: import("@prisma/client").$Enums.sales_status;
        taxRate: number;
        items: {
            productId: number;
            name: string;
            qty: number;
            unitPrice: number;
            discountAmt: number;
            lineTotal: number;
        }[];
        subtotal: number;
        taxAmount: number;
        discountTotal: number;
    } | {
        saleId: null;
        status: string;
        items: never[];
        subtotal: number;
        taxAmount: number;
        total: number;
    }>;
    addItem(req: any, dto: AddItemDto): Promise<{
        saleId: number;
        status: import("@prisma/client").$Enums.sales_status;
        taxRate: number;
        items: {
            productId: number;
            name: string;
            qty: number;
            unitPrice: number;
            discountAmt: number;
            lineTotal: number;
        }[];
        subtotal: number;
        taxAmount: number;
        discountTotal: number;
    }>;
    setItem(req: any, dto: SetItemDto): Promise<{
        saleId: number;
        status: import("@prisma/client").$Enums.sales_status;
        taxRate: number;
        items: {
            productId: number;
            name: string;
            qty: number;
            unitPrice: number;
            discountAmt: number;
            lineTotal: number;
        }[];
        subtotal: number;
        taxAmount: number;
        discountTotal: number;
    }>;
    removeItem(req: any, productId: number): Promise<{
        saleId: number;
        status: import("@prisma/client").$Enums.sales_status;
        taxRate: number;
        items: {
            productId: number;
            name: string;
            qty: number;
            unitPrice: number;
            discountAmt: number;
            lineTotal: number;
        }[];
        subtotal: number;
        taxAmount: number;
        discountTotal: number;
    }>;
    checkout(req: any, dto: CheckoutDto): Promise<{
        saleId: number;
        status: import("@prisma/client").$Enums.sales_status;
        total: number;
    }>;
}
