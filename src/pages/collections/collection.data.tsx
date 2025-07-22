import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { ICollection, IMessages } from "@/interfaces/collection.interface";
import { IoDocumentTextOutline } from "react-icons/io5";
import { getBadgeVariant } from "../invoices/invoices.data";
import { IInvoice } from "@/interfaces/invoice.interface";
import { Edit, Trash2 } from "lucide-react";

export const messageCollectionColumns: IColumns<IMessages>[] = [
    {
        column: 'title',
        label: 'Titulo',
        element: (data: IMessages) => data.title,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'content',
        label: 'Mensaje',
        element: (data: IMessages) => data.content,
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
            { label: 'Editar', icon: Edit, className: 'text-blue-600' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
];

export const clientCollectionColumns: IColumns<ICollection>[] = [
    {
        column: 'client.name',
        label: 'Cliente',
        element: (data: ICollection) => data.client ? data.client.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.phone',
        label: 'Teléfono',
        element: (data: ICollection) => data.client ? data.client.phone : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.zone',
        label: 'Zona',
        element: (data: ICollection) => data.client ? data.client.zone : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'client.blockId',
        label: 'Bloque',
        element: (data: ICollection) => data.client ? data.client.block.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    }
];

export const getSendVariant = (send: boolean): string => {
    switch (send) {
        case true:
            return "rounded-lg px-2 bg-blue-100 text-blue-800"
        case false:
            return "rounded-lg px-2 bg-red-100 text-red-800"
        default:
            return "rounded-lg px-2 bg-gray-100 text-gray-800"
    }
}

export const invoiceCollectionColumns: IColumns<IInvoice>[] = [
    {
        column: 'controlNumber',
        label: 'Numero factura',
        element: (data: IInvoice) => data.controlNumber.toString(),
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
        column: 'totalAmount',
        label: 'Fecha pago',
        element: (data: IInvoice) => data.InvoicePayment.length > 0 ? formatDate(data.InvoicePayment[data.InvoicePayment.length - 1].createdAt) : '-',
        orderBy: '',
        type: 'string',
        // className: (data: IInvoice) => getBadgeVariant(data.status)
    },
    {
        column: 'totalAmount',
        label: 'Total',
        element: (data: IInvoice) => formatNumberWithDots(data.totalAmount, '', ' $'),
        orderBy: '',
        type: 'string',
    },
    // {
    //     column: 'totalAmountBs',
    //     label: 'Total Bs',
    //     element: (data: IInvoice) => formatNumberWithDots(data.totalAmountBs, '', ' Bs'),
    //     orderBy: '',
    //     type: 'string',
    // },
    {
        column: 'dispatchDate',
        label: 'Despacho',
        element: (data: IInvoice) => formatDate(data.dispatchDate),
        orderBy: '',
        type: 'string',
    },
    {
        column: 'dueDate',
        label: 'Vencimiento',
        element: (data: IInvoice) => formatDate(data.dueDate),
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
    }
]