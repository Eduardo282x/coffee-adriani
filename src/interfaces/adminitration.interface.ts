import { IInvoice } from "./invoice.interface";
import { IPayments } from "./payment.interface";

export interface IExpenses {
    invoicesEarns:        InvoicesEarns;
    invoices:             IInvoice[];
    payments:             IPayments[];
    paymentsNoAssociated: PaymentsNoAssociated;
}

export interface InvoicesEarns {
    productPercentages: ProductPercentage[];
    invoiceEarns:       InvoiceEarn[];
    totalEarnDay:       number;
    totalEarnMonth:     number;
}

export interface InvoiceEarn {
    invoiceId:     number;
    controlNumber: string;
    client:        string;
    earn:          number;
    createdAt:     Date;
}

export interface ProductPercentage {
    productId:  number;
    name:       string;
    quantity:   number;
    percentage: string;
}

export interface PaymentsNoAssociated {
    payments: IPayments[];
    total:    number;
}
