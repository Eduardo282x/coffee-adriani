import { useState } from "react"
import { Search, Plus, MoreHorizontal, Eye, Download, ShoppingCart } from "lucide-react"
import { ventasData } from "./sales.data"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
import { SalesChart } from "../dashboard/components/Sales-chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const Sales = () => {
    const [searchTerm, setSearchTerm] = useState("")

    // Filtrar ventas según el término de búsqueda
    const filteredVentas = ventasData.filter(
        (venta) =>
            venta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Modificar la función getBadgeVariant para usar colores que combinen con el tema marrón/café

    // Función para obtener el color de la insignia según el estado
    const getBadgeVariant = (estado: string) => {
        switch (estado) {
            case "Completada":
                return "bg-amber-100 text-amber-800"
            case "Pendiente":
                return "bg-orange-100 text-orange-800"
            case "Cancelada":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="flex flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Ventas</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Venta
                    </Button>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Ventas</h2>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar ventas..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Ventas por Período</CardTitle>
                        <CardDescription>Comparativa de ventas en el período seleccionado</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart />
                    </CardContent>
                </Card>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nº Venta</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="hidden md:table-cell">Método de Pago</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVentas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredVentas.map((venta) => (
                                    <TableRow key={venta.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
                                                {venta.id}
                                            </div>
                                        </TableCell>
                                        <TableCell>{venta.cliente}</TableCell>
                                        <TableCell>{venta.fecha}</TableCell>
                                        <TableCell>{venta.total}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeVariant(venta.estado)}`}
                                            >
                                                {venta.estado}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{venta.metodo}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Abrir menú</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver Detalles
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Descargar Factura
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    )
}
