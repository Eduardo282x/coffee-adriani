import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters";
import { IInventoryEntry, IInventoryEntryDetail, IInventoryEntryPayment } from "@/interfaces/inventory.interface";
import { Edit, Trash2 } from "lucide-react";
import { HiOutlineCash } from "react-icons/hi";

export const enterpriseColumns: IColumns<IInventoryEntry>[] = [
    {
        column: 'controlNumber',
        label: 'Nro Control',
        element: (data: IInventoryEntry) => data.controlNumber,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
        className: () => 'font-semibold text-blue-600'
    },
    {
        column: 'supplier',
        label: 'Proveedor',
        element: (data: IInventoryEntry) => data.supplier?.name || '-',
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'totalAmount',
        label: 'Total ($)',
        element: (data: IInventoryEntry) => `$ ${formatOnlyNumberWithDots(data.totalAmount)}`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
        className: () => 'font-semibold'
    },
    {
        column: 'totalPaid',
        label: 'Pagado ($)',
        element: (data: IInventoryEntry) => `$ ${formatOnlyNumberWithDots(data.totalPaid)}`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
    },
    {
        column: 'remaining',
        label: 'Pendiente ($)',
        element: (data: IInventoryEntry) => `$ ${formatOnlyNumberWithDots(data.remaining)}`,
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
        className: (data: IInventoryEntry) => Number(data.remaining) > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'
    },
    {
        column: 'status',
        label: 'Estado',
        element: (data: IInventoryEntry) => translateStatus(data.status),
        orderBy: '',
        visible: true,
        type: 'string',
        icon: false,
        className: (data: IInventoryEntry) => getStatusClassName(data.status),
    },
        {
        column: 'date',
        label: 'Fecha',
        element: (data: IInventoryEntry) => formatDate(data.date),
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
            { label: 'Ver Pagos', icon: HiOutlineCash, className: 'text-green-600' },
            { label: 'Agregar Pago', icon: HiOutlineCash, className: 'text-blue-600' },
            { label: 'Editar', icon: Edit, className: 'text-[#6f4e37]' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-400' },
        ]
    }
];

const translateStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'CREADA': 'Creada',
        'PENDIENTE': 'Pendiente',
        'PAGADO': 'Pagado',
        'CANCELADA': 'Cancelada'
    };
    return statusMap[status] || status;
}

const getStatusClassName = (status: string): string => {
    const classMap: Record<string, string> = {
        'CREADA': 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800',
        'PENDIENTE': 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800',
        'PAGADO': 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800',
        'CANCELADA': 'rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800'
    };
    return classMap[status] || '';
}

export const enterpriseDetailColumns: IColumns<IInventoryEntryDetail>[] = [
    {
        label: 'Producto',
        column: 'product',
        element: (data: IInventoryEntryDetail) => `${data.product?.name || ''} - ${data.product?.presentation || ''}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: IInventoryEntryDetail) => data.quantity.toString(),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'unitPriceUSD',
        label: 'Precio Unitario ($)',
        element: (data: IInventoryEntryDetail) => `${formatOnlyNumberWithDots(data.unitPriceUSD)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'subtotal',
        label: 'Subtotal ($)',
        element: (data: IInventoryEntryDetail) => `${formatOnlyNumberWithDots(data.subtotal)} $`,
        orderBy: '',
        type: 'string',
        icon: false,
    }
];

export const enterprisePaymentColumns: IColumns<IInventoryEntryPayment>[] = [
    {
        column: 'createdAt',
        label: 'Fecha',
        element: (data: IInventoryEntryPayment) => formatDate(data.createdAt),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Monto',
        element: (data: IInventoryEntryPayment) => `$ ${formatOnlyNumberWithDots(data.amount)}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'accountName',
        label: 'Cuenta',
        element: (data: IInventoryEntryPayment) => data.payment?.account?.name || '-',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'reference',
        label: 'Referencia',
        element: (data: IInventoryEntryPayment) => data.payment?.reference || '-',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'currency',
        label: 'Moneda',
        element: (data: IInventoryEntryPayment) => data.payment?.account?.method?.currency || '-',
        orderBy: '',
        type: 'string',
        icon: false,
    }
];

export interface EnterpriseFilters {
    controlNumber: string;
    supplierId: number | undefined;
}

export const initialEnterpriseFilters: EnterpriseFilters = {
    controlNumber: '',
    supplierId: undefined,
};

export type EnterpriseFilterType = 'controlNumber' | 'supplierId';

export interface EnterpriseItem {
    productId: number;
    productName?: string;
    presentation?: string;
    quantity: number;
    unitPrice: number;
    unitPriceUSD: number;
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
        column: 'quantity',
        label: 'Cantidad',
        element: (data: EnterpriseItem) => `${data.quantity}`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: 'unitPrice',
        label: 'Precio BS',
        element: (data: EnterpriseItem) => `${data.unitPrice}`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: 'unitPriceUSD',
        label: 'Precio USD',
        element: (data: EnterpriseItem) => `${data.unitPriceUSD}`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: 'subtotal',
        label: 'Subtotal ($)',
        element: (data: EnterpriseItem) => data.subtotal ? formatOnlyNumberWithDots(Number(data.subtotal).toFixed(2)) : '0,00',
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
