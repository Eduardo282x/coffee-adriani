import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { formatOnlyNumberWithDots } from "@/hooks/formaters"
import { Buckets, ResumenTopClient } from "@/interfaces/dashboard.interface"


interface ClientDemandProps {
    clientDemandData: ResumenTopClient[]
}
export const ClientDemandComponent = ({ clientDemandData }: ClientDemandProps) => {
    return (
        <div className="space-y-4 overflow-y-auto pr-2 max-h-[30rem]">
            {clientDemandData && clientDemandData.map((client, index) => (
                <div key={index} className="flex justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{client.clientName}</p>
                        <p className="text-sm text-muted-foreground">{client.clientBlock}</p>
                    </div>

                    <div className="flex flex-col items-end max-w-80 whitespace-nowrap text-ellipsis overflow-hidden">
                        <div className="flex items-center justify-end">
                            <p className="text-sm font-medium leading-none">Facturas:</p>
                            {client.invoices.map((invoice, index) => (
                                <div key={index} className="flex items-center justify-between ml-1">
                                    <p className="text-sm text-muted-foreground">#{invoice.controlNumber} ({invoice.totalElements}) {index < client.invoices.length - 1 ? ',' : ''}</p>
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-muted-foreground">Total de Facturas: {client.invoicesCount}</p>
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

interface ClientBucketsProps {
    buckets: Buckets
}
export const ClientBuckets = ({ buckets }: ClientBucketsProps) => {
    const orderBuckets: (keyof Buckets)[] = [
        "91-100",
        "81-90",
        "71-80",
        "61-70",
        "51-60",
        "41-50",
        "31-40",
        "21-30",
        "11-20",
        "1-10",
    ];


    const separateName = (name: string) => {
        const [firstPart, secondPart] = name.split("-");
        return `${firstPart} y ${secondPart}`
    }
    return (
        <div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="most"
            >
                {buckets["101+"].length > 0 && (
                    <AccordionItem value="most">
                        <AccordionTrigger>Clientes con demanda de producto mayor a 100 bultos ({buckets["101+"].length} Cliente{buckets["101+"].length > 1 ? "s" : ""})</AccordionTrigger>
                        <AccordionContent>
                            <ClientDemandComponent clientDemandData={buckets["101+"]} />
                        </AccordionContent>
                    </AccordionItem>
                )}

                {orderBuckets.map((order, key: number) => {
                    if (buckets[order].length === 0) return null; // Si no hay clientes en ese rango, no renderizar el AccordionItem 
                    else return (
                        <AccordionItem value={`order-${key}`} key={key}>
                            <AccordionTrigger>Clientes con demanda de producto entre {separateName(order)} bultos ({buckets[order].length} Cliente{buckets[order].length > 1 ? "s" : ""})</AccordionTrigger>
                            <AccordionContent>
                                <ClientDemandComponent clientDemandData={buckets[order]} />
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}