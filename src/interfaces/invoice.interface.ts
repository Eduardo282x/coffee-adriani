import { IClients } from "./clients.interface";
import { BodyInventory } from "./inventory.interface";
import { IPayments } from "./payment.interface";
import { IProducts } from "./product.interface";

export interface GroupInvoices {
    allInvoices: InvoiceApi[];
    invoices: InvoiceApi[];
    invoicesFilter: InvoiceApi[];
}

export interface PaymentsInvoices {
    total: number;
    remaining: number;
    debt: number;
    totalPending: number;
}

export interface NewInvoiceApiPackage {
    invoices: InvoiceApi[];
    package: number;
    detPackage: DetPackage[];
    payments: PaymentsInvoices;
}
export interface DetPackage {
    product: IProducts;
    totalQuantity: number;
    paidQuantity: number;
    total: number;
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
    remaining: number | string;
    totalAmountBs: number | string;
    consignment: boolean;
    status: InvoiceStatus;
    createdAt: Date;
    updatedAt: Date;
    payments: Payments[];
    client?: IClients;
    invoiceItems: InvoiceItems[];
    InvoicePayment: IInvoicePayment[];
    amountPayed: number | string;
    createdAtPayed: Date;
}

export type InvoiceStatus =
    'all' |
    'Creada' |
    'Pendiente' |
    'Pagado' |
    'Abonadas' |
    'Vencida' |
    'Cancelada'

export interface IInvoicePayment {
    id: number;
    invoiceId: number;
    paymentId: number;
    payment: IPayments;
    amount: string;
    createdAt: Date;
}


export interface IInvoiceForPay extends IInvoice {
    totalPaid: number | string;
    totalAmountBs: number | string;
    currency: string;
    specialPrice: string | number;
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
    unitPriceUSD: number;
    subtotal: number;
    type: TypeDetailsProductInvoices;
    product: IProducts;
}

export type TypeDetailsProductInvoices = 'SALE' | 'GIFT';
export interface IInvoiceForm {
    clientId: number;
    controlNumber: string;
    consignment: boolean;
    priceUSD: boolean;
    dueDate: Date;
    details: DetailsInvoices[];
}

export interface DetailsInvoices extends BodyInventory{
    productId: number;
    quantity: number;
    price: number;
    priceUSD: number;
}

export interface DateRangeFilter {
    startDate: Date;
    endDate: Date;
}
