import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters"
import { LastPending } from "@/interfaces/dashboard.interface"

interface PendingInvoicesProps {
    invoicesData: LastPending[]
    status: 'all' | 'Pagado' | 'Pendiente' | 'Vencida'
}

export const PendingInvoices = ({ invoicesData, status }: PendingInvoicesProps) => {

    const setColorByStatus = (status: string) => {
        switch (status) {
            case 'Pagado':
                return 'bg-green-100 border-green-500 text-green-500';
            case 'Pendiente':
                return 'bg-yellow-100 border-yellow-500 text-yellow-500';
            case 'Vencida':
                return 'bg-red-100 border-red-500 text-red-500';
            default:
                return '';
        }
    }



    return (
        <div className="space-y-4">
            {(invoicesData && invoicesData.filter(invoice => status === 'all' || invoice.status === status).length > 0) ? invoicesData.filter(invoice => status === 'all' || invoice.status === status).map((invoice, index) => (
                <div key={index} className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none"><span className="">{invoice.controlNumber}</span> - {invoice.client.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total: {formatOnlyNumberWithDots(invoice.totalAmount)} $</p>
                    </div>

                    <div className="flex flex-col items-end">
                        <div>
                            <div className={`${setColorByStatus(invoice.status)} inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium w-20`}>
                                {invoice.status}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-xs text-muted-foreground mt-1">Despacho: {formatDate(invoice.dispatchDate)}</p>
                            {(invoice.status == 'Vencida' || invoice.status == 'Pendiente') && (
                                <>
                                    <span>-</span>
                                    <p className="text-xs text-muted-foreground mt-1">{invoice.status == 'Pendiente' ? 'Vence' : 'Vencida'}: {formatDate(invoice.dueDate)}</p>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            )) : <p className="text-center mt-1">No hay facturas disponibles</p>}
        </div>
    )
}

