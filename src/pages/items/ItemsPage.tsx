import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Boxes, FileText, HandCoins, Scale } from "lucide-react"
import { Label } from "@/components/ui/label"
import { DateRangePicker } from "@/components/datepicker/DateRangePicker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductType } from "@/interfaces/product.interface"
import { getProductType } from "@/services/products.service"
import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters"
import { useItemsAnalytics } from "@/hooks/itemsAnalytics.hook"
import { TableComponent } from "@/components/table/TableComponent"
import { dailyInvoiceColumns, dailyItemsColumns, detailItemsColumns } from "./items.data"
import { ItemsDaily, ItemsInvoice } from "@/interfaces/itemsAnalytics.interface"
import { Skeleton } from "@/components/ui/skeleton"
import { itemsFilterStore } from "@/store/itemsFilterStore"
import { FilterBadges } from "./FilterBadges"

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-bold text-[#6f4e37]">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="-mt-5">
                <div className="text-xl font-semibold">{value}</div>
            </CardContent>
        </Card>
    )
}

export const ItemsPage = () => {
    const [types, setTypes] = useState<ProductType[]>([]);

    const productTypeSelected = itemsFilterStore((s) => s.productTypeSelected);
    const date = itemsFilterStore((s) => s.dateRange);
    const setProductTypeSelected = itemsFilterStore((s) => s.setProductTypeSelected);
    const setDate = itemsFilterStore((s) => s.setDateRange);

    const {
        itemsAnalytics,
        isLoading,
    } = useItemsAnalytics({
        dateRange: date,
        productType: productTypeSelected,
    });

    useEffect(() => {
        getProductsTypesApi()
    }, [])

    const getProductsTypesApi = async () => {
        const response = await getProductType();
        setTypes(response);
    }

    const invoicesByDay = useMemo(() => {
        const map: Record<string, { date: string; day: string; invoices: ItemsInvoice[] }> = {};
        for (const invoice of itemsAnalytics.invoices) {
            const key = invoice.date;
            if (!map[key]) {
                map[key] = { date: invoice.date, day: invoice.day, invoices: [] };
            }
            map[key].invoices.push(invoice);
        }
        return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
    }, [itemsAnalytics.invoices]);

    return (
        <div className="flex h-full flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-15 items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Bultos</h1>
                </div>
            </header>

            <main className="flex-1 min-h-0 space-y-4 p-4 md:px-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-[#6f4e37]">Bultos Pagados</h2>
                    <div className="flex items-start gap-4">
                        <div className="flex flex-col items-end justify-start gap-2">
                            <Label>Tipo de producto</Label>
                            <Select value={productTypeSelected} onValueChange={setProductTypeSelected}>
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
                        <div className="flex items-center gap-2">
                            <DateRangePicker
                                datePicker={date}
                                setDatePicker={setDate}
                                label="Rango de fecha"
                                btnWidth="w-60"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <FilterBadges />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {isLoading ? (
                        <>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Card key={index}>
                                    <CardContent className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-32" />
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    ) : (
                        <>
                            <StatCard title="Total Bultos" value={formatOnlyNumberWithDots(itemsAnalytics.totals.totalItems)} icon={Boxes} />
                            <StatCard title="Total Ganancia" value={`${formatOnlyNumberWithDots(itemsAnalytics.totals.totalAmount)} $`} icon={Scale} />
                            <StatCard title="Total Facturas" value={formatOnlyNumberWithDots(itemsAnalytics.totals.totalInvoices)} icon={FileText} />
                            <StatCard title="Total Pagos" value={formatOnlyNumberWithDots(itemsAnalytics.totals.totalPayments)} icon={HandCoins} />
                        </>
                    )}
                </div>

                <Tabs defaultValue="daily" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="daily">Bultos Pagados por dia</TabsTrigger>
                        <TabsTrigger value="invoices">Facturas</TabsTrigger>
                        <TabsTrigger value="general">General</TabsTrigger>
                    </TabsList>

                    <TabsContent value="daily">
                        <Card>
                            <CardContent>
                                <TableComponent
                                    dataBase={itemsAnalytics.daily}
                                    columns={dailyItemsColumns}
                                    isExpansible
                                    loading={isLoading}
                                    renderRow={(day: ItemsDaily) => (
                                        <div className="my-2">
                                            <p className="mb-2 text-sm font-semibold text-[#6f4e37]">
                                                Detalle de {formatOnlyNumberWithDots(day.totalItems)} bultos - {formatOnlyNumberWithDots(day.totalAmount)} $
                                            </p>
                                            <TableComponent
                                                dataBase={day.detailItems}
                                                columns={detailItemsColumns}
                                                hidePaginator
                                                shortSpaces
                                            />
                                            {day.invoices && day.invoices.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="mb-2 text-sm font-semibold text-[#6f4e37]">
                                                        Facturas pagadas
                                                    </p>
                                                    <TableComponent
                                                        dataBase={day.invoices}
                                                        columns={dailyInvoiceColumns}
                                                        hidePaginator
                                                        shortSpaces
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="invoices">
                        <Card>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Skeleton className="h-2 w-2 rounded-full" />
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-4 flex-1" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {invoicesByDay.map((group) => (
                                            <div key={group.date}>
                                                <div className="mb-2 flex items-center gap-2 border-b pb-1">
                                                    <h3 className="text-sm font-semibold text-[#6f4e37]">{group.day}</h3>
                                                    <span className="text-xs text-muted-foreground">{formatDate(group.date)}</span>
                                                </div>
                                                <TableComponent
                                                    dataBase={group.invoices}
                                                    columns={dailyInvoiceColumns}
                                                    hidePaginator
                                                    shortSpaces
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="general">
                        <Card>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Skeleton className="h-2 w-2 rounded-full" />
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-4 flex-1" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-3 gap-4 border-t pt-4">
                                            {itemsAnalytics.generalItems.detailItems.map((item, index) => (
                                                <div key={index} className="flex items-center border rounded-lg px-2 py-4 gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#6f4e37]"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium leading-none">{item.product}</p>
                                                    </div>
                                                    <div className="text-right space-y-1">
                                                        <p className="text-sm font-medium leading-none">Elementos: {formatOnlyNumberWithDots(item.totalElements)}</p>
                                                        <p className="text-sm text-muted-foreground">Ganancia unitaria: {formatOnlyNumberWithDots(item.unitPrice)} $ · Ganancia {formatOnlyNumberWithDots(item.totalAmount)} $</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}