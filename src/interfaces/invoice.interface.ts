import { IClients } from "./clients.interface";
import { BodyInventory } from "./inventory.interface";
import { IProducts } from "./product.interface";

export interface GroupInvoices {
    allInvoices: InvoiceApi[];
    invoices: InvoiceApi[];
    invoicesFilter: InvoiceApi[];
}

export interface InvoiceApi {
    client: IClients;
    invoices: IInvoice[];
}

export interface IInvoice {
    id: number;
    clientId: number;
    dispatchDate: Date;
    dueDate: Date;
    controlNumber: string;
    exchangeRate: null;
    totalAmount: number;
    consignment: boolean;
    status: string;
    statusPay: string;
    createdAt: Date;
    updatedAt: Date;
    payments: Payments[];
    client?: IClients;
    invoiceItems: InvoiceItems[]
}

export interface Payments {
    id: number;
    invoiceId: number;
    amount: number;
    methodId: number;
    exchangeRate: null;
    paymentDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InvoiceItems {
    id: number;
    invoiceId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: IProducts;
}

export interface IInvoiceForm {
    clientId: number;
    controlNumber: string;
    consignment: boolean;
    priceUSD: boolean;
    dueDate: Date;
    details: BodyInventory[];
}

export interface IInvoiceFilter {
    startDate: Date;
    endDate: Date;
}
