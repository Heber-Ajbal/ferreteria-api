import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { SetItemDto } from './dto/set-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
export declare class SalesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createOrGetCart(userId: number, dto: CreateCartDto): Promise<{
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
    getMyCart(userId: number): Promise<{
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
    addItem(userId: number, dto: AddItemDto): Promise<{
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
    setItem(userId: number, dto: SetItemDto): Promise<{
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
    removeItem(userId: number, productId: number): Promise<{
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
    checkout(userId: number, _dto: CheckoutDto): Promise<{
        saleId: number;
        status: import("@prisma/client").$Enums.sales_status;
        total: number;
    }>;
    private ensureCart;
    private getCartById;
    private recalcTotals;
}
