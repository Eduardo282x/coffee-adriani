import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Boxes, FileText, HandCoins, Scale } from "lucide-react"
import { Label } from "@/components/ui/label"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/datepicker/DateRangePicker"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductType } from "@/interfaces/product.interface"
import { getProductType } from "@/services/products.service"
import { formatOnlyNumberWithDots } from "@/hooks/formaters"
import { useItemsAnalytics } from "@/hooks/itemsAnalytics.hook"
import { TableComponent } from "@/components/table/TableComponent"
import { analyticsInvoiceColumns, dailyItemsColumns, detailItemsColumns } from "./items.data"
import { ItemsDaily } from "@/interfaces/itemsAnalytics.interface"
import { Skeleton } from "@/components/ui/skeleton"

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
    const now = new Date();
    const [types, setTypes] = useState<ProductType[]>([]);
    const [productTypeSelected, setProductTypeSelected] = useState<string>('Cafe');

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        to: new Date(now.getFullYear(), now.getMonth(), now.getDate())
    })

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

    return (
        <div className="flex flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-15 items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Bultos</h1>
                </div>
            </header>

            <main className="flex-1 space-y-4 p-4 md:p-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-[#6f4e37]">Analisis de Bultos</h2>
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
                            <StatCard title="Total Monto" value={`${formatOnlyNumberWithDots(itemsAnalytics.totals.totalAmount)} $`} icon={Scale} />
                            <StatCard title="Total Facturas" value={formatOnlyNumberWithDots(itemsAnalytics.totals.totalInvoices)} icon={FileText} />
                            <StatCard title="Total Pagos" value={formatOnlyNumberWithDots(itemsAnalytics.totals.totalPayments)} icon={HandCoins} />
                        </>
                    )}
                </div>

                <Tabs defaultValue="daily" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="daily">Elementos por dia</TabsTrigger>
                        <TabsTrigger value="invoices">Facturas</TabsTrigger>
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
                                        </div>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="invoices">
                        <Card>
                            <CardContent>
                                <TableComponent
                                    dataBase={itemsAnalytics.invoices}
                                    columns={analyticsInvoiceColumns}
                                    loading={isLoading}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}