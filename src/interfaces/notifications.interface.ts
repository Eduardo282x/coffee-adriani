import { IClients } from "./clients.interface";

export interface INotification {
    id: number;
    type: string;
    message: string;
    seen: boolean;
    createdAt: Date;
    Client: IClients;
    clientId: number;
}


export const exampleNotification: INotification[] = [
    {
        id: 1,
        type: "info",
        message: "Nueva orden de compra creada",
        seen: false,
        createdAt: new Date(),
        Client: {
            id: 1,
            name: 'Cliente 2',
            rif: '1',
            address: '1',
            addressSecondary: '1',
            phone: '1',
            zone: '1',
            blockId: 1,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            block: { id: 1, name: 'Block 1', address: 'Address 1' },
        },
        clientId: 1,
    },
    {
        id: 2,
        type: "alert",
        message: "Pago pendiente de aprobación",
        seen: true,
        createdAt: new Date(),
        Client: {
            id: 1,
            name: 'Cliente 1',
            rif: '1',
            address: '1',
            addressSecondary: '1',
            phone: '1',
            zone: '1',
            blockId: 1,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            block: { id: 1, name: 'Block 1', address: 'Address 1' },
        },
        clientId: 2,
    }
];
