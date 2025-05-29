import { IColumns } from "@/components/table/table.interface";
import { AccountPay } from "@/interfaces/payment.interface";
import { Edit, Trash2 } from "lucide-react";

export const accountsColumns: IColumns<AccountPay>[] = [
    {
        label: 'Nombre',
        column: 'name',
        element: (data: AccountPay) => data.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'bank',
        label: 'Banco',
        element: (data: AccountPay) => data.bank,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'method.name',
        label: 'Tipo',
        element: (data: AccountPay) => data.method.name,
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


export interface AccountForm {
    id?: number;
    name: string;
    bank: string;
    methodId: number;
}

export const defaultValues: AccountForm = {
    name: '',
    bank: '',
    methodId: 0,
}