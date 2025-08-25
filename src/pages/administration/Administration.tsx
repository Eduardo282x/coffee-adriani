/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { TableComponent } from "@/components/table/TableComponent";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DailyTotal, IExpenses, ProductSale } from "@/interfaces/adminitration.interface";
import { getExpenses } from "@/services/expenses.service";
import { useEffect, useState } from "react";
import { baseTotals, expendePaymentsColumns, expenseInvoiceColumns, expenseInvoiceDetailsColumns, ITotals } from "./administration.data";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PiCoffeeBeanFill } from "react-icons/pi";
import { LuEqualApproximately } from "react-icons/lu";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const coffeeColors = {
    darkRoast: "#5D4037",
    mediumRoast: "#795548",
    lightRoast: "#A1887F",
    cream: "#D7CCC8",
    espresso: "#3E2723",
}

type OptionAdministration = 'pay' | 'invoices' | 'earns';

export const Administration = () => {
    const now = new Date();

    const [option, setOption] = useState<OptionAdministration>('earns')
    const [loading, setLoading] = useState<boolean>(false);
    const [expenses, setExpenses] = useState<IExpenses | null>(null);
    const [cardEarnsData, setCardEarnsData] = useState<CardEarnsProps[]>([]);
    const [productSales, setProductSales] = useState<ProductSale[]>([]);
    const [totals, setTotals] = useState<ITotals>(baseTotals);
    const [filtersDate, setFiltersDate] = useState({
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    });

    function getMonthsFrom2025() {
        const months = [];
        const now = new Date();
        const startYear = 2025;
        const startMonth = 0; // Enero
        const endYear = now.getFullYear();
        const endMonth = now.getMonth(); // 0-indexed

        for (let year = startYear; year <= endYear; year++) {
            const firstMonth = year === startYear ? startMonth : 0;
            const lastMonth = year === endYear ? endMonth : 11;
            for (let month = firstMonth; month <= lastMonth; month++) {
                months.push({
                    value: `${year}-${month + 1}`,
                    label: `${new Date(year, month).toLocaleString('es-ES', { month: 'long' })} ${year}`,
                    year,
                    month
                });
            }
        }
        return months;
    }

    const [month, setMonth] = useState(() => {
        const months = getMonthsFrom2025();
        return months[months.length - 1]?.value; // mes actual por defecto
    });
    const monthsList = getMonthsFrom2025();

    useEffect(() => {
        getExpensesApi()
    }, [filtersDate])

    const getExpensesApi = async () => {
        setLoading(true);
        try {
            const response: IExpenses = await getExpenses(filtersDate);
            if (response) {
                setExpenses(response);
                setProductSales(response.invoicesEarns.resumen.productPercentage);
                const totalInvoice = response.invoices.reduce((acc, inv) => acc + Number(inv.remaining), 0);
                const totalInvoiceDetails = response.invoices.flatMap(item => item.invoiceItems.filter(element => element.type == 'GIFT')).reduce((acc, item) => acc + Number(item.subtotal), 0);
                const totalPayments = response.payments.reduce((acc, pay) => acc + Number(pay.amount), 0);
                setTotals({
                    totalInvoice: formatOnlyNumberWithDots(totalInvoice + totalInvoiceDetails),
                    totalInvoiceRemaining: formatOnlyNumberWithDots(totalInvoice),
                    totalInvoiceDetails: formatOnlyNumberWithDots(totalInvoiceDetails),
                    totalPayments: formatOnlyNumberWithDots(totalPayments),
                    total: formatOnlyNumberWithDots(totalInvoice + totalPayments)
                })

                const setCard = [
                    {
                        title: 'Total del Mes',
                        Icon: DollarSign,
                        text: `${formatOnlyNumberWithDots(response.invoicesEarns.resumen.totalMonthGain - (totalInvoice + totalPayments))}$`,
                        subtitle: 'Total',
                        classNameCard: 'text-[#6f4e37]'
                    },
                    {
                        title: 'Ganancias del Mes',
                        Icon: TrendingUp,
                        text: `${formatOnlyNumberWithDots(response.invoicesEarns.resumen.totalMonthGain)}$`,
                        subtitle: 'Ganancias',
                        classNameCard: 'text-green-800'
                    },
                    {
                        title: 'Gastos del Mes',
                        Icon: TrendingDown,
                        text: `${formatOnlyNumberWithDots(totalInvoice + totalPayments)}$`,
                        subtitle: 'Gastos',
                        classNameCard: 'text-red-800'
                    },
                    {
                        title: 'Pagos sin asociar',
                        Icon: LuEqualApproximately,
                        text: `${formatOnlyNumberWithDots(response.paymentsNoAssociated.total)}$`,
                        subtitle: 'Pagos no asociados',
                        classNameCard: ''
                    },
                ];
                setCardEarnsData(setCard)

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
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Administración</h2>

                    <div className="flex gap-2 items-center">
                        <Select value={month} onValueChange={(val) => {
                            setMonth(val);
                            const [year, m] = val.split('-').map(Number);
                            setFiltersDate(prev => ({
                                ...prev,
                                startDate: new Date(year, m - 1, 1),
                                endDate: new Date(year, m, 0),
                            }));
                            getExpensesApi(); // Si quieres recargar los datos al cambiar el mes
                        }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Fecha" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthsList.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <TabsAdministration option={option} setOption={setOption} />
                    </div>
                </div>


                {option == 'earns' && (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {cardEarnsData && cardEarnsData.map((card, index: number) => (
                                <CardEarns
                                    key={index}
                                    title={card.title}
                                    subtitle={card.subtitle}
                                    text={card.text}
                                    Icon={card.Icon}
                                    classNameCard={card.classNameCard}
                                />
                            ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="coffee-shadow">
                                <CardHeader className="text-[#6f4e37]">
                                    <CardTitle>Ganancias Diarias</CardTitle>
                                    <CardDescription>Evolución de las ganancias durante el mes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {expenses && (
                                        <GananciasChart gains={expenses.invoicesEarns.dailyData} />
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="coffee-shadow">
                                <CardHeader className="text-[#6f4e37]">
                                    <CardTitle>Distribución de Ingresos</CardTitle>
                                    <CardDescription>Fuentes de ingresos principales</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {productSales && productSales.map((pro, index: number) => (
                                            <div key={index} className="flex items-center justify-between text-[#6f4e37]">
                                                <div className="flex items-center">
                                                    <PiCoffeeBeanFill className="h-4 w-4 mr-2 text-[#6f4e37]" />
                                                    <span className="text-sm font-medium">{pro.name}</span>
                                                </div>
                                                <span className="text-sm font-bold">{formatOnlyNumberWithDots(pro.percentage)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
                {option == 'invoices' && expenses && (
                    <div>
                        <div className="flex items-center justify-start gap-2">
                            <p className="text-lg mb-2 ml-2"><span className="font-semibold">Total:</span> {totals.totalInvoice} $</p>
                            <p className="text-lg mb-2 ml-2"><span className="font-semibold">Total Restante:</span> {totals.totalInvoiceRemaining} $</p>
                            <p className="text-lg mb-2 ml-2"><span className="font-semibold">Total Regalos:</span> {totals.totalInvoiceDetails} $</p>
                        </div>
                        <TableComponent dataBase={expenses.invoices} columns={expenseInvoiceColumns}
                            isExpansible={true}
                            renderRow={(item, index) => (
                                item.invoiceItems.length > 0
                                    ? (
                                        <TableComponent dataBase={item.invoiceItems.filter(item => item.type == 'GIFT')} key={index} columns={expenseInvoiceDetailsColumns} />
                                    ) :
                                    <p>Sin regalos</p>
                            )}
                        />
                    </div>
                )}
                {option == 'pay' && expenses && (
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

interface CardEarnsProps {
    title: string;
    text: string;
    subtitle: string;
    classNameCard: string;
    Icon: React.ComponentType<{ className?: string }>
}
const CardEarns = ({ title, subtitle, text, Icon, classNameCard }: CardEarnsProps) => {
    return (
        <Card className={`coffee-shadow ${classNameCard}`}>
            <CardHeader className="flex items-center justify-between -mb-6">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`font-bold text-xl`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{text}</div>
                <p className="text-xs text-[#ae8958]">{subtitle}</p>
            </CardContent>
        </Card>
    )
}

interface GananciasChartProps {
    gains: DailyTotal[]
}

function GananciasChart({ gains }: GananciasChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null;

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={gains}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="dia" tickFormatter={(value) => `${value}`} />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                        formatter={(value: number, name: string) => [
                            `$${value.toLocaleString()}`,
                            name === "ganancias" ? "Ganancias" : "Meta",
                        ]}
                        labelFormatter={(label) => `Día ${label}`}
                        contentStyle={{
                            backgroundColor: "rgba(255, 250, 240, 0.95)",
                            borderColor: coffeeColors.mediumRoast,
                            borderRadius: "4px",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="ganancias"
                        stroke={coffeeColors.darkRoast}
                        strokeWidth={2}
                        activeDot={{ r: 6, fill: coffeeColors.espresso }}
                        name="ganancias"
                    />
                    <Line
                        type="monotone"
                        dataKey="meta"
                        stroke={coffeeColors.lightRoast}
                        strokeWidth={1}
                        // strokeDasharray="5 5"
                        name="meta"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}