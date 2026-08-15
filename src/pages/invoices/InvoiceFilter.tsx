import { DateRangePicker } from "@/components/datepicker/DateRangePicker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Filter } from "@/components/table/Filter"
// import { Button } from "@/components/ui/button"
// import { Download } from "lucide-react"
import { Block } from "@/interfaces/clients.interface"
import { FC, useEffect, useState } from "react"
import { blockStore } from "@/store/clientStore"
import { InvoiceApi, InvoiceAPINewInvoice, InvoiceStatus } from "@/interfaces/invoice.interface"
import { IColumns } from "@/components/table/table.interface"
import { DropDownFilter } from "@/components/dropdownFilter/DropDownFilter"
import { getProductType } from "@/services/products.service"
import { ProductType } from "@/interfaces/product.interface"
import { invoiceFilterStore } from "@/store/invoiceFilterStore"
// useOptimizedInvoices removed to avoid creating a separate hook instance here

interface IInvoiceFilter {
    setInvoicesFilter: (value: InvoiceApi[]) => void;
    // invoice: InvoiceApi[];
    clientColumns: IColumns<InvoiceAPINewInvoice>[];
}

export const InvoiceFilter: FC<IInvoiceFilter> = ({
    setInvoicesFilter,
    clientColumns
}) => {
    const search = invoiceFilterStore((state) => state.search);
    const setSearch = invoiceFilterStore((state) => state.setSearch);
    const selectedZone = invoiceFilterStore((state) => state.selectedZone);
    const selectedBlock = invoiceFilterStore((state) => state.selectedBlock);
    const selectedStatus = invoiceFilterStore((state) => state.selectedStatus);
    const selectedTypeProduct = invoiceFilterStore((state) => state.selectedTypeProduct);
    const dateStart = invoiceFilterStore((state) => state.dateStart);
    const setDateStart = invoiceFilterStore((state) => state.setDateStart);
    const setSelectedZone = invoiceFilterStore((state) => state.setSelectedZone);
    const setSelectedBlock = invoiceFilterStore((state) => state.setSelectedBlock);
    const setSelectedStatus = invoiceFilterStore((state) => state.setSelectedStatus);
    const setSelectedTypeProduct = invoiceFilterStore((state) => state.setSelectedTypeProduct);

    return (
        <div className="flex items-center gap-3">

            <div className="w-60">
                <Label className="mb-2">Buscar</Label>
                <Filter dataBase={[]} setSearch={setSearch} columns={clientColumns} setDataFilter={setInvoicesFilter} filterInvoices={true} initialValue={search} />
            </div>

            <DropDownFilter>
                <FiltersGroups
                    handleChangeStatusInvoice={setSelectedStatus}
                    handleChangeTypeProduct={setSelectedTypeProduct}
                    handleChangeZone={setSelectedZone}
                    handleChangeBlock={setSelectedBlock}
                    dateStart={dateStart}
                    setDateStart={setDateStart}
                    selectedZone={selectedZone}
                    selectedStatus={selectedStatus}
                    selectedBlock={selectedBlock}
                    selectedTypeProduct={selectedTypeProduct}
                />
            </DropDownFilter>

            {/* <Button className="bg-green-700 hover:bg-green-600 text-white translate-y-3"><Download /> Exportar</Button> */}
        </div>
    )
}


const FiltersGroups = ({
    handleChangeStatusInvoice,
    handleChangeBlock,
    handleChangeTypeProduct,
    handleChangeZone,
    dateStart,
    setDateStart,
    selectedZone,
    selectedStatus,
    selectedBlock,
    selectedTypeProduct
}: {
    handleChangeStatusInvoice: (value: InvoiceStatus) => void;
    handleChangeTypeProduct: (value: string) => void;
    handleChangeZone: (value: string) => void;
    handleChangeBlock: (value: string) => void;
    dateStart: import("react-day-picker").DateRange | undefined;
    setDateStart: (date: import("react-day-picker").DateRange | undefined) => void;
    selectedBlock?: string;
    selectedStatus?: string;
    selectedZone?: string;
    selectedTypeProduct?: string;
}) => {
    const { blocks, getBlocksApi } = blockStore();
    const [types, setTypes] = useState<ProductType[]>([]);
    const zones = [
        { label: 'Zona Norte', value: 'Zona Norte' },
        { label: 'Zona Sur', value: 'Zona Sur' },
        { label: 'Zona Este', value: 'Zona Este' },
        { label: 'Zona Oeste', value: 'Zona Oeste' }
    ];

    const getBlockStoreApi = async () => {
        if (!blocks || blocks.allBlocks.length == 0) {
            await getBlocksApi();
        }
    }

    const getProductsTypesApi = async () => {
        const response = await getProductType();
        setTypes(response);
    }

    useEffect(() => {
        getBlockStoreApi();
        getProductsTypesApi();
    }, []);

    return (
        <div className="flex flex-col items-start justify-start gap-2 p-1">
            <DateRangePicker setDatePicker={setDateStart} datePicker={dateStart} label={'Fecha de despacho'} />
            {/* <DateRangePicker setDatePicker={setDateEnd} datePicker={dateEnd} label={'Fecha de vencimiento'} /> */}

            <div className="w-full">
                <Label className="mb-2">Estado Factura</Label>
                <Select onValueChange={handleChangeStatusInvoice} value={selectedStatus}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Estado Factura" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            <SelectItem value='Pagado'>Pagado</SelectItem>
                            <SelectItem value='Pendiente'>Pendiente</SelectItem>
                            <SelectItem value='Abonadas'>Abonadas</SelectItem>
                            <SelectItem value='Vencida'>Vencida</SelectItem>
                            <SelectItem value='Perdidas'>Perdidas</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full">
                <Label className="mb-2">Zona</Label>
                <Select value={selectedZone} onValueChange={handleChangeZone}>
                    <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Zona" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todas</SelectItem>
                            {zones && zones.map((zone: { label: string, value: string }, index: number) => (
                                <SelectItem key={index} value={zone.value}>{zone.label}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full">
                <Label className="mb-2">Bloques</Label>
                <Select value={selectedBlock} onValueChange={handleChangeBlock}>
                    <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Bloques" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            {blocks && blocks.allBlocks.map((blo: Block, index: number) => (
                                <SelectItem key={index} value={blo.id.toString()}>{blo.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full">
                <Label className="mb-2">Tipo de producto</Label>
                <Select value={selectedTypeProduct} onValueChange={handleChangeTypeProduct}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Producto" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {types && types.map((ty: ProductType, index: number) => (
                                <SelectItem key={index} value={ty.type}>{ty.type}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}