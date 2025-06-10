import { DateRangePicker } from "@/components/datepicker/DateRangePicker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Filter } from "@/components/table/Filter"
// import { Button } from "@/components/ui/button"
// import { Download } from "lucide-react"
import { Block } from "@/interfaces/clients.interface"
import { FC, useEffect, useState } from "react"
import { getBlocks } from "@/services/clients.service"
import { DateRange } from "react-day-picker"
import { InvoiceApi } from "@/interfaces/invoice.interface"
import { IColumns } from "@/components/table/table.interface"
import { DropDownFilter } from "@/components/dropdownFilter/DropDownFilter"

interface IInvoiceFilter extends FilterGroupsProps {
    setInvoicesFilter: (value: InvoiceApi[]) => void;
    invoice: InvoiceApi[];
    clientColumns: IColumns<InvoiceApi>[];
}

interface FilterGroupsProps {
    handleChangeStatusInvoice: (value: string) => void;
    handleChangeBlock: (value: string) => void;
    dateStart: DateRange | undefined;
    dateEnd: DateRange | undefined;
    setDateStart: (date: DateRange | undefined) => void;
    setDateEnd: (date: DateRange | undefined) => void;
}

export const InvoiceFilter: FC<IInvoiceFilter> = ({
    setInvoicesFilter,
    handleChangeStatusInvoice,
    handleChangeBlock,
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd,
    invoice,
    clientColumns }) => {

    return (
        <div className="flex items-center gap-3">

            <div className="w-60">
                <Label className="mb-2">Buscar</Label>
                <Filter dataBase={invoice} columns={clientColumns} setDataFilter={setInvoicesFilter} filterInvoices={true} />
            </div>

            <DropDownFilter contentMenu={
                <FiltersGroups
                    handleChangeStatusInvoice={handleChangeStatusInvoice}
                    handleChangeBlock={handleChangeBlock}
                    dateStart={dateStart}
                    dateEnd={dateEnd}
                    setDateStart={setDateStart}
                    setDateEnd={setDateEnd}
                />
            } />

            {/* <Button className="bg-green-700 hover:bg-green-600 text-white translate-y-3"><Download /> Exportar</Button> */}
        </div>
    )
}


const FiltersGroups = ({
    handleChangeStatusInvoice,
    handleChangeBlock,
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd
}: FilterGroupsProps) => {

    const [blocks, setBlocks] = useState<Block[]>([]);

    const getBlocksApi = async () => {
        const response = await getBlocks();
        if (response) {
            setBlocks(response);
        }
    }

    useEffect(() => {
        getBlocksApi();
    }, [])

    return (
        <div className="flex flex-col items-start justify-start gap-2 p-1">
            <DateRangePicker setDatePicker={setDateStart} datePicker={dateStart} label={'Fecha de despacho'} />
            <DateRangePicker setDatePicker={setDateEnd} datePicker={dateEnd} label={'Fecha de vencimiento'} />

            <div className="w-full">
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

            <div className="w-full">
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
        </div>
    )
}