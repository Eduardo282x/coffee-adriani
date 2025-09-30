import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { formatOnlyNumberWithDots } from "@/hooks/formaters"
import { Buckets, TopClient } from "@/interfaces/dashboard.interface"


interface ClientDemandProps {
    clientDemandData: TopClient[]
}
export const ClientDemandComponent = ({ clientDemandData }: ClientDemandProps) => {
    return (
        <div className="space-y-4 overflow-y-auto max-h-[30rem]">
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

interface ClientBucketsProps {
    buckets: Buckets
}
export const ClientBuckets = ({ buckets }: ClientBucketsProps) => {
    return (
        <div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="most"
            >
                <AccordionItem value="most">
                    <AccordionTrigger>Clientes con demanda de producto mayor a 100 bultos</AccordionTrigger>
                    <AccordionContent>
                        <ClientDemandComponent clientDemandData={buckets["101+"]}/>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="middle">
                    <AccordionTrigger>Clientes con demanda de producto entre 20 y 100 bultos</AccordionTrigger>
                    <AccordionContent>
                        <ClientDemandComponent clientDemandData={buckets["21-100"]}/>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="less">
                    <AccordionTrigger>Clientes con demanda de producto menor a 20 bulto</AccordionTrigger>
                    <AccordionContent>
                        <ClientDemandComponent clientDemandData={buckets["0-20"]}/>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}