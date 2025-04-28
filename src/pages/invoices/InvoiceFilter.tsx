import { DateRangePicker } from "@/components/datepicker/DateRangePicker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Filter } from "@/components/table/Filter"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Block } from "@/interfaces/clients.interface"
import { FC, useEffect, useState } from "react"
import { getBlocks } from "@/services/clients.service"
import { DateRange } from "react-day-picker"
import { InvoiceApi } from "@/interfaces/invoice.interface"
import { IColumns } from "@/components/table/table.interface"

interface IInvoiceFilter {
    setInvoicesFilter: (value: InvoiceApi[]) => void;
    handleChangeStatusInvoice: (value: string) => void;
    handleChangeBlock: (value: string) => void;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    invoice: InvoiceApi[];
    clientColumns: IColumns<InvoiceApi>[];
}

export const InvoiceFilter: FC<IInvoiceFilter> = ({
    setInvoicesFilter,
    handleChangeStatusInvoice,
    handleChangeBlock,
    date,
    setDate,
    invoice,
    clientColumns }) => {
    const [blocks, setBlocks] = useState<Block[]>([]);

    const getBlocksApi = async () => {
        const response = await getBlocks();
        setBlocks(response);
    }

    useEffect(() => {
        getBlocksApi();
    }, [])

    return (
        <div className="flex items-center gap-3CC">
            <DateRangePicker setDatePicker={setDate} datePicker={date} label={'Rango de Fecha'} />

            <div className="min-w-32">
                <Label className="mb-2">Estado Factura</Label>
                <Select onValueChange={handleChangeStatusInvoice}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Estado Factura" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            <SelectItem value='Creada'>Creada</SelectItem>
                            <SelectItem value='Pendiente'>Pendiente</SelectItem>
                            <SelectItem value='Pagado'>Pagado</SelectItem>
                            <SelectItem value='Vencida'>Vencida</SelectItem>
                            <SelectItem value='Cancelada'>Cancelada</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="min-w-32">
                <Label className="mb-2">Bloques</Label>
                <Select onValueChange={handleChangeBlock}>
                    <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Bloques" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            {blocks && blocks.map((blo: Block, index: number) => (
                                <SelectItem key={index} value={blo.id.toString()}>{blo.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-60">
                <Label className="mb-2">Buscar</Label>
                <Filter dataBase={invoice} columns={clientColumns} setDataFilter={setInvoicesFilter} />
            </div>

            <Button className="bg-green-700 hover:bg-green-600 text-white translate-y-3"><Download /> Exportar</Button>
        </div>
    )
}
