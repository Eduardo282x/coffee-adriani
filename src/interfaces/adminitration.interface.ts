import { InvoiceItems } from "./invoice.interface";
import { IPayments } from "./payment.interface";
import { IClients } from "./clients.interface";

export interface IExpenses {
    invoices: IExpenseInvoice[];
    summary: ISummary;
    payments: IPayments[];
    paymentsNoAssociated: PaymentsNoAssociated;
}

export interface IExpenseInvoice {
    id: number;
    controlNumber: string;
    dispatchDate: Date | string;
    status: string;
    client: IClients;
    totalAmount: number;
    remaining: number;
    earn: number;
    totalItems: number;
    hasGiftItems: boolean;
    invoiceItems: InvoiceItems[];
}

export interface ISummary {
    totalEarnDay: number;
    totalEarnMonth: number;
    totalEarnRange: number;
    productPercentages: ProductPercentage[];
    quantityProducts: QuantityProducts;
}

export interface QuantityProducts {
    totalEarnMonth: number;
    totalEarnRange: number;
}

export interface ProductPercentage {
    productId: number;
    name: string;
    presentation: string;
    quantity: number;
    percentage: string;
}

export interface PaymentsNoAssociated {
    payments: IPayments[];
    total: number;
}
