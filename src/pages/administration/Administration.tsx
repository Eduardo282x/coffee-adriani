import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { TableComponent } from "@/components/table/TableComponent";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { InvoiceEarn, ProductPercentage } from "@/interfaces/adminitration.interface";
import { useEffect, useMemo, useState } from "react";
import { baseTotals, expendePaymentsColumns, expendePaymentsNoAssociatedColumns, expenseInvoiceColumns, expenseInvoiceDetailsColumns, ITotals } from "./administration.data";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PiCoffeeBeanFill } from "react-icons/pi";
import { LuEqualApproximately } from "react-icons/lu";
import { useAdministration } from "@/hooks/administration.hook";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/datepicker/DateRangePicker";
import { ProductType } from "@/interfaces/product.interface";
import { getProductType } from "@/services/products.service";
import { ExportDashboard } from "@/interfaces/invoice.interface";

import {
    Select,
    SelectContent,
    SelectGroup,
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

type OptionAdministration = 'pay' | 'invoices' | 'earns' | 'paymentsNoAssociated';

export const Administration = () => {
    const now = new Date();

    const [types, setTypes] = useState<ProductType[]>([]);
    const [productTypeSelected, setProductTypeSelected] = useState<string>('Cafe');
    const [option, setOption] = useState<OptionAdministration>('earns')
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: now,
    });
    const [filtersDate, setFiltersDate] = useState<ExportDashboard>({
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now,
        type: 'Cafe',
    });

    const { expenses, isLoading, isFetching } = useAdministration(filtersDate);

    useEffect(() => {
        getProductsTypesApi();
    }, []);

    useEffect(() => {
        if (!dateRange?.from || !dateRange?.to) return;

        setFiltersDate((prev) => ({
            ...prev,
            startDate: dateRange.from as Date,
            endDate: dateRange.to as Date,
        }));
    }, [dateRange?.from, dateRange?.to]);

    useEffect(() => {
        if (!productTypeSelected) return;

        setFiltersDate((prev) => ({
            ...prev,
            type: productTypeSelected,
        }));
    }, [productTypeSelected]);

    const getProductsTypesApi = async () => {
        const response = await getProductType() as ProductType[];
        setTypes(response);
        if (response?.length > 0) {
            setProductTypeSelected(response[0].type);
        }
    }

    const { totals, cardEarnsData, productSales } = useMemo<{
        totals: ITotals;
        cardEarnsData: CardEarnsProps[];
        productSales: ProductPercentage[];
    }>(() => {
        if (!expenses) {
            return {
                totals: baseTotals,
                cardEarnsData: [],
                productSales: [],
            };
        }

        const totalInvoice = expenses.invoices.reduce((acc, inv) => acc + Number(inv.remaining), 0);
        const totalInvoiceDetails = expenses.invoices
            .flatMap((item) => item.invoiceItems.filter((element) => element.type === 'GIFT'))
            .reduce((acc, item) => acc + Number(item.subtotal), 0);
        const totalPayments = expenses.payments.reduce((acc, pay) => acc + Number(pay.amountUSD), 0);
        const totalExpenses = totalInvoice + totalInvoiceDetails + totalPayments;
        const totalEarnMonth = Number(expenses.invoicesEarns.totalEarnMonth);

        return {
            totals: {
                totalInvoice: formatOnlyNumberWithDots(totalInvoice + totalInvoiceDetails),
                totalInvoiceRemaining: formatOnlyNumberWithDots(totalInvoice),
                totalInvoiceDetails: formatOnlyNumberWithDots(totalInvoiceDetails),
                totalPayments: formatOnlyNumberWithDots(totalPayments),
                total: formatOnlyNumberWithDots(totalExpenses),
            },
            cardEarnsData: [
                {
                    title: 'Total del Mes',
                    Icon: DollarSign,
                    text: `${formatOnlyNumberWithDots(totalEarnMonth - totalExpenses)}$`,
                    subtitle: 'Total',
                    classNameCard: 'text-[#6f4e37]',
                },
                {
                    title: 'Ganancias del Mes',
                    Icon: TrendingUp,
                    text: `${formatOnlyNumberWithDots(totalEarnMonth)}$`,
                    subtitle: 'Ganancias',
                    classNameCard: 'text-green-800',
                },
                {
                    title: 'Gastos del Mes',
                    Icon: TrendingDown,
                    text: `${formatOnlyNumberWithDots(totalExpenses)}$`,
                    subtitle: 'Gastos',
                    classNameCard: 'text-red-800',
                },
                {
                    title: 'Pagos sin asociar',
                    Icon: LuEqualApproximately,
                    text: `${formatOnlyNumberWithDots(expenses.paymentsNoAssociated.total)}$ (${expenses.paymentsNoAssociated.payments.length})`,
                    subtitle: 'Pagos no asociados',
                    classNameCard: '',
                },
            ],
            productSales: expenses.invoicesEarns.productPercentages,
        };
    }, [expenses]);

    return (
        <div className="flex flex-col">
            {isLoading || isFetching && (
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
                        <div className="flex flex-col items-end justify-start gap-2">
                            {/* <Label>Tipo de producto</Label> */}
                            <Select value={productTypeSelected} onValueChange={setProductTypeSelected}>
                                <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Producto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {types.map((ty: ProductType, index: number) => (
                                            <SelectItem key={index} value={ty.type}>{ty.type}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <DateRangePicker
                            datePicker={{ from: dateRange?.from, to: dateRange?.to }}
                            setDatePicker={setDateRange}
                            label=""
                            btnWidth="w-60"
                            toDate={now}
                        />

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
                                        <GananciasChart gains={expenses.invoicesEarns.invoiceEarns} />
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
                                item.invoiceItems.filter(item => item.type == 'GIFT').length > 0
                                    ? (
                                        <TableComponent dataBase={item.invoiceItems.filter(item => item.type == 'GIFT')} key={index} columns={expenseInvoiceDetailsColumns} />
                                    ) :
                                    <div className="bg-white text-center w-full py-2 font-semibold">
                                        <p>Sin regalos</p>
                                    </div>
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
                {option == 'paymentsNoAssociated' && expenses && (
                    <div>
                        <p className="text-lg mb-2 ml-2"><span className="font-semibold">Total:</span> {formatOnlyNumberWithDots(expenses.paymentsNoAssociated.total)} $</p>
                        <TableComponent dataBase={expenses.paymentsNoAssociated.payments} columns={expendePaymentsNoAssociatedColumns} />
                    </div>
                )}
                {/* {isFetching && expenses && (
                    <p className="text-xs text-[#8c6d46] mt-2">Actualizando datos...</p>
                )} */}
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
        <div className="w-auto mb-2">
            <div className="border border-[#ebe0d2] rounded-lg p-1 bg-[#6f4e37]/20 flex items-center justify-center gap-2">
                <Button className={`${option !== 'earns' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOption('earns')}>Ganancias</Button>
                <Button className={`${option !== 'invoices' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOption('invoices')}>Facturas</Button>
                <Button className={`${option !== 'pay' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOption('pay')}>Gastos</Button>
                <Button className={`${option !== 'paymentsNoAssociated' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOption('paymentsNoAssociated')}>Pagos No Asociados</Button>
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
    gains: InvoiceEarn[]
}

function GananciasChart({ gains }: GananciasChartProps) {
    const [mounted, setMounted] = useState(false)

    const chartData = useMemo(
        () => gains.map((item) => ({
            ...item,
            ganancias: Number(item.earn ?? 0),
        })),
        [gains]
    );

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null;

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                        dataKey="createdAt"
                        tickFormatter={(value) => {
                            const parsedDate = new Date(value);
                            return Number.isNaN(parsedDate.getTime()) ? '' : `${parsedDate.getDate()}`;
                        }}
                    />
                    <YAxis tickFormatter={(value) => `$${formatOnlyNumberWithDots(value)}`} />
                    <Tooltip
                        formatter={(value: number | string) => [
                            `$${formatOnlyNumberWithDots(Number(value || 0))}`,
                            "Ganancias",
                        ]}
                        labelFormatter={(label) => {
                            const parsedDate = new Date(label);
                            return Number.isNaN(parsedDate.getTime()) ? `Día ${label}` : `Día ${parsedDate.getDate()}`;
                        }}
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
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}