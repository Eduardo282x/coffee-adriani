import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters";
import { IProducts } from "@/interfaces/product.interface";
import { Edit, Trash2 } from "lucide-react";

export const productsColumns: IColumns<IProducts>[] = [
    {
        label: 'Producto',
        column: 'name',
        element: (data: IProducts) => `${data.name} - ${data.presentation}`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    // {
    //     column: 'presentation',
    //     label: 'Presentación',
    //     element: (data: IProducts) => data.presentation,
    //     orderBy: '',
    //     visible: true,
    //     type: 'string',
    //     icon: false,
    // },
    {
        column: 'purchasePriceUSD',
        label: 'Precio Compra ($)',
        element: (data: IProducts) => `${formatOnlyNumberWithDots(data.purchasePriceUSD)}$`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'purchasePrice',
        label: 'Precio Compra (Bs)',
        element: (data: IProducts) => `${formatOnlyNumberWithDots(data.purchasePrice)}$`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'priceUSD',
        label: 'Precio ($)',
        element: (data: IProducts) => `${formatOnlyNumberWithDots(data.priceUSD)}$`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'price',
        label: 'Precio',
        element: (data: IProducts) => `${formatOnlyNumberWithDots(data.price)}$`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    // {
    //     column: 'priceBs',
    //     label: 'Precio (Bs)',
    //     element: (data: IProducts) => formatOnlyNumberWithDots(data.priceBs, '', ' Bs'),
    //     orderBy: '',
    // visible: true,
    //     type: 'string',
    //     icon: false,
    // },
    {
        column: 'type',
        label: 'Tipo',
        element: (data: IProducts) => data.type,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Cantidad',
        element: (data: IProducts) => data.amount.toString(),
        orderBy: '',
        visible: false,
        type: 'string',
        icon: false,
    },
    {
        column: 'createdAt',
        label: 'Fecha Registro',
        element: (data: IProducts) => formatDate(data.createdAt),
        orderBy: '',
        visible: false,
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Acciones',
        element: () => '',
        orderBy: '',
        visible: true,
        type: 'string',
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
    purchasePrice: number;
    purchasePriceUSD: number;
    amount: number;
    type: string;
}

// export type TypesProductsForm = 'name' | 'rif' | 'address' | 'phone' | 'zone' | 'blockId';

export const defaultValues: IProductsForm = {
    name: '',
    presentation: '',
    price: 0,
    priceUSD: 0,
    purchasePrice: 0,
    purchasePriceUSD: 0,
    amount: 0,
    type: 'Cafe',
}

export interface FormDataProduct {
    label: string;
    type: string;
    name: KeysFormProducts;
}

type KeysFormProducts = 'name' | 'presentation' | 'price' | 'priceUSD' | 'purchasePrice' | 'purchasePriceUSD' | 'amount' | 'type';

export const formDataProduct: FormDataProduct[] = [
    {
        label: 'Nombre',
        type: 'text',
        name: 'name'
    },
    {
        label: 'Presentación',
        type: 'text',
        name: 'presentation'
    },
    {
        label: 'Precio de Compra (Bs)',
        type: 'text',
        name: 'purchasePrice'
    },
    {
        label: 'Precio de Compra ($)',
        type: 'text',
        name: 'purchasePriceUSD'
    },
    {
        label: 'Precio',
        type: 'text',
        name: 'price'
    },
    {
        label: 'Precio USD',
        type: 'text',
        name: 'priceUSD'
    },
    {
        label: 'Cantidad',
        type: 'text',
        name: 'amount'
    },
    {
        label: 'Tipo',
        type: 'text',
        name: 'type'
    },
]