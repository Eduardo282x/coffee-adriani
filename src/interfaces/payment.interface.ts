
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
    remaining: string;
    accountId: number;
    reference: string;
    dolarId: number;
    paymentDate: Date;
    associated: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    dolar: Dolar;
    account: Account;
    amountUSD: string;
    amountBs: string;
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
