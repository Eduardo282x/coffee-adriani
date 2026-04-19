import { IClients } from "./clients.interface";

export interface IDashboard {
    invoices: Invoices;
    inventory: Inventory;
    lastPending: LastPending[];
}

export interface Inventory {
    products: LowStock[];
    lowStock: LowStock[];
}

export interface LowStock {
    id: number;
    name: string;
    amount: number;
    percent: number;
}

export interface Invoices {
    total: number;
    totalClients: number;
    payed: Pagadas;
    expired: Pagadas;
    pending: Pagadas;
}

export interface Pagadas {
    amount: number;
    percent: number;
}

export interface LastPending {
    id: number;
    clientId: number;
    dispatchDate: Date;
    dueDate: Date;
    controlNumber: string;
    exchangeRate: null;
    sellerId: null;
    totalAmount: string;
    remaining: string;
    consignment: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    client: IClients;
}

export interface ClientDemand {
    topClients: ResumenTopClient[];
    buckets: Buckets;
    summary: SummaryClientDemand[];
    // totalClientsConsidered: number;
    totalInvoices: number;
}


export interface SummaryClientDemand {
    range: keyof Buckets;
    count: number;
}
export interface Buckets {
    "1-10": ResumenTopClient[];
    "11-20": ResumenTopClient[];
    "21-30": ResumenTopClient[];
    "31-40": ResumenTopClient[];
    "41-50": ResumenTopClient[];
    "51-60": ResumenTopClient[];
    "61-70": ResumenTopClient[];
    "71-80": ResumenTopClient[];
    "81-90": ResumenTopClient[];
    "91-100": ResumenTopClient[];
    "101+": ResumenTopClient[];
}

export interface TopClient {
    clientId: number;
    clientName: string;
    invoicesCount: number;
    totalItems: number;
    totalAmount: number;
}

export interface ResumenTopClient {
    clientName:    string;
    clientBlock:   string;
    invoicesCount: number;
    invoices:      Invoice[];
}

export interface Invoice {
    controlNumber: string;
    dispatchDate:  Date;
    status:        string;
    totalElements: number;
}

