import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { IPayments } from "@/interfaces/payment.interface";
import { FaRegCheckCircle } from "react-icons/fa";

export const paymentsColumns: IColumns<IPayments>[] = [
    {
        label: 'Numero de factura',
        column: 'invoice.controlNumber',
        element: (data: IPayments) => data.invoice.controlNumber,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'invoice.client.name',
        label: 'Cliente',
        element: (data: IPayments) => data.invoice.client ? data.invoice.client.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'method.name',
        label: 'Tipo de pago',
        element: (data: IPayments) => data.method.name,
        orderBy: '',
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
    {
        column: 'amount',
        label: 'Cantidad',
        element: (data: IPayments) => formatNumberWithDots(data.amount, '', ',00 $'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'createdAt',
        label: 'Fecha de pago',
        element: (data: IPayments) => formatDate(data.createdAt),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Confirmar pago',
        element: (data: IPayments) => formatDate(data.createdAt),
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Confirmar', icon: FaRegCheckCircle , className: 'text-blue-400' },
        ]
    }
];

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