import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { clientColumns, invoiceColumns } from "./invoices.data"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { InvoiceForm } from "./InvoiceForm"
import { DateRangeFilter, DetPackage, GroupInvoices, IInvoice, IInvoiceForm, InvoiceApi, NewInvoiceApiPackage } from "@/interfaces/invoice.interface"
import { deleteInvoice, getInvoiceFilter, postInvoice, putInvoice, putPayInvoice } from "@/services/invoice.service"
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
    const today = new Date();

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, today.getMonth(), 1),
        to: new Date(2025, today.getMonth() + 1, 1),
    })

    const getInvoicesFilterApi = async () => {
        setLoading(true);
        const filterDate: DateRangeFilter = {
            startDate: date?.from ? date.from : new Date(),
            endDate: date?.to ? addDays(date.to, 1) : new Date(),
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
        if (date?.to) {
            getInvoicesFilterApi()
        }
    }, [date?.to])

    const generateInvoice = async (data: IInvoiceForm) => {

        if (selectInvoice) {
            await updateInvoiceApi(selectInvoice.id, data)
        } else {
            await postInvoice(data);
        }
        setOpenDialog(false);

        socket.emit('message', 'Actualice inventario')

        setDate({
            from: new Date(2025, today.getMonth(), 1),
            to: new Date(2025, today.getMonth() + 1, 1),
        })
    }

    const handleChangeBlock = (option: string) => {
        if (option === 'all') return setInvoices((prev) => ({ ...prev, invoices: invoice.allInvoices }))
        const filterClientsByBlock = invoice.allInvoices.filter(cli => cli.client.blockId === Number(option))
        setInvoices((prev) => ({ ...prev, invoices: filterClientsByBlock }))
    }

    const handleChangeStatusInvoice = (option: string) => {
        if (option === 'all') {
            return setInvoices((prev) => ({ ...prev, invoices: invoice.allInvoices }));
        }

        const filterInvoiceByStatus: InvoiceApi[] = invoice.allInvoices.map(inv => {
            const filteredInvoices = inv.invoices.filter(invoice => invoice.status === option);
            if (filteredInvoices.length > 0) {
                return {
                    client: inv.client,
                    invoices: filteredInvoices,
                };
            }
            return null;
        })
            .filter((item): item is InvoiceApi => item !== null);

        setInvoices((prev) => ({ ...prev, invoices: filterInvoiceByStatus }));
    }

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

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Facturas</h2>

                    <InvoiceFilter
                        setInvoicesFilter={setInvoicesFilter}
                        handleChangeStatusInvoice={handleChangeStatusInvoice}
                        handleChangeBlock={handleChangeBlock}
                        date={date}
                        setDate={setDate}
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
                    className="w-[46rem] px-4"
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

