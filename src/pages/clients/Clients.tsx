import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { deleteClients, getBlocks, getClients, postClients, putClients } from "@/services/clients.service"
import { Block, GroupClients, IClients } from "@/interfaces/clients.interface"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { TableComponent } from "@/components/table/TableComponent"
import { clientsColumns, defaultValues, IClientsForm } from "./client.data"
import { Filter } from "@/components/table/Filter"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { ClientsForm } from "./ClientsForm"

export const Clients = () => {
    const [clients, setClients] = useState<GroupClients>({ allClients: [], clients: [], clientsFilter: [] });
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [dataDialog, setDataDialog] = useState<IClientsForm>(defaultValues);
    const [edit, setEdit] = useState<boolean>(false);

    useEffect(() => {
        getClientsApi()
        getBlocksApi()
    }, [])

    const getClientsApi = async () => {
        setLoading(true);
        const response: IClients[] = await getClients();
        setClients({ allClients: response, clients: response, clientsFilter: response });
        setLoading(false);
    }

    const getBlocksApi = async () => {
        const response = await getBlocks();
        setBlocks(response);
    }

    const handleChangeBlock = (option: string) => {
        const filterClientsByBlock = option !== 'all' ? clients.allClients.filter(cli => cli.blockId === Number(option)) : clients.allClients
        setClients((prev) => ({ ...prev, clients: filterClientsByBlock }))
    }

    const setClientsFilter = (clients: IClients[]) => {
        setClients((prev) => ({ ...prev, clientsFilter: clients }))
    }

    const getAction = (action: string, data: IClientsForm) => {
        if (action === 'Editar') {
            setOpenDialog(true);
            setEdit(true)
        }
        if (action === 'Eliminar') {
            setOpenDeleteDialog(true);
        }
        setDataDialog(data);
    }

    const deleteAction = async () => {
        await deleteClients(Number(dataDialog.id))
        setOpenDeleteDialog(false);
        await getClientsApi();
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

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Clientes</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={() => { setOpenDialog(true); setEdit(false) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h2>
                    <div className="flex items-center gap-8">
                        <Select onValueChange={handleChangeBlock}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Bloques" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value='all'>Todos</SelectItem>
                                    {blocks && blocks.map((blo: Block, index: number) => (
                                        <SelectItem key={index} value={blo.id.toString()}>{blo.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>


                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Filter dataBase={clients.clients} columns={clientsColumns} setDataFilter={setClientsFilter} />
                        </div>
                    </div>
                </div>

                <div>
                    <TableComponent columns={clientsColumns} dataBase={clients.clientsFilter} action={getAction}></TableComponent>
                </div>
            </main>

            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[45rem]"
                label2="Agregar Cliente"
                label1="Editar Cliente"
                isEdit={edit}

            >
                <ClientsForm onSubmit={actionDialog} data={dataDialog}></ClientsForm>
            </DialogComponent>

            <DialogComponent
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                className="w-[28rem]"
                label2=""
                label1="Estas seguro que deseas eliminar este cliente?"
                isEdit={true}

            >
                <div className="flex items-center justify-center gap-8 mt-5">
                    <Button onClick={() => setOpenDeleteDialog(false)} className="text-lg ">Cancelar</Button>
                    <Button onClick={deleteAction} className="text-lg bg-red-500 hover:bg-red-800">Eliminar</Button>
                </div>
            </DialogComponent>
        </div>
    )
}

