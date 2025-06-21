import { IInvoice } from "./invoice.interface";
import { IPayments } from "./payment.interface";

export interface IExpenses {
    invoices: IInvoice[];
    payments: IPayments[];
}

