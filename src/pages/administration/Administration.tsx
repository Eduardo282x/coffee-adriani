import { TableComponent } from "@/components/table/TableComponent";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IExpenseInvoice, ProductPercentage } from "@/interfaces/adminitration.interface";
import { useEffect, useMemo, useState } from "react";
import { baseTotals, expendePaymentsColumns, expendePaymentsNoAssociatedColumns, expenseInvoiceAllColumns, expenseInvoiceColumns, expenseInvoiceColumnsAssociated, expenseInvoiceColumnsDetail, expenseInvoiceDetailsColumns, ITotals } from "./administration.data";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown, Truck, User, Wallet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PiCoffeeBeanFill } from "react-icons/pi";
import { LuEqualApproximately } from "react-icons/lu";
import { useAdministration } from "@/hooks/administration.hook";
import { DateRangePicker } from "@/components/datepicker/DateRangePicker";
import { ProductType } from "@/interfaces/product.interface";
import { getProductType } from "@/services/products.service";
import { ExportDashboard } from "@/interfaces/invoice.interface";
import { IPayments } from "@/interfaces/payment.interface";
import { administrationFilterStore, OptionAdministration, OptionInvoice } from "@/store/administrationFilterStore";
import { FilterBadges } from "./FilterBadges";

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

const invoiceTabDescriptions: Record<OptionInvoice, string> = {
    invoicesAll: 'Todas las facturas pagadas en el período con su ganancia individual.',
    invoicesGift: 'Facturas que incluyen productos de regalo (GIFT).',
    invoicesRate: 'Facturas pagadas cuya tasa aplicada dejó una diferencia pendiente.',
    invoicesExpense: 'Estos son gastos asociados a facturas que reducen su ganancia.',
};

export const Administration = () => {
    const now = new Date();

    const [types, setTypes] = useState<ProductType[]>([]);

    const productTypeSelected = administrationFilterStore((s) => s.productTypeSelected);
    const dateRange = administrationFilterStore((s) => s.dateRange);
    const option = administrationFilterStore((s) => s.option);
    const optionInvoice = administrationFilterStore((s) => s.optionInvoice);
    const setProductTypeSelected = administrationFilterStore((s) => s.setProductTypeSelected);
    const setDateRange = administrationFilterStore((s) => s.setDateRange);
    const setOption = administrationFilterStore((s) => s.setOption);
    const setOptionInvoice = administrationFilterStore((s) => s.setOptionInvoice);

    const filtersDate = useMemo<ExportDashboard>(() => {
        const current = new Date();
        return {
            startDate: dateRange?.from ?? new Date(current.getFullYear(), current.getMonth(), 1),
            endDate: dateRange?.to ?? current,
            type: productTypeSelected || 'Cafe',
        };
    }, [dateRange?.from, dateRange?.to, productTypeSelected]);

    const { expenses, isLoading } = useAdministration(filtersDate);

    useEffect(() => {
        getProductsTypesApi();
    }, []);

    useEffect(() => {
        if (!productTypeSelected && types.length > 0) {
            setProductTypeSelected(types[0].type);
        }
    }, [productTypeSelected, types, setProductTypeSelected]);

    const getProductsTypesApi = async () => {
        const response = await getProductType() as ProductType[];
        setTypes(response);
    }

    const { totals, cardEarnsData, productSales, paymentsExpenses, totalPaymentsExpenses } = useMemo<{
        totals: ITotals;
        cardEarnsData: CardEarnsProps[];
        productSales: ProductPercentage[];
        paymentsExpenses: IPayments[];
        totalPaymentsExpenses: number;
    }>(() => {
        if (!expenses) {
            return {
                totals: baseTotals,
                cardEarnsData: [],
                productSales: [],
                paymentsExpenses: [],
                totalPaymentsExpenses: 0,
            };
        }

        const totalInvoice = expenses.invoices.reduce((acc, inv) => acc + Number(inv.remaining), 0);
        const totalInvoiceDetails = expenses.invoices
            .flatMap((item) => item.invoiceItems.filter((element) => element.type === 'GIFT'))
            .reduce((acc, item) => acc + Number(item.subtotal), 0);
        const totalPayments = expenses.payments.reduce((acc, pay) => acc + Number(pay.amountUSD), 0);
        const totalExpenses = totalInvoice + totalInvoiceDetails + totalPayments;
        const totalItemsEarnMonth = Number(expenses.summary.quantityProducts.totalEarnRange);
        const totalInvoiceEarns = expenses.invoices.reduce((acc, item) => acc + Number(item.earn), 0);
        const totalInvoiceNetEarns = Number(expenses.summary.earns?.real ?? 0);
        const totalExpenseAssociated = expenses.invoices.reduce((acc, item) => acc + Number(item.expenseAssociatedAmount), 0);
        const paymentsExpenses = expenses.paymentsExpenses.payments.filter(
            (pay) => pay.type === 'EXPENSE' || pay.type === 'PERSONAL_EXPENSES'
        );
        const totalPaymentsExpenses = paymentsExpenses.reduce((acc, pay) => acc + Number(pay.amountUSD), 0);

        return {
            totals: {
                totalInvoice: formatOnlyNumberWithDots(totalInvoice + totalInvoiceDetails),
                totalInvoiceRemaining: formatOnlyNumberWithDots(totalInvoice),
                totalInvoiceDetails: formatOnlyNumberWithDots(totalInvoiceDetails),
                totalInvoiceEarns: formatOnlyNumberWithDots(totalInvoiceEarns),
                totalInvoiceNetEarns: formatOnlyNumberWithDots(totalInvoiceNetEarns),
                totalExpenseAssociated: formatOnlyNumberWithDots(totalExpenseAssociated),
                totalPayments: formatOnlyNumberWithDots(totalPayments),
                total: formatOnlyNumberWithDots(totalExpenses),
            },
            cardEarnsData: [
                {
                    title: 'Ganancias',
                    Icon: TrendingUp,
                    text: `${formatOnlyNumberWithDots(expenses.summary.earns.real)}$`,
                    subtitle: 'Ganancia real del período',
                    classNameCard: 'text-green-800',
                    featured: true,
                    badges: [
                        { label: 'bultos', value: formatOnlyNumberWithDots(totalItemsEarnMonth) },
                        { label: 'facturas', value: String(expenses.invoices.length) },
                    ],
                },
                {
                    title: 'Ganancia estimada',
                    Icon: TrendingUp,
                    text: `${formatOnlyNumberWithDots(expenses.summary.earns.estimated)}$`,
                    subtitle: 'Ganancia neta estimada del período',
                    classNameCard: 'text-green-800',
                },
                ...(productTypeSelected === 'Queso' ? [{
                    title: 'Mermas',
                    Icon: TrendingDown,
                    text: `${formatOnlyNumberWithDots(expenses.summary.losses?.total ?? 0)}$`,
                    subtitle: 'Pérdidas por merma descontadas',
                    classNameCard: 'text-red-800',
                    badges: [
                        { label: 'registros', value: String(expenses.summary.losses?.count ?? 0) },
                    ],
                }] : []),
                {
                    title: 'Saldo',
                    Icon: Wallet,
                    text: `${formatOnlyNumberWithDots(expenses.bank.balance)}$`,
                    subtitle: 'Entrada menos egresos',
                    classNameCard: 'text-green-800',
                },
                {
                    title: 'Entrada',
                    Icon: ArrowDownLeft,
                    text: `${formatOnlyNumberWithDots(expenses.bank.entrance)}$`,
                    subtitle: 'Ingresos (INCOME)',
                    classNameCard: 'text-[#6f4e37]',
                },
                {
                    title: 'Egreso Total',
                    Icon: ArrowUpRight,
                    text: `${formatOnlyNumberWithDots(expenses.bank.outflow)}$`,
                    subtitle: 'Gastos + proveedores + personales',
                    classNameCard: 'text-red-800',
                },
                {
                    title: 'Gastos del Mes',
                    Icon: TrendingDown,
                    text: `${formatOnlyNumberWithDots(expenses.bank.expenses)}$`,
                    subtitle: 'Gastos asociados a facturas',
                    classNameCard: 'text-red-800',
                },
                {
                    title: 'Gastos Personales',
                    Icon: User,
                    text: `${formatOnlyNumberWithDots(expenses.bank.personalExpenses)}$`,
                    subtitle: 'Gastos personales',
                    classNameCard: 'text-[#6f4e37]',
                },
                {
                    title: 'Proveedores',
                    Icon: Truck,
                    text: `${formatOnlyNumberWithDots(expenses.bank.supplier)}$`,
                    subtitle: 'Pagos a proveedores',
                    classNameCard: 'text-[#6f4e37]',
                },
                {
                    title: 'Pagos sin asociar',
                    Icon: LuEqualApproximately,
                    text: `${formatOnlyNumberWithDots(expenses.bank.unassociatedAmount)}$`,
                    subtitle: 'Pagos INCOME sin factura',
                    classNameCard: '',
                    badges: [
                        { label: 'pagos', value: String(expenses.paymentsNoAssociated.payments.length) },
                    ],
                },
            ],
            productSales: expenses.summary.productPercentages,
            paymentsExpenses,
            totalPaymentsExpenses,
        };
    }, [expenses, productTypeSelected]);

    return (
        <div className="flex h-full flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-15 items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Administración</h1>
                </div>
            </header>

            <main className="flex-1 min-h-0 overflow-y-auto p-4 md:px-6">
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

                <div className="mb-4">
                    <FilterBadges />
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
                                    badges={card.badges}
                                    featured={card.featured}
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
                                        <GananciasChart gains={expenses.invoices} />
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
                                                    <span className="text-sm font-medium">{pro.name} {pro.presentation} ({pro.quantity.toFixed(2)})</span>
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
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-4 whitespace-nowrap">
                                    <span className="text-base"><span className="font-semibold">Ganancia Real:</span> {totals.totalInvoiceNetEarns} $</span>
                                    <span className="text-base"><span className="font-semibold">Total (diferencia de tasa + regalos):</span> {totals.totalInvoice} $</span>
                                    <span className="text-base text-red-600"><span className="font-semibold">Diferencia de tasa:</span> {totals.totalInvoiceRemaining} $</span>
                                    <span className="text-base text-red-600"><span className="font-semibold">Regalos:</span> {totals.totalInvoiceDetails} $</span>
                                    <span className="text-base text-red-600"><span className="font-semibold">Gasto Asociado:</span> {totals.totalExpenseAssociated} $</span>
                                </div>

                                <div className="w-auto">
                                    <div className="border border-[#ebe0d2] rounded-lg p-1 bg-[#6f4e37]/20 flex items-center justify-center gap-2">
                                        <Button className={`${optionInvoice !== 'invoicesAll' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOptionInvoice('invoicesAll')}>Todas</Button>
                                        <Button className={`${optionInvoice !== 'invoicesGift' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOptionInvoice('invoicesGift')}>Regalos</Button>
                                        <Button className={`${optionInvoice !== 'invoicesRate' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOptionInvoice('invoicesRate')}>Diferencia de tasa</Button>
                                        <Button className={`${optionInvoice !== 'invoicesExpense' ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setOptionInvoice('invoicesExpense')}>Gasto asociado</Button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-black ml-1 mb-1">{invoiceTabDescriptions[optionInvoice]}</p>
                        </div>
                        {optionInvoice == 'invoicesAll' &&
                        <TableComponent key="invoices-all" loading={isLoading} dataBase={expenses.invoices} columns={expenseInvoiceAllColumns}
                            isExpansible={true}
                            renderRow={(item, index) => (
                                (item.invoiceItems || []).length > 0
                                    ? (
                                        <TableComponent dataBase={(item.invoiceItems || [])} key={index} columns={expenseInvoiceDetailsColumns} />
                                    ) : null
                            )}
                        />
                        }
                        {optionInvoice == 'invoicesGift' &&
                        <TableComponent key="invoices-gift" loading={isLoading} dataBase={expenses.invoices.filter(item => item.hasGiftItems)} columns={expenseInvoiceColumns}
                            isExpansible={true}
                            renderRow={(item, index) => (
                                (item.invoiceItems || []).filter(i => i.type == 'GIFT').length > 0
                                    ? (
                                        <TableComponent dataBase={(item.invoiceItems || []).filter(i => i.type == 'GIFT')} key={index} columns={expenseInvoiceDetailsColumns} />
                                    ) :
                                    <div className="bg-white text-center w-full py-2 font-semibold">
                                        <p>Sin regalos</p>
                                    </div>
                            )}
                        />
                        }
                        {optionInvoice == 'invoicesRate' &&
                        <TableComponent key="invoices-rate" loading={isLoading} dataBase={expenses.invoices.filter(item => item.hasRateDifference)} columns={expenseInvoiceColumnsDetail}
                            isExpansible={true}
                            renderRow={(item, index) => (
                                (item.invoiceItems || []).filter(i => i.type !== 'GIFT').length > 0
                                    ? (
                                        <TableComponent dataBase={(item.invoiceItems || []).filter(i => i.type !== 'GIFT')} key={index} columns={expenseInvoiceDetailsColumns} />
                                    ) : null
                            )}
                        />
                        }
                        {optionInvoice == 'invoicesExpense' &&
                        <TableComponent key="invoices-expense" loading={isLoading} dataBase={expenses.invoices.filter(item => item.hasExpenseAssociated)} columns={expenseInvoiceColumnsAssociated}
                            isExpansible={true}
                            renderRow={(item, index) => (
                                (item.invoiceItems || []).filter(i => i.type !== 'GIFT').length > 0
                                    ? (
                                        <TableComponent dataBase={(item.invoiceItems || []).filter(i => i.type !== 'GIFT')} key={index} columns={expenseInvoiceDetailsColumns} />
                                    ) : null
                            )}
                        />
                        }
                    </div>
                )}
                {option == 'pay' && expenses && (
                    <div>
                        <p className="text-lg mb-2 ml-2"><span className="font-semibold">Gastos:</span> {formatOnlyNumberWithDots(totalPaymentsExpenses)} $</p>
                        <TableComponent loading={isLoading} dataBase={paymentsExpenses} columns={expendePaymentsColumns}
                        />
                    </div>
                )}
                {option == 'paymentsNoAssociated' && expenses && (
                    <div>
                        <p className="text-lg mb-2 ml-2"><span className="font-semibold">Pagos No Asociados:</span> {formatOnlyNumberWithDots(expenses.paymentsNoAssociated.total)} $</p>
                        <TableComponent loading={isLoading} dataBase={expenses.paymentsNoAssociated.payments} columns={expendePaymentsNoAssociatedColumns} />
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
    Icon: React.ComponentType<{ className?: string }>;
    badges?: { label: string; value: string }[];
    featured?: boolean;
}
const CardEarns = ({ title, subtitle, text, Icon, classNameCard, badges, featured }: CardEarnsProps) => {
    return (
        <Card className={`coffee-shadow ${classNameCard} ${featured ? 'lg:col-span-4 border-2 border-[#6f4e37]/40' : ''}`}>
            <CardHeader className="flex items-center justify-between -mb-6">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`font-bold text-xl`} />
            </CardHeader>
            <CardContent>
                <div className={`font-bold ${featured ? 'text-3xl' : 'text-2xl'}`}>{text}</div>
                {badges && badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {badges.map((badge, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#ebe0d2]/60 text-[#6f4e37]">
                                {badge.value} {badge.label}
                            </Badge>
                        ))}
                    </div>
                )}
                <p className="text-xs text-[#ae8958]">{subtitle}</p>
            </CardContent>
        </Card>
    )
}

interface GananciasChartProps {
    gains: IExpenseInvoice[]
}

function GananciasChart({ gains }: GananciasChartProps) {
    const [mounted, setMounted] = useState(false)

    const chartData = useMemo(
        () => {
            const byDay = new Map<string, { date: Date; ganancias: number }>();
            for (const invoice of gains) {
                const parsedDate = new Date(invoice.dispatchDate);
                if (Number.isNaN(parsedDate.getTime())) continue;
                const key = `${parsedDate.getFullYear()}-${parsedDate.getMonth()}-${parsedDate.getDate()}`;
                const current = byDay.get(key) ?? {
                    date: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()),
                    ganancias: 0,
                };
                current.ganancias += Number(invoice.netEarn ?? 0);
                byDay.set(key, current);
            }
            return Array.from(byDay.values())
                .map((item) => ({ ...item, ganancias: Number(item.ganancias.toFixed(2)) }))
                .sort((a, b) => a.date.getTime() - b.date.getTime());
        },
        [gains]
    );

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null;

    return (
        <div className="h-75 w-full">
            {chartData.length === 0 ?
                <div className="flex h-full w-full items-center justify-center text-sm text-[#ae8958]">
                    Sin datos para el período seleccionado.
                </div>
                :
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
                            dataKey="date"
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
            }
        </div>
    )
}
