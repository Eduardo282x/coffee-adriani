import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Download, Plus, Loader2 } from "lucide-react"
import { clientColumns, invoiceColumns } from "./invoices.data"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { InvoiceForm } from "./InvoiceForm"
import { IInvoiceForm, DateRangeFilter, InvoiceInvoice, ExportInvoicesDashboard } from "@/interfaces/invoice.interface"
import { getInvoiceExcelFilter } from "@/services/invoice.service"
import { ExpansibleInvoice } from "@/components/expansible/Expansible"
import { InvoiceFilter } from "./InvoiceFilter"
import { TableComponent } from "@/components/table/TableComponent"
import { socket, useSocket } from "@/services/socket.io"
import { formatOnlyNumberWithDots } from "@/hooks/formaters"
import { DetailsPackage, DetailsPayments } from "./DetailsPackage"
import { DolarComponents } from "@/components/dolar/DolarComponents"
import { GroupInventoryDate } from "@/interfaces/inventory.interface"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
// import { useOptimizedInvoices } from "./hooks/useOptimizedInvoices"
import { useOptimizedInvoices } from '@/hooks/invoice.hook';
import { useOptimizedInventory } from "@/hooks/inventory.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { blockStore } from "@/store/clientStore";
import { format } from "date-fns";
import { es } from "react-day-picker/locale";
import { invoiceFilterStore } from "@/store/invoiceFilterStore";

export const InvoicesPage = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectInvoice, setSelectInvoice] = useState<InvoiceInvoice | null>(null);
    const [loadingFile, setLoadingFile] = useState<boolean>(false);
    const dateStart = invoiceFilterStore((state) => state.dateStart);
    const search = invoiceFilterStore((state) => state.search);
    const selectedZone = invoiceFilterStore((state) => state.selectedZone);
    const selectedBlock = invoiceFilterStore((state) => state.selectedBlock);
    const selectedTypeProduct = invoiceFilterStore((state) => state.selectedTypeProduct);
    const selectedStatus = invoiceFilterStore((state) => state.selectedStatus);
    const { blocks } = blockStore();
    const { inventory: inventoryList } = useOptimizedInventory();

    const inventory = useMemo<GroupInventoryDate>(() => {
        const parseInventory = inventoryList.map((inv) => ({
            label: `${inv.product.name} ${inv.product.presentation} - ${inv.product.priceUSD}$`,
            value: inv.id
        }));
        return { allInventory: inventoryList, inventory: parseInventory };
    }, [inventoryList]);

    const activeFilters = useMemo<{ id: string, label: string }[]>(() => {
        const filters: { id: string, label: string }[] = [];

        if (search) {
            filters.push({ id: 'search', label: `Buscar: ${search}` });
        }

        if (selectedZone && selectedZone !== 'all') {
            filters.push({ id: 'zone', label: `Zona: ${selectedZone}` });
        }

        if (selectedBlock && selectedBlock !== 'all') {
            const blockName = blocks.allBlocks.find((b) => b.id.toString() === selectedBlock)?.name;
            filters.push({ id: 'block', label: `Bloque: ${blockName ?? selectedBlock}` });
        }

        if (selectedTypeProduct && selectedTypeProduct !== 'Cafe') {
            filters.push({ id: 'type', label: `Producto: ${selectedTypeProduct}` });
        }

        if (selectedStatus && selectedStatus !== 'all') {
            filters.push({ id: 'status', label: `Estado: ${selectedStatus}` });
        }

        if (dateStart?.to) {
            const from = dateStart.from ? format(dateStart.from, 'dd MMM', { locale: es }) : '';
            const to = format(dateStart.to, 'dd MMM', { locale: es });
            filters.push({ id: 'date', label: `Fecha: ${from} - ${to}` });
        }

        return filters;
    }, [search, selectedZone, selectedBlock, selectedTypeProduct, selectedStatus, dateStart, blocks.allBlocks]);

    // Hook optimizado
    const {
        invoices,
        statistics,
        totalCount,
        isLoading,
        isLoadingMore,
        isMutating,
        hasMore,
        loadMore,
        applyDateFilter,

        createInvoice,
        updateInvoice,
        removeInvoice,
        payInvoice,
        lostInvoices,
        setPendingInvoice,
        cleanInvoice,
        checkOneInvoice,
        error
    } = useOptimizedInvoices({
        pageSize: 50,
        enableStatistics: true
    });

    // Aplicar filtro de fecha cuando cambia
    useEffect(() => {
        if (dateStart?.to) {
            const filterDate: DateRangeFilter = {
                startDate: dateStart.from || new Date(),
                endDate: dateStart.to,
            };
            applyDateFilter(filterDate);
        } else {
            applyDateFilter(null);
        }
    }, [dateStart?.from, dateStart?.to, applyDateFilter]);

    // Socket listeners
    useSocket('message', (data) => {
        console.log(data);
    });

    useEffect(() => {
        socket.emit('message', 'Entre a las facturas');
    }, []);

    const generateInvoice = async (data: IInvoiceForm) => {
        try {
            const response = selectInvoice
                ? await updateInvoice(selectInvoice.id, data)
                : await createInvoice(data);

            if (!response || response.success === false) {
                return;
            }

            setOpenDialog(false);
            setSelectInvoice(null);
            socket.emit('message', 'Actualice inventario');
        } catch (error) {
            console.error('Error al procesar factura:', error);
        }
    };

    const editInvoice = (invoice: InvoiceInvoice) => {
        setSelectInvoice(invoice);
        setOpenDialog(true);
    };

    const deleteInvoiceHandler = async (id: number) => {
        try {
            await removeInvoice(id);
        } catch (error) {
            console.error('Error al eliminar factura:', error);
        }
    };

    const payInvoices = async (invoice: InvoiceInvoice) => {
        try {
            await payInvoice(invoice.id);
        } catch (error) {
            console.error('Error al pagar factura:', error);
        }
    };

    const lostInvoice = async (invoice: InvoiceInvoice) => {
        try {
            await lostInvoices(invoice.id);
        } catch (error) {
            console.error('Error al pagar factura:', error);
        }
    };

    const pendingInvoices = async (invoice: InvoiceInvoice) => {
        try {
            await setPendingInvoice(invoice.id);
        } catch (error) {
            console.error('Error al marcar factura como pendiente:', error);
        }
    };

    const cleanInvoices = async (invoice: InvoiceInvoice) => {
        try {
            await cleanInvoice(invoice.id);
        } catch (error) {
            console.error('Error al limpiar factura:', error);
        }
    };

    const checkInvoice = async (invoice: InvoiceInvoice) => {
        try {
            await checkOneInvoice(invoice.id);
        } catch (error) {
            console.error('Error al revisar factura:', error);
        }
    };

    const generateExcel = async () => {
        setLoadingFile(true);
        try {
            let response: Blob;
            if (dateStart) {
                const filterDate: ExportInvoicesDashboard = {
                    startDate: dateStart.from || new Date(),
                    endDate: dateStart.to ? dateStart.to : new Date(),
                    type: selectedTypeProduct
                };
                response = await getInvoiceExcelFilter(filterDate) as Blob;
            } else {
                const filterDate: ExportInvoicesDashboard = {
                    type: selectedTypeProduct
                };
                response = await getInvoiceExcelFilter(filterDate) as Blob;
            }

            const url = URL.createObjectURL(response);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Reporte de Facturas ${dateStart ? `${dateStart.from?.toLocaleDateString()} - ${dateStart.to?.toLocaleDateString()}` : ''}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al generar Excel:', error);
        } finally {
            setLoadingFile(false);
        }
    };

    const newInvoices = () => {
        setOpenDialog(true);
        setSelectInvoice(null);
    };

    // Función para cargar más facturas (scroll infinito)
    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            loadMore();
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <p className="text-red-500 mb-4">Error al cargar las facturas</p>
                <Button onClick={() => window.location.reload()}>
                    Recargar página
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {(loadingFile || isMutating) && <ScreenLoader />}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-2 lg:gap-4 text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Facturas</h1>
                </div>

                <div className="flex items-center gap-2 lg:gap-4">
                    <DolarComponents />
                    {activeFilters.length > 0 && (
                        <div className="hidden lg:flex flex-wrap items-center gap-1">
                            {activeFilters.map((filter) => (
                                <Badge key={filter.id} variant="outline" className="bg-transparent border-[#ebe0d2]/40 text-[#ebe0d2]">
                                    {filter.label}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <Button onClick={newInvoices} disabled={isMutating}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden lg:block">Nueva Factura</span>
                    </Button>
                </div>
            </header>

            <div className="w-full h-3 bg-[#6f4e37] border-b"></div>

            <main className="flex-1 p-4 md:p-6 min-h-[80vh]">
                <div className="flex flex-wrap items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">
                        Gestión de Facturas
                    </h2>

                    <div className='flex items-end justify-center gap-2'>
                        <Button
                            onClick={generateExcel}
                            className="bg-green-700 hover:bg-green-600 text-white hidden lg:flex"
                            disabled={loadingFile}
                        >
                            {loadingFile ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="mr-2 h-4 w-4" />
                            )}
                            Exportar
                        </Button>
                        <InvoiceFilter
                            setInvoicesFilter={() => { }} // Ya no necesario con el hook
                            clientColumns={clientColumns}
                        />
                    </div>
                </div>

                {isLoading && (
                    <div className="my-2 text-md flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                    </div>
                )}

                <>
                    {statistics && (
                        <div className="my-2 text-md flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div>
                                    <p>
                                        <span className="font-bold">Total de bultos: </span>
                                        {formatOnlyNumberWithDots(statistics.package)} bultos
                                    </p>
                                    {/* <p>
                                            <span className="font-bold">Bultos Pagos: </span>
                                            {formatOnlyNumberWithDots(statistics.packagePaid, 4)} bultos
                                        </p> */}
                                    <p>
                                        <span className="font-bold">Bultos restantes: </span>
                                        {formatOnlyNumberWithDots(statistics.packagePending, 4)} bultos
                                    </p>
                                </div>
                                <DetailsPackage
                                    detPackage={statistics.detPackage}
                                    detPackageLost={statistics.detPackageLost}
                                    packagePaid={statistics.packagePaid}
                                    packagePaidBS={statistics.packagePaidBS}
                                    packagePaidUSD={statistics.packagePaidUSD}
                                    packageLostTotal={statistics.packageLostTotal}
                                />
                            </div>
                            <DetailsPayments payments={statistics.payments} />
                        </div>
                    )}

                    <div className="rounded-md border">
                        <TableComponent
                            loading={isLoading}
                            dataBase={invoices}
                            columns={clientColumns}
                            colSpanColumns={true}
                            totalElements={totalCount}
                            renderRow={(inv, index) => (
                                <ExpansibleInvoice
                                    key={index}
                                    invoice={inv}
                                    columns={invoiceColumns}
                                    setLoading={setLoadingFile}
                                    lostInvoices={lostInvoice}
                                    payInvoices={payInvoices}
                                    pendingInvoices={pendingInvoices}
                                    cleanInvoices={cleanInvoices}
                                    checkInvoices={checkInvoice}
                                    editInvoice={editInvoice}
                                    deleteInvoice={deleteInvoiceHandler}
                                />
                            )}
                        />
                    </div>

                    {/* Botón para cargar más */}
                    {hasMore && (
                        <div className="text-center mt-4">
                            <Button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                variant="outline"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cargando más...
                                    </>
                                ) : (
                                    'Cargar más facturas'
                                )}
                            </Button>
                        </div>
                    )}
                </>

                {!isLoading && invoices.length === 0 && (
                    <div className="text-center w-full">
                        <span>No se encontraron facturas.</span>
                    </div>
                )}

                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[90%] lg:w-[46rem] px-4 max-h-[80vh] overflow-y-auto"
                    label2="Agregar Factura"
                    label1="Editar Factura"
                    isEdit={selectInvoice !== null}
                >
                    <InvoiceForm
                        inventory={inventory}
                        onSubmit={generateInvoice}
                        data={selectInvoice}
                    />
                </DialogComponent>
            </main>
        </div>
    );
};