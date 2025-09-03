import { IColumns } from "@/components/table/table.interface"
import { formatDate, formatNumberWithDots, formatOnlyNumberWithDots } from "@/hooks/formaters"
import { IInventory } from "@/interfaces/inventory.interface"
import { InvoiceItems, IInvoicePayment, InvoiceAPINewInvoice, InvoiceInvoice } from "@/interfaces/invoice.interface";
import { Trash2 } from "lucide-react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";

export const clientColumns: IColumns<InvoiceAPINewInvoice>[] = [
    {
        column: 'client.name',
        label: 'Cliente',
        element: (data: InvoiceAPINewInvoice) => data.client.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.rif',
        label: 'Rif',
        element: (data: InvoiceAPINewInvoice) => formatNumberWithDots(data.client.rif, '', '', true),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.zone',
        label: 'Zona',
        element: (data: InvoiceAPINewInvoice) => data.client.zone,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.blockId',
        label: 'Bloque',
        element: (data: InvoiceAPINewInvoice) => data.client.block.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Abrir',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
];

export const invoiceColumns: IColumns<InvoiceInvoice>[] = [
    {
        column: 'controlNumber',
        label: 'Numero factura',
        element: (data: InvoiceInvoice) => data.controlNumber,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'consignment',
        label: 'Consignación',
        element: (data: InvoiceInvoice) => data.consignment ? 'Si' : 'No',
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalAmount',
        label: 'Estado',
        element: (data: InvoiceInvoice) => data.status,
        orderBy: '',
        type: 'string',
        className: (data: InvoiceInvoice) => getBadgeVariant(data.status)
    },
    {
        column: 'remaining',
        label: 'Debe',
        element: (data: InvoiceInvoice) => `${formatOnlyNumberWithDots(data.remaining)} $`,
        orderBy: '',
        type: 'string',
        // className: (data: InvoiceInvoice) => getBadgeVariant(data.status)
    },
    {
        column: 'remaining',
        label: 'Pagado',
        element: (data: InvoiceInvoice) => `${formatOnlyNumberWithDots(Number(data.totalAmount) - Number(data.remaining))} $`,
        orderBy: '',
        type: 'string',
        // className: (data: InvoiceInvoice) => getBadgeVariant(data.status)
    },
    // {
    //     column: 'totalAmount',
    //     label: 'Fecha pago',
    //     element: (data: InvoiceInvoice) => data.InvoicePayment.length > 0 ? formatDate(data.InvoicePayment[data.InvoicePayment.length - 1].createdAt) : '-',
    //     orderBy: '',
    //     type: 'string',
    //     // className: (data: InvoiceInvoice) => getBadgeVariant(data.status)
    // },
    {
        column: 'totalAmount',
        label: 'Total',
        element: (data: InvoiceInvoice) => formatNumberWithDots(data.totalAmount, '', ' $'),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'dispatchDate',
        label: 'Despacho',
        element: (data: InvoiceInvoice) => formatDate(data.dispatchDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'dueDate',
        label: 'Vencimiento',
        element: (data: InvoiceInvoice) => formatDate(data.dueDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: '',
        label: 'Detalles',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Detalles', icon: IoDocumentTextOutline, className: 'text-blue-600' },
        ]
    },
    {
        column: '',
        label: 'Eliminar',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Eliminar', icon: MdOutlineDeleteOutline, className: 'text-red-600' },
        ]
    },
]

export const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case "Creada":
            return "rounded-lg px-2 bg-blue-100 text-blue-800"
        case "Pagado":
            return "rounded-lg px-2 bg-green-100 text-green-800"
        case "Pendiente":
            return "rounded-lg px-2 bg-yellow-100 text-yellow-800"
        case "Vencida":
            return "rounded-lg px-2 bg-red-100 text-red-800"
        case "Cancelada":
            return "rounded-lg px-2 bg-red-100 text-red-800"
        default:
            return "rounded-lg px-2 bg-gray-100 text-gray-800"
    }
}

export const invoiceItemsColumns: IColumns<InvoiceItems>[] = [
    {
        column: 'name',
        label: 'Producto',
        element: (data: InvoiceItems) => data.product ? `${data.product.name} - ${data.product.presentation}` : '',
        orderBy: '',
        type: 'string',
    },
    {
        column: 'price',
        label: 'Precio',
        element: (data: InvoiceItems) => formatNumberWithDots(Number(data.unitPrice).toFixed(2), '', ' $'),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: InvoiceItems) => data.quantity ? data.quantity.toString() : '',
        orderBy: '',
        type: 'string',
    },
    {
        column: 'subtotal',
        label: 'Subtotal',
        element: (data: InvoiceItems) => data.subtotal ? formatNumberWithDots(Number(data.subtotal).toFixed(2), '', ' $') : '',
        orderBy: '',
        type: 'string',
    }
];

export const invoiceItemsPaymentColumns: IColumns<IInvoicePayment>[] = [
    {
        column: 'payment.account.name',
        label: 'Cuenta',
        element: (data: IInvoicePayment) => data.payment ? `${data.payment.account.name} - ${data.payment.account.bank}` : '',
        orderBy: '',
        type: 'string',
    },
    {
        column: 'amount',
        label: 'Pagado',
        element: (data: IInvoicePayment) => formatNumberWithDots(Number(data.amount).toFixed(2), '', ' $'),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'createdAt',
        label: 'Fecha',
        element: (data: IInvoicePayment) => formatDate(data.createdAt),
        orderBy: '',
        type: 'string',
    }
];

export const productColumns: IColumns<IInventory>[] = [
    {
        column: 'name',
        label: 'Producto',
        element: (data: IInventory) => `${data.product.name} - ${data.product.presentation}`,
        orderBy: '',
        type: 'string',
        className: (data: IInventory) => data.id > 1 ? 'w-[12rem] block text-ellipsis overflow-hidden' : 'w-[12rem] block text-ellipsis overflow-hidden'
    },
    {
        column: 'product.price',
        label: 'Precio',
        element: (data: IInventory) => `${data.product.price}`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: 'product.priceUSD',
        label: 'Precio USD',
        element: (data: IInventory) => `${data.product.priceUSD}`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: () => `0`,
        orderBy: '',
        type: 'editable',
    },
    {
        column: 'subtotal',
        label: 'Subtotal',
        element: (data: IInventory) => data.subtotal ? formatNumberWithDots(data.subtotal.toFixed(2), '', ' $') : '0,00 $',
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
]

export const productColumnsExpansible: IColumns<IInventory>[] = productColumns.slice(0, productColumns.length - 1)