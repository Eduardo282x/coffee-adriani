import { IColumns } from "@/components/table/table.interface"
import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters"
import { ItemsDaily, ItemsDetail, ItemsInvoice } from "@/interfaces/itemsAnalytics.interface"
import { getBadgeVariant } from "../invoices/invoices.data"

export const dailyItemsColumns: IColumns<ItemsDaily>[] = [
    {
        column: 'date',
        label: 'Fecha',
        element: (data: ItemsDaily) => formatDate(data.date),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'day',
        label: 'Día',
        element: (data: ItemsDaily) => data.day,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalItems',
        label: 'Bultos',
        element: (data: ItemsDaily) => formatOnlyNumberWithDots(data.totalItems),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalAmount',
        label: 'Monto',
        element: (data: ItemsDaily) => `${formatOnlyNumberWithDots(data.totalAmount)} $`,
        orderBy: '',
        type: 'string',
    },
];

export const detailItemsColumns: IColumns<ItemsDetail>[] = [
    {
        column: 'product',
        label: 'Producto',
        element: (data: ItemsDetail) => data.product,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalElements',
        label: 'Elementos',
        element: (data: ItemsDetail) => formatOnlyNumberWithDots(data.totalElements),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'unitPrice',
        label: 'Precio Unitario',
        element: (data: ItemsDetail) => `${formatOnlyNumberWithDots(data.unitPrice)} $`,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalAmount',
        label: 'Total',
        element: (data: ItemsDetail) => `${formatOnlyNumberWithDots(data.totalAmount)} $`,
        orderBy: '',
        type: 'string',
    },
];

export const analyticsInvoiceColumns: IColumns<ItemsInvoice>[] = [
    {
        column: 'controlNumber',
        label: 'N° Factura',
        element: (data: ItemsInvoice) => data.controlNumber,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'client',
        label: 'Cliente',
        element: (data: ItemsInvoice) => data.client,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'block',
        label: 'Bloque',
        element: (data: ItemsInvoice) => data.block,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'status',
        label: 'Estado',
        element: (data: ItemsInvoice) => data.status,
        orderBy: '',
        type: 'string',
        className: (data: ItemsInvoice) => getBadgeVariant(data.status),
    },
    {
        column: 'dispatchDate',
        label: 'Despacho',
        element: (data: ItemsInvoice) => formatDate(data.dispatchDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'dueDate',
        label: 'Vencimiento',
        element: (data: ItemsInvoice) => formatDate(data.dueDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalBultos',
        label: 'Bultos',
        element: (data: ItemsInvoice) => formatOnlyNumberWithDots(data.totalBultos),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalAmount',
        label: 'Monto',
        element: (data: ItemsInvoice) => `${formatOnlyNumberWithDots(data.totalAmount)} $`,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'remaining',
        label: 'Debe',
        element: (data: ItemsInvoice) => `${formatOnlyNumberWithDots(data.remaining)} $`,
        orderBy: '',
        type: 'string',
    },
];