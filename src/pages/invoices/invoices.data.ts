import { IColumns } from "@/components/table/table.interface"
import { formatDate, formatNumberWithDots } from "@/hooks/formaters"
import { IInventory } from "@/interfaces/inventory.interface"
import { IInvoice, InvoiceApi, InvoiceItems } from "@/interfaces/invoice.interface";
import { Trash2 } from "lucide-react";
import { IoDocumentTextOutline } from "react-icons/io5";

export const clientColumns: IColumns<InvoiceApi>[] = [
    {
        column: 'client.name',
        label: 'Cliente',
        element: (data: InvoiceApi) => data.client.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.rif',
        label: 'Rif',
        element: (data: InvoiceApi) => formatNumberWithDots(data.client.rif, '', '', true),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.zone',
        label: 'Zona',
        element: (data: InvoiceApi) => data.client.zone,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.blockId',
        label: 'Bloque',
        element: (data: InvoiceApi) => data.client.block.name,
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

export const invoiceColumns: IColumns<IInvoice>[] = [
    {
        column: 'controlNumber',
        label: 'Numero de factura',
        element: (data: IInvoice) => data.controlNumber,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'consignment',
        label: 'Consignación',
        element: (data: IInvoice) => data.consignment ? 'Si' : 'No',
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalAmount',
        label: 'Estado',
        element: (data: IInvoice) => data.status,
        orderBy: '',
        type: 'string',
        className: (data: IInvoice) => getBadgeVariant(data.status)
    },
    {
        column: 'dueDate',
        label: 'Fecha de vencimiento',
        element: (data: IInvoice) => formatDate(data.dueDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'totalAmount',
        label: 'Total',
        element: (data: IInvoice) => formatNumberWithDots(data.totalAmount, '', ',00 $'),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'dispatchDate',
        label: 'Despacho',
        element: (data: IInvoice) => formatDate(data.dispatchDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'createdAt',
        label: 'Registro',
        element: (data: IInvoice) => formatDate(data.createdAt),
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
]

const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case "Creada":
            return "rounded-lg px-2 bg-blue-100 text-blue-800"
        case "Pagado":
            return "rounded-lg px-2 bg-green-100 text-green-800"
        case "Pendiente":
            return "rounded-lg px-2 bg-yellow-100 text-yellow-800"
        case "Vencida":
            return "rounded-lg px-2 bg-red-100 text-red-800"
        default:
            return "rounded-lg px-2 bg-gray-100 text-gray-800"
    }
}

export const invoiceItemsColumns: IColumns<InvoiceItems>[] = [
    {
        column: 'name',
        label: 'Producto',
        element: (data: InvoiceItems) => `${data.product.name} - ${data.product.presentation}`,
        orderBy: '',
        type: 'string',
    },
    {
        column: 'price',
        label: 'Precio',
        element: (data: InvoiceItems) => formatNumberWithDots(data.product.price, '', ',00 $'),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'quantity',
        label: 'Cantidad',
        element: (data: InvoiceItems) => data.quantity.toString(),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'subtotal',
        label: 'Subtotal',
        element: (data: InvoiceItems) => formatNumberWithDots(data.subtotal, '', ',00 $'),
        orderBy: '',
        type: 'string',
    }
]

export const productColumns: IColumns<IInventory>[] = [
    {
        column: 'name',
        label: 'Producto',
        element: (data: IInventory) => `${data.product.name} - ${data.product.presentation}`,
        orderBy: '',
        type: 'string',
        className: (data: IInventory) => data.id > 1 ? 'w-[20rem]' : 'w-[20rem]'
    },
    {
        column: 'price',
        label: 'Precio',
        element: (data: IInventory) => formatNumberWithDots(data.product.price, '', ',00 $'),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'price',
        label: 'Precio USD',
        element: (data: IInventory) => formatNumberWithDots(data.product.priceUSD, '', ',00 $'),
        orderBy: '',
        type: 'string',
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
        element: (data: IInventory) => data.subtotal ? formatNumberWithDots(data.subtotal, '', ',00 $') : '0,00 $',
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