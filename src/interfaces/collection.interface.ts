import { IClients } from "./clients.interface";
import { IInvoice } from "./invoice.interface";

export interface CollectionBody {
    messageId: number;
    send: boolean;
}
export interface MarkBody {
    send: boolean;
}
export interface CollectionMessageBody {
    title: string;
    content: string;
}

export interface GroupCollection {
    allCollections: ICollection[],
    collections: ICollection[],
}

export interface GroupMessages {
    allMessages: IMessages[],
    messages: IMessages[],
}

export interface IMessages {
    id:        number;
    title:     string;
    content:   string;
    createdAt: Date;
    updatedAt: Date;
}


export interface ICollection {
    id: number;
    clientId: number;
    messageId: number;
    send: boolean;
    sentAt: null;
    createdAt: Date;
    client: IClients;
    message: Message;
    invoices: IInvoice[];
    total: number;
}

export interface Message {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
