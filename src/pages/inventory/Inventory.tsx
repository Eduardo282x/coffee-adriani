import { useState } from "react"
import { Search, Table } from "lucide-react"
import { inventarioData, resumenData } from "./inventory.data"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export const Inventory = () => {
    const [searchTerm, setSearchTerm] = useState("")

    // Filtrar inventario según el término de búsqueda
    const filteredInventario = inventarioData.filter(
        (item) =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Función para calcular el porcentaje de stock
    const calcularPorcentajeStock = (stock: number, stockMinimo: number) => {
        const porcentaje = (stock / (stockMinimo * 2)) * 100
        return Math.min(porcentaje, 100)
    }

    // Función para obtener el color según el nivel de stock
    const getStockColor = (stock: number, stockMinimo: number) => {
        if (stock === 0) return "text-red-600"
        if (stock < stockMinimo) return "text-yellow-600"
        return "text-green-600"
    }

    // Función para obtener el color de la barra de progreso
    const getProgressColor = (stock: number, stockMinimo: number) => {
        if (stock === 0) return "bg-red-600"
        if (stock < stockMinimo) return "bg-yellow-600"
        return "bg-green-600"
    }

    return (
        <div className="flex flex-col">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Inventario</h1>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Gestión de Inventario</h2>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar en inventario..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    {resumenData.map((item, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                <div className={`rounded-full p-2 ${item.color}`}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Producto</TableHead>
                                <TableHead className="hidden md:table-cell">Ubicación</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="hidden md:table-cell">Mínimo</TableHead>
                                <TableHead className="hidden md:table-cell">Última Actualización</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventario.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInventario.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.codigo}</TableCell>
                                        <TableCell>{item.nombre}</TableCell>
                                        <TableCell className="hidden md:table-cell">{item.ubicacion}</TableCell>
                                        <TableCell className={getStockColor(item.stock, item.stockMinimo)}>{item.stock}</TableCell>
                                        <TableCell className="hidden md:table-cell">{item.stockMinimo}</TableCell>
                                        <TableCell className="hidden md:table-cell">{item.ultimaActualizacion}</TableCell>
                                        <TableCell>
                                            <div className="w-full">
                                                <Progress
                                                    value={calcularPorcentajeStock(item.stock, item.stockMinimo)}
                                                    className={`h-2 ${getProgressColor(item.stock, item.stockMinimo)}`}
                                                />
                                            </div>
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

