import { formatOnlyNumberWithDots } from "@/hooks/formaters"
import { TopClient } from "@/interfaces/dashboard.interface"


interface ClientDemandProps {
    clientDemandData: TopClient[]
}
export const ClientDemandComponent = ({ clientDemandData }: ClientDemandProps) => {
    return (
        <div className="space-y-4">
            {clientDemandData && clientDemandData.map((client, index) => (
                <div key={index} className="grid grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{client.clientName}</p>
                        <p className="text-sm text-muted-foreground">Total de facturas: {client.invoicesCount}</p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm font-medium">{formatOnlyNumberWithDots(client.totalAmount)} $</p>
                        <p className="text-xs text-muted-foreground">Total de elementos: {client.totalItems} bultos</p>
                    </div>

                    {/* <div className="text-right">
                        <Button
                            variant="outline"
                            size="sm"
                            className={`${invoice.status === "Vencida" ? "text-red-500 border-red-500" : ""} w-28`}
                        >
                            {invoice.status}
                        </Button>
                    </div> */}
                </div>
            ))}
        </div>
    )
}
