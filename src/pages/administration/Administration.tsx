import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { TableComponent } from "@/components/table/TableComponent";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IExpenses } from "@/interfaces/adminitration.interface";
import { getExpenses } from "@/services/expenses.service";
import { useEffect, useState } from "react";
import { expendePaymentsColumns, expenseInvoiceColumns } from "./administration.data";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";

type OptionAdministration = 'pay' | 'invoices' | 'earns';


export const Administration = () => {
    const [option, setOption] = useState<OptionAdministration>('earns')
    const [loading, setLoading] = useState<boolean>(false);
    const [expenses, setExpenses] = useState<IExpenses>({ invoices: [], payments: [] });
    const [totals, setTotals] = useState<{ totalInvoice: string; totalPayments: string }>({ totalInvoice: '0', totalPayments: '0' });

    useEffect(() => {
        getExpensesApi()
    }, [])

    const getExpensesApi = async () => {
        setLoading(true);
        try {
            const response: IExpenses = await getExpenses();
            if (response) {
                setExpenses(response);
                const totalInvoice = response.invoices.reduce((acc, inv) => acc + Number(inv.remaining), 0);
                const totalPayments = response.payments.reduce((acc, pay) => acc + Number(pay.amount), 0);
                setTotals({ totalInvoice: formatOnlyNumberWithDots(totalInvoice), totalPayments: formatOnlyNumberWithDots(totalPayments) })
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Administración</h1>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-start mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Administración</h2>
                </div>

                <TabsAdministration option={option} setOption={setOption} />

                {option == 'earns' && (
                    <TableComponent dataBase={[]} columns={[]} />
                )}
                {option == 'invoices' && (
                    <div>
                        <p className="text-lg mb-2 ml-2"><span className="font-semibold">Total:</span> {totals.totalInvoice} $</p>
                        <TableComponent dataBase={expenses.invoices} columns={expenseInvoiceColumns} />
                    </div>
                )}
                {option == 'pay' && (
                    <div>
                        <p className="text-lg mb-2 ml-2"><span className="font-semibold">Total:</span> {totals.totalPayments} $</p>
                        <TableComponent dataBase={expenses.payments} columns={expendePaymentsColumns} />
                    </div>
                )}
            </main>
        </div>
    )
}

interface TabsAdministrationProps {
    option: OptionAdministration;
    setOption: (opt: OptionAdministration) => void
}
const TabsAdministration = ({ option, setOption }: TabsAdministrationProps) => {

    return (
        <div className="w-72 mb-2">
            <div className="border border-[#ebe0d2] rounded-lg p-1 bg-[#6f4e37]/20 flex items-center justify-center gap-2">
                <Button className={`${option !== 'earns' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOption('earns')}>Ganancias</Button>
                <Button className={`${option !== 'invoices' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOption('invoices')}>Facturas</Button>
                <Button className={`${option !== 'pay' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOption('pay')}>Gastos</Button>
            </div>
        </div>
    )
}