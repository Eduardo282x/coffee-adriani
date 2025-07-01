import { DialogComponent } from '@/components/dialog/DialogComponent';
import { ScreenLoader } from '@/components/loaders/ScreenLoader';
import { Filter } from '@/components/table/Filter';
import { TableComponent } from '@/components/table/TableComponent';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AccountPay } from '@/interfaces/payment.interface';
import { postPaymentAccounts, putPaymentAccounts } from '@/services/payment.service';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react'
import { AccountForm, accountsColumns, defaultValues } from './accounts.data';
import { AccountsForm } from './AccountsForm';
import { BaseResponse } from '@/services/base.interface';
import { accountStore } from '@/store/paymentStore';

export const Accounts = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [dataDialog, setDataDialog] = useState<AccountForm>(defaultValues);

    const {
        loading,
        setLoading,
        accounts,
        setAccounts,
        getAccountsApi,
        deleteAccount
    } = accountStore();

    useEffect(() => {
        getAccountStore()
    }, [])

    const getAccountStore = async () => {
        if (!accounts || accounts.allAccounts.length == 0) {
            setLoading(true);
            await getAccountsApi();
        }
        setLoading(false);
    }

    const deleteAction = async () => {
        await deleteAccount(Number(dataDialog?.id))
        setOpenDeleteDialog(false);
    }

    const setAccountsFilters = (data: AccountPay[]) => {
        setAccounts({
            allAccounts: accounts.allAccounts,
            accounts: data
        })
    }

    const getActions = (action: string, data: AccountPay) => {
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

    const actionDialog = async (data: AccountForm) => {
        let closeDialog = false;
        if (edit) {
            await putPaymentAccounts(Number(dataDialog.id), data).then((res) => {
                const parseResponse: BaseResponse = res as BaseResponse;
                closeDialog = parseResponse.success;
            })
        } else {
            await postPaymentAccounts(data).then((res: BaseResponse) => {
                closeDialog = res.success;
            })
        }

        if (closeDialog) {
            setOpenDialog(false);
            await getAccountsApi();
        }
    }

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Cuentas de pago</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={() => { setOpenDialog(true); setEdit(false) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva cuenta
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Cuentas</h2>
                    <div className="flex items-center gap-8">

                        <div className="flex w-80  items-center space-x-2">
                            <Filter dataBase={accounts.allAccounts} columns={accountsColumns} setDataFilter={setAccountsFilters} />
                        </div>
                    </div>
                </div>

                <div>
                    <TableComponent columns={accountsColumns} dataBase={accounts.accounts} action={getActions}></TableComponent>
                </div>
            </main>

            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[35rem]"
                label2="Agregar Cuenta"
                label1="Editar Cuenta"
                isEdit={edit}
            >
                <AccountsForm onSubmit={actionDialog} data={dataDialog} />
                {/* <UsersForm onSubmit={actionDialog} data={dataDialog}></UsersForm> */}
            </DialogComponent>

            <DialogComponent
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                className="w-[28rem]"
                label2=""
                label1="Estas seguro que deseas eliminar este Cuenta?"
                isEdit={true}

            >
                <div className="flex items-center justify-center gap-8 mt-5">
                    <Button onClick={() => setOpenDeleteDialog(false)} className="text-lg ">Cancelar</Button>
                    <Button onClick={deleteAction} className="text-lg bg-red-500 hover:bg-red-800 text-white">Eliminar</Button>
                </div>
            </DialogComponent>
        </div>
    )
}
