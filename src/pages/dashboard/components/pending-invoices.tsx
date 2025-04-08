import { Button } from "@/components/ui/button"

export const PendingInvoices = () => {
    return (
        <div className="space-y-4">
            {[
                {
                    id: "INV-001",
                    client: "Acme Inc.",
                    amount: "$1,250.00",
                    date: "15/04/2024",
                    status: "Pendiente",
                },
                {
                    id: "INV-002",
                    client: "Globex Corp.",
                    amount: "$3,200.00",
                    date: "20/04/2024",
                    status: "Pendiente",
                },
                {
                    id: "INV-003",
                    client: "Stark Industries",
                    amount: "$4,500.00",
                    date: "25/04/2024",
                    status: "Vencida",
                },
                {
                    id: "INV-004",
                    client: "Wayne Enterprises",
                    amount: "$2,800.00",
                    date: "30/04/2024",
                    status: "Pendiente",
                },
                {
                    id: "INV-005",
                    client: "Umbrella Corp.",
                    amount: "$1,750.00",
                    date: "05/05/2024",
                    status: "Vencida",
                },
            ].map((invoice, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.client}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">{invoice.amount}</p>
                        <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className={invoice.status === "Vencida" ? "text-red-500 border-red-500" : ""}
                    >
                        {invoice.status}
                    </Button>
                </div>
            ))}
        </div>
    )
}

