import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { TableComponent } from "@/components/table/TableComponent"
// import { UsersColumns, defaultValues, IUsersForm } from "./client.data"
import { Filter } from "@/components/table/Filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { getUsers, postUsers, putUsers } from "@/services/user.service"
import { GroupUsers, IUsers } from "@/interfaces/user.interface"
import { defaultValues, IUsersForm, usersColumns } from "./users.data"
import { UsersForm } from "./UsersForm"
// import { UsersForm } from "./UsersForm"


export const Users = () => {
    const [users, setUsers] = useState<GroupUsers>({ allUsers: [], users: [] });
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [dataDialog, setDataDialog] = useState<IUsersForm>(defaultValues);
    const [edit, setEdit] = useState<boolean>(false);

    useEffect(() => {
        getUsersApi()
    }, [])

    const getUsersApi = async () => {
        setLoading(true);
        const response: IUsers[] = await getUsers();
        setUsers({ allUsers: response, users: response });
        setLoading(false);
    }

    const setUsersFilter = (users: IUsers[]) => {
        setUsers((prev) => ({ ...prev, users: users }))
    }

    const getAction = (action: string, data: IUsersForm) => {
        if (action === 'Editar') {
            setOpenDialog(true);
            setEdit(true)
        }
        if (action === 'Eliminar') {
            setOpenDeleteDialog(true);
        }
        setDataDialog(data);
    }

    // const deleteAction = async () => {
    //     await deleteUsers(Number(dataDialog.id))
    //     setOpenDeleteDialog(false);
    //     await getUsersApi();
    // }

    const actionDialog = async (data: IUsersForm) => {
        const parseData = {
            ...data,
            rolId: Number(data.rolId)
        }

        if (edit) {
            await putUsers(Number(dataDialog.id), parseData)
        } else {
            await postUsers(parseData)
        }
        setOpenDialog(false);
        await getUsersApi();
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

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Usuarios</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={() => { setOpenDialog(true); setEdit(false) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Usuario
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Usuarios</h2>
                    <div className="flex items-center gap-8">

                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Filter dataBase={users.allUsers} columns={usersColumns} setDataFilter={setUsersFilter} />
                        </div>
                    </div>
                </div>

                <div>
                    <TableComponent columns={usersColumns} dataBase={users.users} action={getAction}></TableComponent>
                </div>
            </main>

            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[35rem]"
                label2="Agregar Usuario"
                label1="Editar Usuario"
                isEdit={edit}
            >
                <UsersForm onSubmit={actionDialog} data={dataDialog}></UsersForm>
            </DialogComponent>

            <DialogComponent
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                className="w-[28rem]"
                label2=""
                label1="Estas seguro que deseas eliminar este usuario?"
                isEdit={true}

            >
                <div className="flex items-center justify-center gap-8 mt-5">
                    <Button onClick={() => setOpenDeleteDialog(false)} className="text-lg ">Cancelar</Button>
                    <Button onClick={() => setOpenDeleteDialog(false)} className="text-lg bg-red-500 hover:bg-red-800">Eliminar</Button>
                </div>
            </DialogComponent>
        </div>
    )
}

