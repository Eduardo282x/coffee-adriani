import { IInvoice } from "./invoice.interface";

export interface GroupPayments {
    allPayments: IPayments[];
    payments: IPayments[];
    paymentsFilter: IPayments[];
}

export interface IPayments {
    id: number;
    invoiceId: number;
    amount: number;
    methodId: number;
    method: IPaymentMethods
    exchangeRate: null;
    paymentDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    invoice: IInvoice;
}

export interface IPaymentForm {
    invoiceId: number
    amount: number
    methodId: number
}

export interface IPaymentMethods {
    id: number;
    name: string;
}
