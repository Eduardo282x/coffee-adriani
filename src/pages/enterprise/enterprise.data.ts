import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters";
import { IPaymentEnterprise, IPaymentEnterpriseItems } from "@/interfaces/payment.interface";
import { Trash2 } from "lucide-react";
import { HiOutlineCash } from "react-icons/hi";

export const enterpriseColumns: IColumns<IPaymentEnterprise>[] = [
    {
        column: 'controlNumber',
        label: 'Nro Control',
        element: (data: IPaymentEnterprise) => data.controlNumber,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
        className: () => 'font-semibold text-blue-600'
    },
    {
        column: 'description',
        label: 'Descripción',
        element: (data: IPaymentEnterprise) => data.description || '-',
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
        {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: IPaymentEnterprise) => `${formatOnlyNumberWithDots(data.quantity)} unidades`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Monto',
        element: (data: IPaymentEnterprise) => `${formatOnlyNumberWithDots(data.amount)} ${data.currency === 'USD' ? '$' : 'Bs'}`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'dolar',
        label: 'Tasa',
        element: (data: IPaymentEnterprise) => `${formatOnlyNumberWithDots(data.dolar)} Bs`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'total',
        label: 'Total',
        element: (data: IPaymentEnterprise) => `${formatOnlyNumberWithDots(data.total)} $`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'paymentDate',
        label: 'Fecha',
        element: (data: IPaymentEnterprise) => formatDate(data.paymentDate),
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Acción',
        element: () => '',
        orderBy: '',
        visible: true,
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: HiOutlineCash, className: 'text-blue-800' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-400' },
        ]
    }
];

export interface EnterpriseFilters {
    controlNumber: string;
    type: string;
}

export const initialEnterpriseFilters: EnterpriseFilters = {
    controlNumber: '',
    type: 'all',
};

export type EnterpriseFilterType = 'controlNumber' | 'type';

export const defaultEnterpriseFormValues = {
    amount: 0,
    paymentDate: new Date(),
    currency: 'USD',
    description: '',
    controlNumber: '',
    items: []
};

export const currencyOptions = [
    { label: 'Dólares (USD)', value: 'USD' },
    { label: 'Bolívares (BS)', value: 'BS' },
];

export interface EnterpriseItem {
    productId: number;
    productName?: string;
    presentation?: string;
    quantity: number;
    price: number;
    subtotal?: number;
}

export const enterpriseItemColumns: IColumns<EnterpriseItem>[] = [
    {
        column: 'productName',
        label: 'Producto',
        element: (data: EnterpriseItem) => `${data.productName || ''} - ${data.presentation || ''}`,
        orderBy: '',
        type: 'string',
        className: () => 'w-[12rem] block text-ellipsis overflow-hidden'
    },
    {
        column: 'price',
        label: 'Precio',
        element: (data: EnterpriseItem) => `${data.price}`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: EnterpriseItem) => `${data.quantity}`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: 'subtotal',
        label: 'Subtotal',
        element: (data: EnterpriseItem) => data.subtotal ? formatOnlyNumberWithDots(data.subtotal.toFixed(2)) : '0,00',
        orderBy: '',
        type: 'string',
    },
    {
        column: '',
        label: 'Eliminar',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
];

export const enterpriseItemColumnsDetails: IColumns<IPaymentEnterpriseItems>[] = [
    {
        label: 'Producto',
        column: 'name',
        element: (data: IPaymentEnterpriseItems) => `${data.product?.name || ''} - ${data.product?.presentation || ''}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'price',
        label: 'Precio ($)',
        element: (data: EnterpriseItem) => `${formatOnlyNumberWithDots(data.price)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: EnterpriseItem) => data.quantity.toString(),
        orderBy: '',
        type: 'string',
        icon: false,
    }
];