import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { clientColumns, invoiceColumns } from "./invoices.data"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { InvoiceForm } from "./InvoiceForm"
import { DateRangeFilter, GroupInvoices, IInvoiceForm, InvoiceApi } from "@/interfaces/invoice.interface"
import { getInvoiceFilter, postInvoice } from "@/services/invoice.service"
import { Expansible } from "@/components/expansible/Expansible"
import { DateRange } from "react-day-picker"
import { Loading } from "@/components/loaders/Loading"
import { addDays } from "date-fns"
import { InvoiceFilter } from "./InvoiceFilter"
import { IPaymentForm } from "@/interfaces/payment.interface"
import { postPayment } from "@/services/payment.service"

export const Invoices = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [invoice, setInvoices] = useState<GroupInvoices>({ allInvoices: [], invoices: [], invoicesFilter: [] });
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
        const response: InvoiceApi[] = await getInvoiceFilter(filterDate)
        setInvoices({
            allInvoices: response,
            invoices: response,
            invoicesFilter: response
        });
        setLoading(false)
    }

    useEffect(() => {
        if (date?.to) {
            getInvoicesFilterApi()
        }
    }, [date?.to])

    const generateInvoice = async (data: IInvoiceForm) => {
        await postInvoice(data);
        setOpenDialog(false);
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

    const payInvoice = async (payment: IPaymentForm) => {
        await postPayment(payment);
        setOpenDialog(false);
        await getInvoicesFilterApi();
    }

    return (
        <div className="flex flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Facturas</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={() => setOpenDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Factura
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Facturas</h2>

                    <InvoiceFilter
                        setInvoicesFilter={setInvoicesFilter}
                        handleChangeStatusInvoice={handleChangeStatusInvoice}
                        handleChangeBlock={handleChangeBlock}
                        date={date}
                        setDate={setDate}
                        invoice={invoice.invoices}
                        clientColumns={clientColumns}
                    />
                </div>

                {loading && (
                    <div className="text-center">
                        <Loading />
                    </div>
                )}

                {!loading && (invoice.invoices.length > 0) && (
                    (
                        <>
                            <div className="text-end px-2 mb-2">
                                <p className="text-lg font-semibold">Total de facturas: {invoice.invoices.length + 1}</p>
                            </div>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {clientColumns && clientColumns.map((col, index: number) => (
                                                <TableHead key={index}>
                                                    {col.label}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoice && invoice.invoices.map((inv: InvoiceApi, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell colSpan={clientColumns.length} className="p-0">
                                                    <Expansible onSubmitForm={payInvoice} invoice={inv} columns={invoiceColumns}></Expansible>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )
                )}

                {!loading && invoice.invoices.length == 0 && (
                    <div className="text-center w-full">
                        <span >No se encontraron facturas.</span>
                    </div>
                )}

                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[45rem]"
                    label2="Agregar Cliente"
                    label1="Editar Cliente"
                    isEdit={true}
                >
                    <InvoiceForm onSubmit={generateInvoice}></InvoiceForm>
                </DialogComponent>
            </main>
        </div>
    )
}

