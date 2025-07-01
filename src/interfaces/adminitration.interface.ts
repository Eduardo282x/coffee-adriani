import { IInvoice } from "./invoice.interface";
import { IPayments } from "./payment.interface";

export interface IExpenses {
    invoices: IInvoice[];
    payments: IPayments[];
    invoicesEarns: InvoiceEarns;
}

export interface InvoiceEarns {
    dailyData: DailyTotal[];
    resumen: Resumen
}
export interface Resumen {
    totalMonthGain: number;
    productPercentage: ProductSale[];
}


export interface DailyTotal {
    dia: number;
    ganancias: number;
    meta: number;
}

export interface ProductSale {
    name: string;
    percentage: string;
}
