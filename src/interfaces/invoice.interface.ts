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

export interface Statistics {
    package: number;
    packagePaid: number;
    packagePending: number;
    packagePaidUSD: number;
    packagePaidBS: number;
    packagePendingUSD: number;
    packagePendingBS: number;
    detPackage: DetPackage[];
    payments: Payments;
    summary: Summary;
}

export interface DetPackage {
    productId: number;
    product: string;
    totalQuantity: number;
    paidQuantity: number;
    pendingQuantity: number;
    paidQuantityUSD: number;
    paidQuantityBS: number;
    pendingQuantityUSD: number;
    pendingQuantityBS: number;
}

export interface Payments {
    total: number;
    totalPending: number;
    totalPaid: number;
    debt: number;
    remaining: number;
}

export interface Summary {
    invoiceCount: number;
    averageInvoiceValue: number;
    paymentPercentage: number;
}


export interface InvoiceAPINew {
    invoices: InvoiceAPINewInvoice[];
    pagination: Pagination;
}

export interface InvoiceAPINewInvoice {
    client: IClients;
    invoices: InvoiceInvoice[];
}

export interface InvoiceInvoice {
    id: number;
    clientId: number;
    dispatchDate: Date;
    dueDate: Date;
    controlNumber: string;
    exchangeRate: null;
    sellerId: null;
    totalAmount: string;
    remaining: string;
    consignment: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    invoiceItems: InvoiceItems[];
    InvoicePayment: IInvoicePayment[];
}

export interface Pagination {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
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

export interface DetailsInvoices extends BodyInventory {
    productId: number;
    quantity: number;
    price: number;
    priceUSD: number;
}

export interface DateRangeFilter {
    startDate: Date;
    endDate: Date;
}
