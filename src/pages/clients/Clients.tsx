import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { postClients, putClients, generateReportPDF } from "@/services/clients.service"
import { Block, BodyBlock, BodyReport, IClients } from "@/interfaces/clients.interface"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { TableComponent } from "@/components/table/TableComponent"
import { blockColumns, clientsColumns, defaultValues, IClientsForm } from "./client.data"
import { Filter } from "@/components/table/Filter"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { BlockForm, ClientsForm, ReportForm } from "./ClientsForm"
// import { Download } from "lucide-react";
import { formatDate } from "@/hooks/formaters"
import { clientStore, blockStore } from "@/store/clientStore"
// import { RiFileExcel2Line } from "react-icons/ri"
import { FaRegFilePdf } from "react-icons/fa"
import { DropdownColumnFilter } from "@/components/table/DropdownColumnFilter"
import { IColumns } from "@/components/table/table.interface"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RiFileExcel2Line } from "react-icons/ri"

export const Clients = () => {
    const [showBlocks, setShowBlocks] = useState<boolean>(false);

    const [columns, setColumns] = useState<IColumns<IClients>[]>(clientsColumns);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogReport, setOpenDialogReport] = useState<boolean>(false);
    const [openDialogBlock, setOpenDialogBlock] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openDeleteDialogBlock, setOpenDeleteDialogBlock] = useState<boolean>(false);
    const [openDropdown, setOpenDropdown] = useState(false);


    const [dataDialog, setDataDialog] = useState<IClientsForm>(defaultValues);
    const [dataDialogBlock, setDataDialogBlock] = useState<Block | null>(null);

    const [edit, setEdit] = useState<boolean>(false);

    const { clients, loading, setLoading, setClients, getClientsApi, deleteClient, } = clientStore();

    const { blocks, setBlocks, blockOptions, getBlocksApi, deleteBlock, manipulateBlock } = blockStore();

    useEffect(() => {
        getClientDataStore();
    }, [])

    const getClientDataStore = async () => {
        if (!clients || !blocks || clients.allClients.length == 0 || blocks.allBlocks.length == 0) {
            setLoading(true);
            await getBlocksApi();
            await getClientsApi();
        }
        setLoading(false);
    }

    const handleChangeBlock = (option: string) => {
        const filterClientsByBlock = option !== 'all' ? clients.allClients.filter(cli => cli.blockId === Number(option)) : clients.allClients
        setClients({ allClients: clients.allClients, clients: filterClientsByBlock, clientsFilter: filterClientsByBlock })
    }

    const setClientsFilter = (clientsFilter: IClients[]) => {
        setClients({ allClients: clients.allClients, clients: clients.clients, clientsFilter: clientsFilter })
    }

    const setBlocksFilter = (block: Block[]) => {
        setBlocks({ allBlocks: blocks.allBlocks, blocks: block })
    }

    const addNew = () => {
        setEdit(false);
        setDataDialogBlock(null)
        if (showBlocks) {
            setOpenDialogBlock(true);
        } else {
            setOpenDialog(true);
        }
    }

    const getActionBlocks = (action: string, data: Block) => {
        setDataDialogBlock(data);
        if (action === 'Editar') {
            setEdit(true);
            setTimeout(() => {
                setOpenDialogBlock(true);
            }, 0);
        }
        if (action === 'Eliminar') {
            setTimeout(() => {
                setOpenDeleteDialogBlock(true);
            }, 0);
        }
    }

    const getAction = (action: string, data: IClients) => {
        setDataDialog(data);
        if (action === 'Editar') {
            setEdit(true);
            setTimeout(() => {
                setOpenDialog(true);
            }, 0);
        }
        if (action === 'Eliminar') {
            setTimeout(() => {
                setOpenDeleteDialog(true);
            }, 0);
        }
    }

    const deleteAction = async () => {
        if (showBlocks) {
            await deleteBlock(Number(dataDialogBlock?.id))
            setOpenDeleteDialogBlock(false);
        } else {
            await deleteClient(Number(dataDialog.id))
            setOpenDeleteDialog(false);
        }
    }

    const generateReport = async (data: BodyReport) => {
        setLoading(true)
        const parseData: BodyReport = {
            status: data.status,
            zone: data.zone == 'all' ? '' : data.zone,
            blockId: data.blockId.toString() == 'all' ? 0 : Number(data.blockId)
        }
        const response = await generateReportPDF(parseData) as Blob;
        const url = URL.createObjectURL(response)
        const link = window.document.createElement("a")
        link.href = url
        link.download = `Reporte de Clientes - ${formatDate(new Date())}.pdf`
        window.document.body.appendChild(link)
        link.click()
        window.document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setOpenDialogReport(false);
        setLoading(false);
    }

    const actionDialogBlock = async (data: BodyBlock) => {
        await manipulateBlock(data, edit, Number(dataDialogBlock?.id))
        setOpenDialogBlock(false);
    }

    const actionDialog = async (data: IClientsForm) => {
        const parseData = {
            ...data,
            blockId: Number(data.blockId)
        }

        if (edit) {
            await putClients(Number(dataDialog.id), parseData)
        } else {
            await postClients(parseData)
        }
        setOpenDialog(false);
        await getClientsApi();
    }

    useEffect(() => {
        if (!openDialog) {
            setDataDialog(defaultValues)
        }
    }, [openDialog])

    const exportPDF = () => {
        setOpenDropdown(false);
        setTimeout(() => setOpenDialogReport(true), 0);
    }

    const exportExcel = () => {
        setOpenDropdown(false);
        setTimeout(() => setOpenDialogReport(true), 0);
    }

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Clientes</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="border border-[#ebe0d2] rounded-lg p-1 bg-[#6f4e37]/20 flex items-center justify-center gap-2 mx-4">
                        <Button className={`${showBlocks ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setShowBlocks(false)}>Clientes</Button>
                        <Button className={`${!showBlocks ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setShowBlocks(true)}>Bloques</Button>
                    </div>

                    <Button onClick={addNew} className="hidden lg:flex">
                        <Plus className="mr-2 h-4 w-4" />
                        {showBlocks ? 'Nuevo Bloque' : 'Nuevo Cliente'}
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Clientes</h2>
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <DropdownColumnFilter columns={columns} setColumns={setColumns} />
                        {!showBlocks && (
                            <Select onValueChange={handleChangeBlock}>
                                <SelectTrigger className=" w-full lg:w-32 mt-2 lg:mt-0 ">
                                    <SelectValue placeholder="Bloques" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value='all'>Todos</SelectItem>
                                        {blocks && blocks.allBlocks.map((blo: Block, index: number) => (
                                            <SelectItem key={index} value={blo.id.toString()}>{blo.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}

                        <Button onClick={addNew} className="lg:hidden w-full flex bg-[#6f4e37] hover:bg-[#6f4e37]/90 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            {showBlocks ? 'Nuevo Bloque' : 'Nuevo Cliente'}
                        </Button>

                        <div className="flex w-full lg:w-72 items-center space-x-2">
                            {showBlocks
                                ? <Filter dataBase={blocks.allBlocks} columns={blockColumns} setDataFilter={setBlocksFilter} />
                                : <Filter dataBase={clients.clients} columns={columns} setDataFilter={setClientsFilter} disabledEffect={true} />
                            }
                        </div>

                        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full lg:w-auto bg-[#6f4e37] hover:bg-[#6f4e37]/90 text-white">Exportar</Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-white border shadow-md rounded-md p-2">
                                <DropdownMenuItem onClick={exportExcel} className="cursor-pointer hover:bg-gray-100 rounded-md p-2 flex items-center gap-2">
                                    <RiFileExcel2Line className="text-green-600 font-bold" /> Exportar Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportPDF} className="cursor-pointer hover:bg-gray-100 rounded-md p-2 flex items-center gap-2">
                                    <FaRegFilePdf className="text-red-600 font-bold" /> Exportar PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div>
                    {showBlocks
                        ? <TableComponent columns={blockColumns} dataBase={blocks.blocks} action={getActionBlocks}></TableComponent>
                        : <TableComponent columns={columns.filter(col => col.visible == true)} dataBase={clients.clientsFilter} action={getAction}></TableComponent>
                    }
                </div>
            </main>

            {openDialog && (
                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[90%] lg:w-[48rem]"
                    label2="Agregar Cliente"
                    label1="Editar Cliente"
                    isEdit={edit}
                >
                    <ClientsForm onSubmit={actionDialog} data={dataDialog} blocks={blockOptions}></ClientsForm>
                </DialogComponent>
            )}

            {openDialogBlock && (
                <DialogComponent
                    open={openDialogBlock}
                    setOpen={setOpenDialogBlock}
                    className="w-[90%] lg:w-[45rem]"
                    label2="Agregar Bloque"
                    label1="Editar Bloque"
                    isEdit={edit}
                >
                    <BlockForm onSubmit={actionDialogBlock} data={dataDialogBlock}></BlockForm>
                </DialogComponent>
            )}

            {openDialogReport && (
                <DialogComponent
                    open={openDialogReport}
                    setOpen={setOpenDialogReport}
                    className="w-[90%] lg:w-[20rem]"
                    label2="Generar Reporte"
                    label1="Generar Reporte"
                    isEdit={false}
                >
                    <ReportForm onSubmit={generateReport} data={null} blocks={blockOptions}></ReportForm>
                </DialogComponent>
            )}

            {openDeleteDialog && (
                <DialogComponent
                    open={openDeleteDialog}
                    setOpen={setOpenDeleteDialog}
                    className="w-[90%] lg:w-[28rem]"
                    label2=""
                    label1="Estas seguro que deseas eliminar este cliente?"
                    isEdit={true}
                >
                    <div className="flex items-center justify-center gap-8 mt-5">
                        <Button onClick={() => setOpenDeleteDialog(false)} className="text-lg">Cancelar</Button>
                        <Button onClick={deleteAction} className="text-lg bg-red-500 hover:bg-red-800 text-white">Eliminar</Button>
                    </div>
                </DialogComponent>
            )}

            {openDeleteDialogBlock && (
                <DialogComponent
                    open={openDeleteDialogBlock}
                    setOpen={setOpenDeleteDialogBlock}
                    className="w-[90%] lg:w-[28rem]"
                    label2=""
                    label1="Estas seguro que deseas eliminar este bloque?"
                    isEdit={true}
                >
                    <div className="flex items-center justify-center gap-8 mt-5">
                        <Button onClick={() => setOpenDeleteDialogBlock(false)} className="text-lg">Cancelar</Button>
                        <Button onClick={deleteAction} className="text-lg bg-red-500 hover:bg-red-800 text-white">Eliminar</Button>
                    </div>
                </DialogComponent>
            )}
        </div>
    )
}

