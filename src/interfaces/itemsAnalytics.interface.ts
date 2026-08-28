export interface ItemsAnalyticsResponse {
    type: string;
    startDate: string;
    endDate: string;
    totals: ItemsTotals;
    generalItems: ItemsGeneral;
    daily: ItemsDaily[];
    invoices: ItemsInvoice[];
}

export interface ItemsGeneral {
    totalItems: number;
    totalAmount: number;
    detailItems: ItemsDetail[];
}

export interface ItemsTotals {
    totalItems: number;
    totalAmount: number;
    totalInvoices: number;
    totalPayments: number;
}

export interface ItemsDaily {
    date: string;
    day: string;
    totalItems: number;
    totalAmount: number;
    detailItems: ItemsDetail[];
}

export interface ItemsDetail {
    product: string;
    totalElements: number;
    unitPrice: number;
    totalAmount: number;
}

export interface ItemsInvoice {
    controlNumber: string;
    client: string;
    block: string;
    status: string;
    dispatchDate: string;
    dueDate: string;
    totalBultos: number;
    totalAmount: number;
    remaining: number;
}