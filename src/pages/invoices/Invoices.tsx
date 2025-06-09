import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { clientColumns, invoiceColumns } from "./invoices.data"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { InvoiceForm } from "./InvoiceForm"
import { DateRangeFilter, DetPackage, GroupInvoices, IInvoice, IInvoiceForm, InvoiceApi, NewInvoiceApiPackage } from "@/interfaces/invoice.interface"
import { deleteInvoice, getInvoice, getInvoiceFilter, postInvoice, putInvoice, putPayInvoice } from "@/services/invoice.service"
import { Expansible } from "@/components/expansible/Expansible"
import { DateRange } from "react-day-picker"
import { Loading } from "@/components/loaders/Loading"
import { addDays } from "date-fns"
import { InvoiceFilter } from "./InvoiceFilter"
import { TableComponent } from "@/components/table/TableComponent"
import { socket, useSocket } from "@/services/socket.io"
import { formatNumberWithDots } from "@/hooks/formaters"
import { DetailsPackage } from "./DetailsPackage"
import { BaseResponse } from "@/services/base.interface"
import { DolarComponents } from "@/components/dolar/DolarComponents"

export const Invoices = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectInvoice, setSelectInvoice] = useState<IInvoice | null>(null);
    const [invoice, setInvoices] = useState<GroupInvoices>({ allInvoices: [], invoices: [], invoicesFilter: [] });
    const [detPackage, setDetPackage] = useState<DetPackage[]>([])
    const [packages, setPackages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [dateStart, setDateStart] = useState<DateRange | undefined>(undefined)
    const [dateEnd, setDateEnd] = useState<DateRange | undefined>(undefined)
    const [selectedBlock, setSelectedBlock] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');


    const getAllInvoicesApi = async () => {
        setLoading(true);
        const response: NewInvoiceApiPackage = await getInvoice();
        if (response) {
            setDetPackage(response.detPackage)
            setPackages(response.package);
            setInvoices({
                allInvoices: response.invoices,
                invoices: response.invoices,
                invoicesFilter: response.invoices
            });
        }
        setLoading(false)
    }

    const getInvoicesFilterApi = async () => {
        setLoading(true);
        const filterDate: DateRangeFilter = {
            startDate: dateStart?.from ? dateStart.from : new Date(),
            endDate: dateStart?.to ? addDays(dateStart.to, 1) : new Date(),
        }
        const response: NewInvoiceApiPackage = await getInvoiceFilter(filterDate);
        if (response) {
            setDetPackage(response.detPackage)
            setPackages(response.package);
            setInvoices({
                allInvoices: response.invoices,
                invoices: response.invoices,
                invoicesFilter: response.invoices
            });
        }
        setLoading(false)
    }

    useEffect(() => {
        getAllInvoicesApi()
    }, [])

    useEffect(() => {
        if (dateStart?.to) {
            getInvoicesFilterApi()
        }
    }, [dateStart?.to])

    const generateInvoice = async (data: IInvoiceForm) => {
        if (selectInvoice) {
            await updateInvoiceApi(selectInvoice.id, data)
        } else {
            await postInvoice(data);
        }
        setOpenDialog(false);

        socket.emit('message', 'Actualice inventario')

        if (dateStart?.to) {
            getInvoicesFilterApi()
        }
    }

    const handleChangeBlock = (option: string) => {
        setSelectedBlock(option);
        applyInvoiceFilters(option, selectedStatus);
    };

    const handleChangeStatusInvoice = (option: string) => {
        setSelectedStatus(option);
        applyInvoiceFilters(selectedBlock, option);
    };


    const applyInvoiceFilters = (blockId: string, status: string) => {
        let filtered = invoice.allInvoices;

        // Filtro por bloque
        if (blockId !== 'all') {
            filtered = filtered.filter(inv => inv.client.blockId === Number(blockId));
        }

        // Filtro por estado
        if (status !== 'all') {
            const filteredByStatus: InvoiceApi[] = filtered.map(inv => {
                const filteredInvoices = inv.invoices.filter(invoice => invoice.status === status);
                if (filteredInvoices.length > 0) {
                    return {
                        client: inv.client,
                        invoices: filteredInvoices,
                    };
                }
                return null;
            }).filter((item): item is InvoiceApi => item !== null);

            filtered = filteredByStatus;
        }

        setInvoices(prev => ({ ...prev, invoices: filtered }));
    };


    const setInvoicesFilter = (invoices: InvoiceApi[]) => {
        setInvoices((prev) => ({ ...prev, invoices: invoices }))
    }

    useSocket('message', data => {
        console.log(data);
    })

    useEffect(() => {
        socket.emit('message', 'Entre a las facturas')
    }, [])

    const deleteInvoiceApi = async (id: number) => {
        const res: BaseResponse = await deleteInvoice(id);
        if (res.success) {
            await getInvoicesFilterApi();
        }
    }

    const editInvoice = (invoice: IInvoice) => {
        setSelectInvoice(invoice);
        setOpenDialog(true);
    }

    const payInvoices = (invoice: IInvoice) => {
        putPayInvoice(invoice.id);
    }

    const updateInvoiceApi = async (id: number, data: IInvoiceForm) => {
        await putInvoice(id, data);
        setOpenDialog(false);

        socket.emit('message', 'Actualice inventario')
        await getInvoicesFilterApi();
    }

    return (
        <div className="flex flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Facturas</h1>
                </div>

                <div className="flex items-center gap-4">
                    <DolarComponents />
                    <Button onClick={() => setOpenDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Factura
                    </Button>
                </div>
            </header>
            <div className="w-full h-3 bg-[#6f4e37] border-b"></div>

            <main className="flex-1 p-4 md:p-6 min-h-[80vh]">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Facturas</h2>

                    <InvoiceFilter
                        setInvoicesFilter={setInvoicesFilter}
                        handleChangeStatusInvoice={handleChangeStatusInvoice}
                        handleChangeBlock={handleChangeBlock}
                        dateStart={dateStart}
                        setDateStart={setDateStart}
                        dateEnd={dateEnd}
                        setDateEnd={setDateEnd}
                        invoice={invoice.invoicesFilter}
                        clientColumns={clientColumns}
                    />
                </div>

                {loading && (
                    <div className="text-center">
                        <Loading />
                    </div>
                )}

                {!loading && (invoice.invoices && invoice.invoices.length > 0) && (
                    (
                        <>
                            <div className="mb-2 text-lg flex items-center justify-start gap-2">
                                <p><span className="font-bold">Total de bultos:</span> {formatNumberWithDots(packages, '', '')} bultos</p>
                                <DetailsPackage detPackage={detPackage} />
                            </div>
                            <div className="rounded-md border">
                                <TableComponent
                                    dataBase={invoice.invoices}
                                    columns={clientColumns}
                                    colSpanColumns={true}
                                    renderRow={(inv, index) => (
                                        <Expansible
                                            key={index}
                                            invoice={inv}
                                            columns={invoiceColumns}
                                            payInvoices={payInvoices}
                                            editInvoice={editInvoice}
                                            deleteInvoice={deleteInvoiceApi}
                                        />
                                    )} />
                            </div>
                        </>
                    )
                )}

                {/* <div className="text-end px-2 mb-2">
                    <p className="text-lg font-semibold">Total de facturas: {invoice.invoices.length + 1}</p>
                </div> */}

                {!loading && invoice.invoices.length == 0 && (
                    <div className="text-center w-full">
                        <span >No se encontraron facturas.</span>
                    </div>
                )}

                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[46rem] px-4 max-h-[80vh] overflow-y-auto"
                    label2="Agregar Cliente"
                    label1="Editar Cliente"
                    isEdit={true}
                >
                    <InvoiceForm onSubmit={generateInvoice} data={selectInvoice}></InvoiceForm>
                </DialogComponent>
            </main>
        </div >
    )
}

