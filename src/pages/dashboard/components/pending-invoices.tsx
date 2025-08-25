import { Button } from "@/components/ui/button"
import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters"
import { LastPending } from "@/interfaces/dashboard.interface"

interface PendingInvoicesProps {
    invoicesData: LastPending[]
}

export const PendingInvoices = ({ invoicesData }: PendingInvoicesProps) => {
    return (
        <div className="space-y-4">
            {invoicesData && invoicesData.map((invoice, index) => (
                <div key={index} className="grid grid-cols-3">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{invoice.controlNumber}</p>
                        <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-medium">{formatOnlyNumberWithDots(invoice.totalAmount)} $</p>
                        <p className="text-xs text-muted-foreground">{formatDate(invoice.dispatchDate)}</p>
                    </div>

                    <div className="text-right">
                        <Button
                            variant="outline"
                            size="sm"
                            className={`${invoice.status === "Vencida" ? "text-red-500 border-red-500" : ""} w-28`}
                        >
                            {invoice.status}
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

