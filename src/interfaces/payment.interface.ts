
export interface GroupPayments {
    allPayments: IPayments[];
    payments: IPayments[];
    paymentsFilter: IPayments[];
}


export interface IPayments {
    id:          number;
    amount:      string;
    currency:    string;
    reference:   string;
    bank:        string;
    dolarId:     number;
    methodId:    number;
    paymentDate: Date;
    status:      string;
    createdAt:   Date;
    updatedAt:   Date;
    method:      Method;
    dolar:       Dolar;
    amountUSD:   string;
    amountBs:    string;
}

export interface Dolar {
    id:    number;
    dolar: string;
    date:  Date;
}

export interface Method {
    id:   number;
    name: string;
    currency: string;
}

export interface IBank {
    bank: string
}

export interface IPaymentForm {
    amount: number;
    currency: string;
    reference: string;
    bank: string;
    methodId: number;
}
