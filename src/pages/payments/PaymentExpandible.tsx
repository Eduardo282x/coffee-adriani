// import { IColumns } from "@/components/table/table.interface";
import { TableComponent } from "@/components/table/TableComponent";
import { InvoicePayment, IPayments } from "@/interfaces/payment.interface"
import { paymentsInvoiceAssociatedColumns } from "./payment.data";
import { IInvoice } from "@/interfaces/invoice.interface";

interface PaymentExpandibleProps {
    payment: IPayments;
    actionPayment: (data: InvoicePayment, action: string) => void;
}

export const PaymentExpandible = ({ payment, actionPayment }: PaymentExpandibleProps) => {
    const parseDataPayments: IInvoice[] = payment.InvoicePayment.map(item => {
        return {
            ...item.invoice,
            amountPayed: item.amount,
            createdAtPayed: item.createdAt,
        }
    }).flat();

    const getAction = (type: string, data: IInvoice) => {
        const findPayment = payment.InvoicePayment.find(item => item.invoiceId === data.id) as InvoicePayment;
        if (type === 'Desasociar' || type === 'Ver') {
            actionPayment(findPayment, type)
        }
    }

    return (
        <div className={"w-full"}>
            {payment.InvoicePayment.length > 0 ? (
                <TableComponent dataBase={parseDataPayments} columns={paymentsInvoiceAssociatedColumns} action={getAction} />
            )
                :
                <p className="h-10 text-lg flex items-center justify-center font-medium text-gray-400">Sin facturas asociados</p>
            }
        </div>
    )
}
