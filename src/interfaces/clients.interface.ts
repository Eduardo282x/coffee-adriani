export interface BodyClients {
    name: string;
    rif: string;
    address: string;
    phone: string;
    zone: string;
    blockId: number;
}

export interface BodyBlock {
    name:    string;
    address: string;
}

export interface GroupClients {
    allClients: IClients[];
    clients: IClients[];
    clientsFilter: IClients[];
}

export interface IClients {
    id:        number;
    name:      string;
    rif:       string;
    address:   string;
    phone:     string;
    zone:      string;
    blockId:   number;
    active:    boolean;
    createdAt: Date;
    updatedAt: Date;
    block:     Block;
}

export interface Block {
    id:      number;
    name:    string;
    address: string;
}
