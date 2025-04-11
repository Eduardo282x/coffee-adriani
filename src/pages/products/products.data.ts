import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { IProducts } from "@/interfaces/product.interface";
import { Edit, Trash2 } from "lucide-react";

export const productsColumns: IColumns<IProducts>[] = [
    {
        label: 'Nombre',
        column: 'name',
        element: (data: IProducts) => data.name,
        orderBy: '',
        icon: false,
    },
    {
        column: 'presentation',
        label: 'Presentación',
        element: (data: IProducts) => data.presentation,
        orderBy: '',
        icon: false,
    },
    {
        column: 'price',
        label: 'Precio Referencia (Bs)',
        element: (data: IProducts) => formatNumberWithDots(data.price, '', ' $'),
        orderBy: '',
        icon: false,
    },
    {
        column: 'priceBs',
        label: 'Precio (Bs)',
        element: (data: IProducts) => formatNumberWithDots(data.priceBs, '', ' Bs'),
        orderBy: '',
        icon: false,
    },
    {
        column: 'priceUSD',
        label: 'Precio ($)',
        element: (data: IProducts) => formatNumberWithDots(data.priceUSD, '', ' $'),
        orderBy: '',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Cantidad',
        element: (data: IProducts) => data.amount.toString(),
        orderBy: '',
        icon: false,
    },
    {
        column: 'createdAt',
        label: 'Fecha Registro',
        element: (data: IProducts) => formatDate(data.createdAt),
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

export interface IProductsForm {
    id?: number;
    name: string;
    presentation: string;
    price: number;
    priceUSD: number;
    amount: number;
}

// export type TypesProductsForm = 'name' | 'rif' | 'address' | 'phone' | 'zone' | 'blockId';

export const defaultValues: IProductsForm = {
    name: '',
    presentation: '',
    price: 0,
    priceUSD: 0,
    amount: 0,
}