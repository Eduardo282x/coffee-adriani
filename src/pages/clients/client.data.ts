import { IColumns } from "@/components/table/table.interface";
import { formatDate } from "@/hooks/formaters";
import { IClients } from "@/interfaces/clients.interface";
import { IOptions } from "@/interfaces/form.interface";
import { Edit, Trash2 } from "lucide-react";

export const clientsColumns: IColumns<IClients>[] = [
    {
        label: 'Cliente',
        column: 'name',
        element: (data: IClients) => data.name,
        orderBy: '',
        icon: false,
    },
    {
        column: 'rif',
        label: 'Rif',
        element: (data: IClients) => data.rif,
        orderBy: '',
        icon: false,
    },
    {
        column: 'address',
        label: 'Dirección',
        element: (data: IClients) => data.address,
        orderBy: '',
        icon: false,
    },
    {
        column: 'phone',
        label: 'Teléfono',
        element: (data: IClients) => data.phone,
        orderBy: '',
        icon: false,
    },
    {
        column: 'zone',
        label: 'Zona',
        element: (data: IClients) => data.zone,
        orderBy: '',
        icon: false,
    },
    {
        column: 'blockId',
        label: 'Bloque',
        element: (data: IClients) => data.block.name,
        orderBy: '',
        icon: false,
    },
    {
        column: 'createdAt',
        label: 'Fecha Registro',
        element: (data: IClients) => formatDate(data.createdAt),
        orderBy: '',
        icon: false,
    },
    {
        column: '',
        label: 'Acciones',
        element: () => '',
        orderBy: '',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: Edit, className: '' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
];

export const clientsZones: IOptions[] = [
    {
        label: 'Zona Norte',
        value: 'Zona Norte'
    },
    {
        label: 'Zona Sur',
        value: 'Zona Sur'
    },
    {
        label: 'Zona Este',
        value: 'Zona Este'
    },
    {
        label: 'Zona Oeste',
        value: 'Zona Oeste'
    }
];

export const phoneOptions: IOptions[] = [
    { label: '0412', value: '0412' },
    { label: '0414', value: '0414' },
    { label: '0424', value: '0424' },
    { label: '0416', value: '0416' },
    { label: '0426', value: '0426' },
]

export const rifOptions: IOptions[] = [
    { label: 'V', value: 'V' },
    { label: 'E', value: 'E' },
    { label: 'J', value: 'J' },
    { label: 'G', value: 'G' },
    { label: 'R', value: 'R' },
    { label: 'P', value: 'P' },
]


export interface IClientsForm {
    id?: number;
    name: string;
    rif: string;
    address: string;
    phone: string;
    zone: string;
    blockId: string;
}

export type TypesClientsForm = 'name' | 'rif' | 'address' | 'phone' | 'zone' | 'blockId';

export const defaultValues: IClientsForm = {
    name: '',
    rif: '',
    address: '',
    phone: '',
    zone: '',
    blockId: ''
}