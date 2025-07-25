import { IInvoice } from "./invoice.interface";

export interface GroupPayments {
    allPayments: IPayments[];
    payments: IPayments[];
    paymentsFilter: IPayments[];
}

export interface PaymentAPI extends TotalPay {
    payments: IPayments[];
}

export interface TotalPay {
    totalBs: number;
    totalUSD: number;
}

export interface IPayments {
    id: number;
    amount: string;
    remainingUSD: string;
    remaining: string;
    accountId: number;
    reference: string;
    dolarId: number;
    paymentDate: Date;
    associated: boolean;
    credit: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    dolar: Dolar;
    account: Account;
    amountUSD: string;
    amountBs: string;
    InvoicePayment: InvoicePayment[];
}

export interface InvoicePayment {
    id: number;
    invoiceId: number;
    paymentId: number;
    amount: string;
    invoice: IInvoice;
    createdAt: Date;
}

export interface Account {
    id: number;
    name: string;
    bank: string;
    methodId: number;
    createdAt: Date;
    updatedAt: Date;
    method: Method;
}

export interface Method {
    id: number;
    name: string;
    currency: string;
}

export interface Dolar {
    id: number;
    dolar: string;
    date: Date;
}



export interface IBank {
    bank: string
}

export interface IPaymentForm {
    amount: number;
    reference: string;
    time?: string;
    accountId: number;
}

export interface AssociatePayInvoice {
    invoice: string;
}

export interface IPayInvoiceForm {
    paymentId: number;
    details: IPayInvoiceFormDetails[];
}

export interface IPayInvoiceFormDetails {
    invoiceId: number;
    amount: number;
}

export interface PayDisassociateBody {
    paymentId: number;
    invoiceId: number;
    id: number;
}


export interface GroupAccounts {
    accounts: AccountPay[]
    allAccounts: AccountPay[]
}
export interface AccountPay {
    id: number;
    name: string;
    bank: string;
    methodId: number;
    createdAt: Date;
    updatedAt: Date;
    method: Method;
}

export interface Method {
    id: number;
    name: string;
    currency: string;
}
