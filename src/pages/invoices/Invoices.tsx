import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Plus, MoreHorizontal, FileText, Download, Send, Eye } from "lucide-react"
import { facturasData } from "./invoices.data"
import { Expansible } from "@/components/expansibe/Expansible"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { InvoiceForm } from "./InvoiceForm"

export const Invoices = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    // const [dataDialog, setDataDialog] = useState<IClientsForm>(defaultValues);
    // const [edit, setEdit] = useState<boolean>(false);

    // Filtrar facturas según el término de búsqueda
    const filteredFacturas = facturasData.filter(
        (factura) =>
            factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            factura.cliente.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Función para obtener el color de la insignia según el estado
    const getBadgeVariant = (estado: string) => {
        switch (estado) {
            case "Pagada":
                return "bg-green-100 text-green-800"
            case "Pendiente":
                return "bg-yellow-100 text-yellow-800"
            case "Vencida":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // const sendMessageWebSocket = () => {
    //     // sendMessage('message', searchTerm)
    //     socket.emit('message', searchTerm)
    // }

    // useEffect(() => {
    //     socket.on('messageServer', data => {
    //         console.log(data);
    //     })
    // }, [])

    // const actionDialog = async (data: unknown) => {
    //     console.log(data);
    // }

    return (
        <div className="flex flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Facturas</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setOpenDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Factura
                    </Button>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Facturas</h2>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <div className="relative flex-1 bg-white rounded-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar facturas..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* <Button onClick={sendMessageWebSocket}>Enviar mensaje</Button> */}
                        </div>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nº Factura</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                                <TableHead className="hidden md:table-cell">Vencimiento</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={7} className="p-0">
                                    <Expansible text='Abrir' text2='Contenido'></Expansible>
                                </TableCell>
                            </TableRow>
                            {filteredFacturas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No se encontraron resultados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredFacturas.map((factura) => (
                                    <TableRow key={factura.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                                {factura.id}
                                            </div>
                                        </TableCell>
                                        <TableCell>{factura.cliente}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeVariant(factura.estado)}`}
                                            >
                                                {factura.estado}
                                            </span>
                                        </TableCell>
                                        <TableCell>{factura.total}</TableCell>
                                        <TableCell className="hidden md:table-cell">{factura.fecha}</TableCell>
                                        <TableCell className="hidden md:table-cell">{factura.vencimiento}</TableCell>
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
                                                        Ver
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Descargar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Enviar
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

                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[45rem]"
                    label2="Agregar Cliente"
                    label1="Editar Cliente"
                    isEdit={true}
                >
                    <InvoiceForm></InvoiceForm>
                </DialogComponent>
            </main>
        </div>
    )
}

