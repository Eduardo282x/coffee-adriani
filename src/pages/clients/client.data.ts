import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { Block, IClients } from "@/interfaces/clients.interface";
import { IOptions } from "@/interfaces/form.interface";
import { Edit, Trash2 } from "lucide-react";

export const clientsColumns: IColumns<IClients>[] = [
    {
        label: 'Cliente',
        column: 'name',
        element: (data: IClients) => data.name,
        orderBy: '',
        type: 'string',
        visible: true,
        icon: false,
    },
    {
        column: 'address',
        label: 'Dirección',
        element: (data: IClients) => data.address,
        className: () => 'max-w-[12rem] block text-ellipsis',
        orderBy: '',
        type: 'string',
        visible: true,
        icon: false,
    },
    {
        column: 'addressSecondary',
        label: 'Dirección Secundaria',
        element: (data: IClients) => data.addressSecondary ? data.addressSecondary : '-',
        className: () => 'max-w-[12rem] block text-ellipsis',
        orderBy: '',
        type: 'string',
        visible: false,
        icon: false,
    },
    {
        column: 'rif',
        label: 'Rif',
        element: (data: IClients) => data.rif ? formatNumberWithDots(data.rif, '', '', true) : '-',
        orderBy: '',
        type: 'string',
        visible: true,
        icon: false,
    },
    {
        column: 'phone',
        label: 'Teléfono',
        element: (data: IClients) => data.phone,
        orderBy: '',
        type: 'string',
        visible: true,
        icon: false,
    },
    {
        column: 'zone',
        label: 'Zona',
        element: (data: IClients) => data.zone,
        orderBy: '',
        type: 'string',
        visible: false,
        icon: false,
    },
    {
        column: 'block.name',
        label: 'Bloque',
        element: (data: IClients) => data.block ? data.block.name : '-',
        orderBy: '',
        type: 'string',
        visible: true,
        icon: false,
    },
    {
        column: 'createdAt',
        label: 'Fecha Registro',
        element: (data: IClients) => formatDate(data.createdAt),
        orderBy: '',
        type: 'string',
        visible: false,
        icon: false,
    },
    {
        column: '',
        label: 'Acciones',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        visible: true,
        optionActions: [
            { label: 'Editar', icon: Edit, className: '' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
];

export const blockColumns: IColumns<Block>[] = [
    {
        label: 'Bloque',
        column: 'name',
        element: (data: Block) => data.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'address',
        label: 'Dirección',
        element: (data: Block) => data.address,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Acciones',
        element: () => '',
        orderBy: '',
        type: 'string',
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
    addressSecondary: string;
    phone: string;
    zone: string;
    blockId: string | number;
}

export type TypesClientsForm = 'name' | 'rif' | 'address' | 'phone' | 'zone' | 'blockId';

export const defaultValues: IClientsForm = {
    name: '',
    rif: '',
    address: '',
    addressSecondary: '',
    phone: '',
    zone: '',
    blockId: ''
}