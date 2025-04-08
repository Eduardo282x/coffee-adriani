
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Package, ShoppingCart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SalesChart } from "./components/Sales-chart"
import { InventoryStatus } from "./components/inventory-status"
import { PendingInvoices } from "./components/pending-invoices"
import { RecentSales } from "./components/recent-sales"

export const Dashboard = () => {
    const [dateRange, setDateRange] = useState("7d")

    return (
        <div className="flex flex-col">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Hoy
                    </Button>
                </div>
            </header>
            <main className="flex-1 space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Resumen</h2>
                    <div className="flex items-center gap-2">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccionar período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Últimos 7 días</SelectItem>
                                <SelectItem value="30d">Últimos 30 días</SelectItem>
                                <SelectItem value="90d">Últimos 90 días</SelectItem>
                                <SelectItem value="1y">Último año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-500 flex items-center">
                                    <ArrowUpRight className="mr-1 h-4 w-4" />
                                    +20.1%
                                </span>{" "}
                                desde el último período
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clientes Nuevos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2,350</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-500 flex items-center">
                                    <ArrowUpRight className="mr-1 h-4 w-4" />
                                    +10.5%
                                </span>{" "}
                                desde el último período
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-500 flex items-center">
                                    <ArrowUpRight className="mr-1 h-4 w-4" />
                                    +15.2%
                                </span>{" "}
                                desde el último período
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+573</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-red-500 flex items-center">
                                    <ArrowDownRight className="mr-1 h-4 w-4" />
                                    -2.5%
                                </span>{" "}
                                desde el último período
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="ventas" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="ventas">Ventas</TabsTrigger>
                        <TabsTrigger value="inventario">Inventario</TabsTrigger>
                        <TabsTrigger value="facturas">Facturas</TabsTrigger>
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
                                    <InventoryStatus />
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Productos con Bajo Stock</CardTitle>
                                    <CardDescription>Productos que requieren reposición</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">Producto {i}</p>
                                                    <p className="text-sm text-muted-foreground">Stock: {i} unidades</p>
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
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Facturas por Estado</CardTitle>
                                    <CardDescription>Distribución de facturas según su estado</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[300px] flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="flex justify-center space-x-4">
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                                                    <span>Pagadas (65%)</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                                                    <span>Pendientes (25%)</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                                                    <span>Vencidas (10%)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Facturas Pendientes</CardTitle>
                                    <CardDescription>Facturas que requieren seguimiento</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <PendingInvoices />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

