
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Package, ShoppingCart, Users } from "lucide-react"
import { InventoryStatus } from "./components/inventory-status"
import { PendingInvoices } from "./components/pending-invoices"
import { CardDashboard } from "./components/CardDashboard"
import { Buckets } from "@/interfaces/dashboard.interface"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/datepicker/DateRangePicker"
import { Button } from "@/components/ui/button"
import { RiFileExcel2Line } from "react-icons/ri"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { Notifications } from "@/components/notifications/Notifications"
import { ClientBuckets, ClientDemandComponent } from "./components/client-demand"
import { formatDate, formatOnlyNumberWithDots } from "@/hooks/formaters"
import { Label } from "@/components/ui/label"
import { ProductType } from "@/interfaces/product.interface"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProductType } from "@/services/products.service"
import { useDashboard } from "@/hooks/dashboard.hook"
// import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io"



export const Dashboard = () => {
    const [viewClient, setViewClient] = useState<boolean>(true);
    const now = new Date();
    const [types, setTypes] = useState<ProductType[]>([]);
    const [statusInvoice, setStatusInvoice] = useState<'all' | 'Pagado' | 'Pendiente' | 'Vencida'>('all');
    const [productTypeSelected, setProductTypeSelected] = useState<string>('Cafe');

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        to: new Date(now.getFullYear(), now.getMonth(), now.getDate())
    })

    const {
        dashboardData: dashBoardData,
        clientDemandData,
        isLoading,
        isExporting,
        exportDashboard,
    } = useDashboard({
        dateRange: date,
        productType: productTypeSelected,
    });

    useEffect(() => {
        setStatusInvoice('all');
    }, [date?.to, productTypeSelected])

    useEffect(() => {
        getProductsTypesApi()
    }, [])

    const getProductsTypesApi = async () => {
        const response = await getProductType();
        setTypes(response);
    }

    const changeStatusInvoice = (status: string) => {
        setStatusInvoice(status as 'all' | 'Pagado' | 'Pendiente' | 'Vencida');
    }

    const exportData = async () => {
        const response = await exportDashboard();
        if (!response) return;

        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte de Facturas ${formatDate(new Date())}.xlsx`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url);
    }

    const returnPercent = (part: number, total: number) => {
        if (total === 0) return 0;
        const result = formatOnlyNumberWithDots(((part / total) * 100), 2);
        return result;
    }

    const separateName = (name: string) => {
        if (name.includes("+")) {
            const [firstPart] = name.split("+");
            return `Mas de ${firstPart}`
        }
        const [firstPart, secondPart] = name.split("-");
        return `Entre ${firstPart} y ${secondPart}`
    }

    const setColorPercent = (range: string) => {
        const [percent] = range.split("-");
        const percentNumber = parseFloat(percent);
        if (percentNumber >= 70) return "bg-green-600";
        else if (percentNumber >= 40) return "bg-yellow-600";
        else return "bg-red-600";
    }

    return (
        <div className="flex flex-col ">

            {(isLoading || isExporting) && <ScreenLoader />}
            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Notifications />
                    <Button onClick={exportData}>
                        <RiFileExcel2Line className="text-green-600 font-bold" /> Exportar Excel
                    </Button>
                </div>
            </header>

            <main className="flex-1 space-y-4 p-4 md:p-6 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-[#6f4e37]">Resumen</h2>
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


                {dashBoardData && dashBoardData.invoices && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* <CardDashboard title="Ventas Totales" mainNumber="$45,231.89" percent="+20.1%" icon={DollarSign} subtitle="desde el último período"></CardDashboard> */}

                        <CardDashboard title="Total de Clientes" number={dashBoardData.invoices.totalClients} icon={Users}></CardDashboard>
                        <CardDashboard title="Facturas Pagadas" number={dashBoardData.invoices.payed.amount} icon={Package}></CardDashboard>
                        <CardDashboard title="Facturas Pendientes" number={dashBoardData.invoices.pending.amount} icon={ShoppingCart}></CardDashboard>
                        <CardDashboard title="Facturas Vencidas" number={dashBoardData.invoices.expired.amount} icon={ShoppingCart}></CardDashboard>
                    </div>
                )}

                <Tabs defaultValue="inventory" className="space-y-4">
                    <TabsList>
                        {/* <TabsTrigger value="ventas">Ventas</TabsTrigger> */}
                        <TabsTrigger value="inventory">Inventario</TabsTrigger>
                        <TabsTrigger value="invoices">Facturas</TabsTrigger>
                        <TabsTrigger value="clients">Demanda de clientes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="inventory" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Estado del Inventario</CardTitle>
                                    <CardDescription>Distribución de productos por categoría</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <InventoryStatus inventoryData={dashBoardData && dashBoardData.inventory} />
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Productos con Bajo Stock</CardTitle>
                                    <CardDescription>Productos que requieren reposición</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {dashBoardData.inventory && dashBoardData.inventory.lowStock.map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">Producto {item.name}</p>
                                                    <p className="text-sm text-muted-foreground">Stock: {item.amount} unidades</p>
                                                </div>
                                                <div className="font-medium">Crítico</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="invoices" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-5">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Ultimas 100 Facturas ({statusInvoice === 'all' ? '100' : dashBoardData.lastPending.filter(invoice => invoice.status === statusInvoice).length})</CardTitle>
                                            <CardDescription>Facturas que requieren seguimiento</CardDescription>
                                        </div>

                                        <div className="flex items-center justify-between overflow-hidden rounded-md bg-[#d2c3b3] cursor-pointer text-sm font-medium">
                                            {['all', 'Pagado', 'Pendiente', 'Vencida'].map((status) => (
                                                <Button
                                                variant='ghost'
                                                    key={status}
                                                    onClick={() => changeStatusInvoice(status)}
                                                    className={`${statusInvoice === status ? 'bg-[#6f4e37] text-white' : ''} rounded-md text-sm px-2 py-1`}
                                                >
                                                    {status == 'all' ? 'Todas' : status}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <PendingInvoices invoicesData={dashBoardData.lastPending} status={statusInvoice} />
                                </CardContent>
                            </Card>
                            <Card className="col-span-2">
                                <CardHeader>
                                    <CardTitle>Facturas por Estado</CardTitle>
                                    <CardDescription>Distribución de facturas según su estado</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            {dashBoardData && dashBoardData.invoices && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                                        <span>Pagadas ({dashBoardData.invoices.payed.percent}%)</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                                                        <span>Pendientes ({dashBoardData.invoices.pending.percent}%)</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                                                        <span>Vencidas ({dashBoardData.invoices.expired.percent}%)</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="clients" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-5">
                                <CardHeader className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Top de clientes ({clientDemandData.topClients.length})</CardTitle>
                                        <CardDescription>Lista de clientes con mayor demanda de productos</CardDescription>
                                    </div>

                                    <div className="flex items-center justify-between overflow-hidden rounded-md bg-[#d2c3b3] cursor-pointer text-sm font-medium">
                                        <p onClick={() => setViewClient(true)} className={`${viewClient ? 'bg-[#6f4e37] text-white' : ''} rounded-md text-sm px-2 py-1`}>Top Clientes</p>
                                        <p onClick={() => setViewClient(false)} className={`${!viewClient ? 'bg-[#6f4e37] text-white' : ''} rounded-md text-sm px-2 py-1`}>Demanda por cliente</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {viewClient &&
                                        <ClientDemandComponent clientDemandData={clientDemandData.topClients} />
                                    }
                                    {!viewClient &&
                                        <ClientBuckets buckets={clientDemandData.buckets || {} as Buckets} />
                                    }
                                </CardContent>
                            </Card>
                            <Card className="col-span-2">
                                <CardHeader>
                                    <CardTitle>Clientes por demanda</CardTitle>
                                    <CardDescription>Distribución de clientes según su Productos</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-full px-4">
                                        {clientDemandData.buckets && (
                                            <div className="flex flex-col-reverse gap-4">
                                                {clientDemandData.summary.map((item, index) => {
                                                    if (item.count == 0) return null;
                                                    else return (
                                                        <div className="flex items-center" key={index}>
                                                            <div className={`w-4 h-4 rounded-full ${setColorPercent(item.range)} mr-2`}></div>
                                                            <span>{separateName(item.range)} ({returnPercent(clientDemandData.buckets[item.range].length, clientDemandData.topClients.length)}%)</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

