import { IInvoice } from "./invoice.interface";
import { IPayments } from "./payment.interface";
import { IClients } from "./clients.interface";

export interface IExpenses {
    invoicesEarns: InvoicesEarns;
    invoices: IInvoice[];
    payments: IPayments[];
    paymentsNoAssociated: PaymentsNoAssociated;
}

export interface InvoicesEarns {
    productPercentages: ProductPercentage[];
    invoiceEarns: InvoiceEarn[];
    quantityProducts: QuantityProducts;
    totalEarnDay: number;
    totalEarnMonth: number;
    totalEarnRange: number;
}

export interface QuantityProducts {
    totalEarnMonth: number;
    totalEarnRange: number;
}


export interface InvoiceEarn {
    invoiceId: number;
    controlNumber: string;
    client: string | IClients;
    earn: number;
    createdAt: Date;
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
