
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Package, ShoppingCart, Users } from "lucide-react"
import { SalesChart } from "./components/Sales-chart"
import { InventoryStatus } from "./components/inventory-status"
import { PendingInvoices } from "./components/pending-invoices"
import { RecentSales } from "./components/recent-sales"
import { CardDashboard } from "./components/CardDashboard"
import { getDashboard, getDashboardClientDemand, getDashboardReport } from "@/services/dashboard.service"
import { ClientDemand, IDashboard } from "@/interfaces/dashboard.interface"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/datepicker/DateRangePicker"
import { DateRangeFilter } from "@/interfaces/invoice.interface"
import { Button } from "@/components/ui/button"
import { RiFileExcel2Line } from "react-icons/ri"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { Notifications } from "@/components/notifications/Notifications"
import { ClientBuckets, ClientDemandComponent } from "./components/client-demand"
import { formatOnlyNumberWithDots } from "@/hooks/formaters"
// import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io"

export const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [viewClient, setViewClient] = useState<boolean>(true);
    const [dashBoardData, setDashBoardData] = useState<IDashboard>({} as IDashboard);
    const [clientDemandData, setClientDemandData] = useState<ClientDemand>({} as ClientDemand);
    const now = new Date();
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        to: new Date(now.getFullYear(), now.getMonth(), now.getDate())
    })

    useEffect(() => {
        getDashboardApi();
    }, [date?.to])

    useEffect(() => {
        getDashboardClientDemandApi();
    }, [])

    const getDashboardApi = async () => {
        setLoading(true);
        const dateRange: DateRangeFilter = {
            startDate: new Date(date?.from as Date),
            endDate: new Date(date?.to as Date),
        }
        const response: IDashboard = await getDashboard(dateRange);
        setDashBoardData(response);
        setLoading(false);
    }

    const getDashboardClientDemandApi = async () => {
        const response: ClientDemand = await getDashboardClientDemand();
        setClientDemandData(response);
        // setLoading(false);
    }

    const exportData = async () => {
        setLoading(true)
        const dateRange: DateRangeFilter = {
            startDate: new Date(date?.from as Date),
            endDate: new Date(date?.to as Date),
        }
        const response = await getDashboardReport(dateRange) as Blob;
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte de Facturas.xlsx`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url);
        setLoading(false);
    }

    const returnPercent = (part: number, total: number) => {
        if (total === 0) return 0;
        const result = formatOnlyNumberWithDots(((part / total) * 100), 2);
        return result;
    }

    return (
        <div className="flex flex-col ">

            {loading && <ScreenLoader />}
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
                    <h2 className="text-2xl font-bold tracking-tight ">Resumen</h2>
                    <div className="flex items-center gap-2">
                        <DateRangePicker
                            datePicker={date}
                            setDatePicker={setDate}
                            label="Rango de fecha"
                            btnWidth="w-60"
                        />
                    </div>
                </div>


                {dashBoardData && dashBoardData.invoices && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* <CardDashboard title="Ventas Totales" mainNumber="$45,231.89" percent="+20.1%" icon={DollarSign} subtitle="desde el último período"></CardDashboard> */}

                        <CardDashboard title="Clientes Nuevos" mainNumber={0} percent="+10.5%" icon={Users} subtitle="desde el último período"></CardDashboard>
                        <CardDashboard title="Facturas Pagadas" mainNumber={dashBoardData.invoices.payed.amount} percent="+15.2%" icon={Package} subtitle="desde el último período"></CardDashboard>
                        <CardDashboard title="Facturas Pendientes" mainNumber={dashBoardData.invoices.pending.amount} percent="-2.5%" icon={ShoppingCart} subtitle="desde el último período"></CardDashboard>
                        <CardDashboard title="Facturas Vencidas" mainNumber={dashBoardData.invoices.expired.amount} percent="-2.5%" icon={ShoppingCart} subtitle="desde el último período"></CardDashboard>
                    </div>
                )}

                <Tabs defaultValue="inventario" className="space-y-4">
                    <TabsList>
                        {/* <TabsTrigger value="ventas">Ventas</TabsTrigger> */}
                        <TabsTrigger value="inventario">Inventario</TabsTrigger>
                        <TabsTrigger value="facturas">Facturas</TabsTrigger>
                        <TabsTrigger value="client">Demanda de clientes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ventas" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Ventas por Período</CardTitle>
                                    <CardDescription>Comparativa de ventas en el período seleccionado</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <SalesChart />
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Ventas Recientes</CardTitle>
                                    <CardDescription>Últimas transacciones realizadas</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentSales />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="inventario" className="space-y-4">
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
                    <TabsContent value="facturas" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-5">
                                <CardHeader>
                                    <CardTitle>Facturas Pendientes</CardTitle>
                                    <CardDescription>Facturas que requieren seguimiento</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PendingInvoices invoicesData={dashBoardData.lastPending} />
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
                    <TabsContent value="client" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-5">
                                <CardHeader className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Top de clientes ({clientDemandData.totalClientsConsidered})</CardTitle>
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
                                        <ClientBuckets buckets={clientDemandData.buckets} />
                                    }
                                </CardContent>
                            </Card>
                            <Card className="col-span-2">
                                <CardHeader>
                                    <CardTitle>Clientes por demanda</CardTitle>
                                    <CardDescription>Distribución de clientes según su Productos</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            {clientDemandData.buckets && (
                                                <div className="space-y-4">
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                                        <span>Mayor de 100 ({returnPercent(clientDemandData.buckets["101+"].length, clientDemandData.totalClientsConsidered)}%)</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                                                        <span>Entre 20-100 ({returnPercent(clientDemandData.buckets["21-100"].length, clientDemandData.totalClientsConsidered)}%)</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                                                        <span>Menor a 20 ({returnPercent(clientDemandData.buckets["0-20"].length, clientDemandData.totalClientsConsidered)}%)</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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

