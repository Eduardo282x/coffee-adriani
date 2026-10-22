import { DateRangePicker } from "@/components/datepicker/DateRangePicker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Filter } from "@/components/table/Filter"
// import { Button } from "@/components/ui/button"
// import { Download } from "lucide-react"
import { Block } from "@/interfaces/clients.interface"
import { FC, useEffect, useEffectEvent, useMemo, useState } from "react"
import { blockStore } from "@/store/clientStore"
import { InvoiceApi, InvoiceAPINewInvoice } from "@/interfaces/invoice.interface"
import { IColumns } from "@/components/table/table.interface"
import { DropDownFilter } from "@/components/dropdownFilter/DropDownFilter"
import { getProduct, getProductType } from "@/services/products.service"
import { IProducts, ProductType } from "@/interfaces/product.interface"
import { invoiceFilterStore } from "@/store/invoiceFilterStore"
import { notifyError } from "@/lib/error-feedback"
import { MultiSelect } from "@/components/multiSelect/MultiSelect"
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
    const selectedStatuses = invoiceFilterStore((state) => state.selectedStatuses);
    const selectedTypeProduct = invoiceFilterStore((state) => state.selectedTypeProduct);
    const selectedProductIds = invoiceFilterStore((state) => state.selectedProductIds);
    const dateStart = invoiceFilterStore((state) => state.dateStart);
    const setDateStart = invoiceFilterStore((state) => state.setDateStart);
    const setSelectedZone = invoiceFilterStore((state) => state.setSelectedZone);
    const setSelectedBlock = invoiceFilterStore((state) => state.setSelectedBlock);
    const setSelectedStatuses = invoiceFilterStore((state) => state.setSelectedStatuses);
    const setSelectedTypeProduct = invoiceFilterStore((state) => state.setSelectedTypeProduct);
    const setSelectedProductIds = invoiceFilterStore((state) => state.setSelectedProductIds);

    return (
        <div className="flex items-center gap-3">

            <div className="w-60">
                <Label className="mb-2">Buscar</Label>
                <Filter dataBase={[]} setSearch={setSearch} columns={clientColumns} setDataFilter={setInvoicesFilter} filterInvoices={true} initialValue={search} />
            </div>

            <DropDownFilter>
                <FiltersGroups
                    handleChangeStatuses={setSelectedStatuses}
                    handleChangeTypeProduct={setSelectedTypeProduct}
                    handleChangeZone={setSelectedZone}
                    handleChangeBlock={setSelectedBlock}
                    dateStart={dateStart}
                    setDateStart={setDateStart}
                    selectedZone={selectedZone}
                    selectedStatuses={selectedStatuses}
                    selectedBlock={selectedBlock}
                    selectedTypeProduct={selectedTypeProduct}
                    selectedProductIds={selectedProductIds}
                    handleChangeProducts={setSelectedProductIds}
                />
            </DropDownFilter>

            {/* <Button className="bg-green-700 hover:bg-green-600 text-white translate-y-3"><Download /> Exportar</Button> */}
        </div>
    )
}


const FiltersGroups = ({
    handleChangeStatuses,
    handleChangeBlock,
    handleChangeTypeProduct,
    handleChangeZone,
    dateStart,
    setDateStart,
    selectedZone,
    selectedStatuses,
    selectedBlock,
    selectedTypeProduct,
    selectedProductIds,
    handleChangeProducts,
}: {
    handleChangeStatuses: (value: string[]) => void;
    handleChangeTypeProduct: (value: string) => void;
    handleChangeZone: (value: string) => void;
    handleChangeBlock: (value: string) => void;
    handleChangeProducts: (value: number[]) => void;
    dateStart: import("react-day-picker").DateRange | undefined;
    setDateStart: (date: import("react-day-picker").DateRange | undefined) => void;
    selectedBlock?: string;
    selectedStatuses: string[];
    selectedZone?: string;
    selectedTypeProduct?: string;
    selectedProductIds: number[];
}) => {
    const { blocks, getBlocksApi } = blockStore();
    const [types, setTypes] = useState<ProductType[]>([]);
    const [products, setProducts] = useState<IProducts[]>([]);
    const zones = [
        { label: 'Zona Norte', value: 'Zona Norte' },
        { label: 'Zona Sur', value: 'Zona Sur' },
        { label: 'Zona Este', value: 'Zona Este' },
        { label: 'Zona Oeste', value: 'Zona Oeste' }
    ];
    const statusOptions = [
        { label: 'Creada', value: 'Creada' },
        { label: 'Pagado', value: 'Pagado' },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Abonadas', value: 'Abonadas' },
        { label: 'Vencida', value: 'Vencida' },
        { label: 'Cancelada', value: 'Cancelada' },
        { label: 'Perdidas', value: 'Perdidas' },
    ];

    const getBlockStoreApi = useEffectEvent(async () => {
        if (!blocks || blocks.allBlocks.length == 0) {
            try {
                await getBlocksApi();
            } catch (error) {
                notifyError(error, 'No se pudieron cargar las zonas.');
            }
        }
    })

    const getProductsTypesApi = useEffectEvent(async () => {
        try {
            const response = await getProductType();
            setTypes(response);
        } catch (error) {
            notifyError(error, 'No se pudieron cargar los tipos de producto.');
        }
    })

    const getProductsApi = useEffectEvent(async () => {
        try {
            const response = await getProduct();
            setProducts(response);
        } catch (error) {
            notifyError(error, 'No se pudieron cargar los productos.');
        }
    })

    useEffect(() => {
        getBlockStoreApi();
        getProductsTypesApi();
        getProductsApi();
    }, []);

    const productOptions = useMemo(
        () => products
            .filter((product) => !selectedTypeProduct || product.type === selectedTypeProduct)
            .map((product) => ({
                label: `${product.name} ${product.presentation}`,
                value: product.id.toString(),
            })),
        [products, selectedTypeProduct]
    );

    return (
        <div className="flex flex-col items-start justify-start gap-2 p-1">
            <DateRangePicker setDatePicker={setDateStart} datePicker={dateStart} label={'Fecha de despacho'} />
            {/* <DateRangePicker setDatePicker={setDateEnd} datePicker={dateEnd} label={'Fecha de vencimiento'} /> */}

            <div className="w-full">
                <Label className="mb-2">Estado Factura</Label>
                <MultiSelect
                    options={statusOptions}
                    selected={selectedStatuses}
                    onChange={handleChangeStatuses}
                    placeholder="Todos los estados"
                    searchPlaceholder="Buscar estado..."
                    emptyMessage="No hay estados disponibles"
                />
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

            <div className="w-full">
                <Label className="mb-2">Productos</Label>
                <MultiSelect
                    options={productOptions}
                    selected={selectedProductIds.map(String)}
                    onChange={(values) => handleChangeProducts(values.map(Number))}
                    placeholder="Todos los productos"
                    searchPlaceholder="Buscar producto..."
                    emptyMessage="No hay productos para este tipo"
                    disabled={productOptions.length === 0}
                />
            </div>
        </div>
    )
}