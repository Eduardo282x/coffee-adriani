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