import { useState } from "react";
import { supplierColumns } from "./supplier.data";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TableComponent } from "@/components/table/TableComponent";
import { ISupplier } from "@/interfaces/supplier.interface";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { DialogComponent } from "@/components/dialog/DialogComponent";
import { SupplierForm } from "./SupplierForm";
import { useSuppliers } from "@/hooks/supplier.hook";
import { Input } from "@/components/ui/input";

export const Supplier = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [supplierSelected, setSupplierSelected] = useState<ISupplier | null>(null);
    const [edit, setEdit] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>('');

    const {
        suppliers,
        isLoading,
        refetch,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        handleChangeSearch,
    } = useSuppliers();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        handleChangeSearch(value);
    };

    const newElement = () => {
        setEdit(false);
        setSupplierSelected(null);
        setOpenDialog(true);
    };

    const getAction = (action: string, data: ISupplier) => {
        if (action === 'Editar') {
            setEdit(true);
            setSupplierSelected(data);
            setTimeout(() => {
                setOpenDialog(true);
            }, 0);
        }
        if (action === 'Eliminar') {
            setSupplierSelected(data);
            setTimeout(() => {
                setOpenDeleteDialog(true);
            }, 0);
        }
    };

    const actionDialog = async (formData: { name: string; rif: string; phone: string; address: string; rubro: string, email: string }) => {
        if (edit && supplierSelected) {
            await updateSupplier({ id: supplierSelected.id, data: formData });
        } else {
            await createSupplier(formData);
        }
        setOpenDialog(false);
        setSupplierSelected(null);
        await refetch();
    };

    const deleteAction = async () => {
        if (supplierSelected) {
            await deleteSupplier(supplierSelected.id);
            setOpenDeleteDialog(false);
            setSupplierSelected(null);
            await refetch();
        }
    };

    return (
        <div className="flex flex-col">
            <header className="flex bg-[#6f4e37] text-white h-14 lg:h-[60px] items-center gap-4 border-b px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Proveedores</h1>
                </div>

                <Button onClick={newElement}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Proveedor
                </Button>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Proveedores</h2>

                    <div className="flex w-full max-w-lg items-center space-x-2">
                        <div className="relative flex-1 bg-white rounded-md w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar proveedor..."
                                className="pl-8"
                                value={searchInput}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <TableComponent
                        key="suppliers-list"
                        columns={supplierColumns}
                        loading={isLoading}
                        dataBase={suppliers}
                        action={getAction}
                    />
                </div>
            </main>

            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[90%] lg:w-[48rem]"
                label2="Agregar Proveedor"
                label1="Editar Proveedor"
                isEdit={edit}
            >
                <SupplierForm onSubmit={actionDialog} data={supplierSelected} />
            </DialogComponent>

            {openDeleteDialog && (
                <DialogComponent
                    open={openDeleteDialog}
                    setOpen={setOpenDeleteDialog}
                    className="w-[90%] lg:w-[28rem]"
                    label2=""
                    label1="Estás seguro que deseas eliminar este proveedor?"
                    isEdit={true}
                >
                    <div className="flex items-center justify-center gap-8 mt-5">
                        <Button onClick={() => setOpenDeleteDialog(false)} className="text-lg">Cancelar</Button>
                        <Button onClick={deleteAction} className="text-lg bg-red-500 hover:bg-red-800 text-white">Eliminar</Button>
                    </div>
                </DialogComponent>
            )}
        </div>
    );
};
