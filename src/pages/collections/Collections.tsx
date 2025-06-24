import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Filter } from "@/components/table/Filter"
import { TableComponent } from "@/components/table/TableComponent"
import { useState, useEffect } from "react"
import { GroupInvoices, NewInvoiceApiPackage, IInvoice } from "@/interfaces/invoice.interface"
import { getInvoiceExpired } from "@/services/invoice.service"
import { clientColumns, invoiceColumns } from "../invoices/invoices.data"
import { Expansible } from "@/components/expansible/Expansible"

export const Collections = () => {
    const [invoice, setInvoices] = useState<GroupInvoices>({ allInvoices: [], invoices: [], invoicesFilter: [] });
    const [loading, setLoading] = useState<boolean>(false);

    const getAllInvoicesApi = async () => {
        setLoading(true);
        const response: NewInvoiceApiPackage = await getInvoiceExpired();
        if (response) {
            setInvoices({
                allInvoices: response.invoices,
                invoices: response.invoices,
                invoicesFilter: response.invoices,
            });
        }
        setLoading(false)
    }

    useEffect(() => {
        getAllInvoicesApi()
    }, [])

    const actionInvoice = (invoice: IInvoice | number) => {
        console.log(invoice);
    }

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Cobranza</h1>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Cobranza</h2>
                    <div className="flex items-center gap-8">

                        <div className="flex w-80  items-center space-x-2">
                            <Filter dataBase={invoice.allInvoices} columns={[]} setDataFilter={(value) => console.log(value)} />
                        </div>
                    </div>
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
                                payInvoices={actionInvoice}
                                editInvoice={actionInvoice}
                                deleteInvoice={actionInvoice}
                            />
                        )} />
                </div>
            </main>
        </div>
    )
}
