import { IColumns } from "@/components/table/table.interface";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { IInvoice } from "@/interfaces/invoice.interface";
import { IPayments } from "@/interfaces/payment.interface";

export const expendePaymentsColumns: IColumns<IPayments>[] = [
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
        column: 'amount',
        label: 'Cantidad ($)',
        element: (data: IPayments) => formatNumberWithDots(data.amount, '', ' $'),
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: 'createdAt',
        label: 'Fecha de pago',
        element: (data: IPayments) => formatDate(data.paymentDate),
        orderBy: '',
        type: 'string',
        icon: false,
    }
];

export const expenseInvoiceColumns: IColumns<IInvoice>[] = [
    {
        label: 'Factura',
        column: 'controlNumber',
        element: (data: IInvoice) => data.controlNumber,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Cliente',
        column: 'client.name',
        element: (data: IInvoice) => data.client ? data.client.name : '',
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Restante',
        column: 'remaining',
        element: (data: IInvoice) => formatNumberWithDots(Number(data.remaining).toFixed(2), '', '$'),
        orderBy: '',
        type: 'string',
        icon: false,
    }
];