import { IOptions } from "./form.interface";

export interface BodyClients {
    name: string;
    rif: string;
    address: string;
    phone: string;
    zone: string;
    blockId: number;
}

export interface BodyBlock {
    name: string;
    address: string;
}

export interface BodyReport {
    zone: string;
    blockId: number;
    status: string;
}

export interface GroupClientsOptions {
    allClients: IClients[];
    clients: IOptions[];
}
export interface GroupClients {
    allClients: IClients[];
    clients: IClients[];
    clientsFilter: IClients[];
}

export interface IClients {
    id: number;
    name: string;
    rif: string;
    address: string;
    phone: string;
    zone: string;
    blockId: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    block: Block;
}

export interface GroupBlock {
    allBlocks: Block[]
    blocks: Block[]
}

export interface Block {
    id: number;
    name: string;
    address: string;
}
