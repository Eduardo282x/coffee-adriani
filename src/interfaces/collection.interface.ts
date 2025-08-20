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
export interface GroupCollectionHistory {
    allCollections: ICollectionHistory[],
    collections: ICollectionHistory[],
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

export interface ICollectionHistory {
    id: number;
    send: boolean;
    sentAt: Date | null;
    createdAt: Date;
    description: string;
    sended: boolean;
    clientId: number;
    client: IClients; 
    messageId: number;
    message: Message;
}

export interface Message {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
