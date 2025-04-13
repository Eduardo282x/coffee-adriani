import { Button } from "@/components/ui/button"
import { pendingInvoices } from "./pending-invoices.data"

export const PendingInvoices = () => {
    return (
        <div className="space-y-4">
            {pendingInvoices.map((invoice, index) => (
                <div key={index} className="grid grid-cols-3">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.client}</p>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-medium">{invoice.amount}</p>
                        <p className="text-xs text-muted-foreground">{invoice.date}</p>
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

