import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { IInvoiceForPay } from "@/interfaces/invoice.interface";
import { IPayments } from "@/interfaces/payment.interface";
import { Trash2 } from "lucide-react";
import { FaRegCheckCircle } from "react-icons/fa";
import { HiOutlineCash } from "react-icons/hi";

export const paymentsColumns: IColumns<IPayments>[] = [
    {
        label: 'Cuenta',
        column: 'account.name',
        element: (data: IPayments) => `${data.account.name} ${data.account.bank}`,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'account.method.name',
        label: 'Tipo de pago',
        element: (data: IPayments) => data.account.method.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'associated',
        label: 'Asociado',
        element: (data: IPayments) => data.associated ? 'Asociado' : 'Sin asociar',
        orderBy: '',
        className: (data: IPayments) => getBadgeVariantAssociated(data.associated),
        type: 'string',
        icon: false,
    },
    {
        column: 'status',
        label: 'Estado',
        element: (data: IPayments) => data.status === 'CONFIRMED' ? 'Confirmado' : 'Pendiente',
        orderBy: '',
        className: (data: IPayments) => getBadgeVariant(data.status),
        type: 'string',
        icon: false,
    },
    // {
    //     column: 'remaining',
    //     label: 'Restante',
    //     element: (data: IPayments) => formatNumberWithDots(data.remaining, '', ' $'),
    //     orderBy: '',
    //     type: 'string',
    //     icon: false,
    // },
    {
        column: 'amount',
        label: 'Cantidad ($)',
        element: (data: IPayments) => formatNumberWithDots(data.amountUSD, '', ' $'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'amount',
        label: 'Cantidad (Bs)',
        element: (data: IPayments) => formatNumberWithDots(data.amountBs, '', ' Bs'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'dolar.dolar',
        label: 'Tasa Dolar',
        element: (data: IPayments) => formatNumberWithDots(data.dolar.dolar, '', ' Bs'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'reference',
        label: 'Referencia',
        element: (data: IPayments) => `# ${data.reference}`,
        orderBy: '',
        type: 'string',
        icon: false,
        className: () => 'font-semibold text-blue-600'
    },
    {
        column: 'createdAt',
        label: 'Fecha de pago',
        element: (data: IPayments) => formatDate(data.paymentDate),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Acción',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: HiOutlineCash, className: 'text-blue-800' },
            { label: 'Confirmar', icon: FaRegCheckCircle, className: 'text-blue-400' },
            { label: 'Pagar', icon: HiOutlineCash, className: 'text-green-400' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-400' },
        ]
    }
];

const getBadgeVariantAssociated = (status: boolean) => {
    if (status) {
        return "rounded-lg px-2 bg-blue-100 text-blue-800"
    } else {
        return "rounded-lg px-2 bg-gray-200 text-gray-800"
    }
}
const getBadgeVariant = (estado: string) => {
    switch (estado) {
        case "CONFIRMED":
            return "rounded-lg px-2 bg-green-100 text-green-800"
        case "PENDING":
            return "rounded-lg px-2 bg-yellow-100 text-yellow-800"
        default:
            return "rounded-lg px-2 bg-gray-100 text-gray-800"
    }
}

export const paymentsFilterColumns: IColumns<IInvoiceForPay>[] = [
    {
        label: 'Factura',
        column: 'controlNumber',
        element: (element: IInvoiceForPay) => element.controlNumber.toString(),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cliente',
        column: 'client.name',
        element: (element: IInvoiceForPay) => element.client ? element.client.name.toString() : '',
        orderBy: '',
        className: (element: IInvoiceForPay) => element.client ? 'w-[12rem] block text-ellipsis overflow-hidden' : 'w-[12rem] block text-ellipsis overflow-hidden',
        type: 'string',
        icon: false,
    },
    {
        label: 'Total',
        column: 'totalAmount',
        element: (element: IInvoiceForPay) => element.currency == 'BS' ? formatNumberWithDots(element.totalAmountBs, '', ' Bs') : String(Number(element.totalAmount).toFixed(2)),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'A pagar',
        column: 'totalPaid',
        element: (element: IInvoiceForPay) => element.totalPaid.toString(),
        orderBy: '',
        type: 'editable',
        icon: false,
    },
    {
        column: '',
        label: 'Eliminar',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Eliminar', icon: Trash2, className: 'text-red-400' },
        ]
    },

]