import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { deleteProduct, getProduct, getProductHistory, postProduct, putProduct } from "@/services/products.service"
import { GroupProducts, IProducts } from "@/interfaces/product.interface"
import { TableComponent } from "@/components/table/TableComponent"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { Filter } from "@/components/table/Filter"
import { defaultValues, IProductsForm, productsColumns } from "./products.data"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { ProductForm } from "./ProductForm"
import { useLocation } from "react-router"
import { IColumns } from "@/components/table/table.interface"
import { DolarComponents } from "@/components/dolar/DolarComponents"

export const Products = () => {
    const location = useLocation();
    const [products, setProducts] = useState<GroupProducts>({ products: [], productsFilter: [] });
    const [columns, setColumns] = useState<IColumns<IProducts>[]>(productsColumns);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [dataDialog, setDataDialog] = useState<IProductsForm>(defaultValues);
    const [edit, setEdit] = useState<boolean>(false);

    useEffect(() => {
        if (location.pathname === '/productos') {
            getProductsApi();
            setColumns(productsColumns)
        }

        if (location.pathname === '/productos/historial') {
            getProductHistoryApi();
            setColumns((prev) => (prev.filter(col => col.icon === false)))
        }
    }, [location])

    const getProductsApi = async () => {
        setLoading(true);
        const response: IProducts[] = await getProduct();
        if (response) {
            setProducts({ products: response, productsFilter: response });
        }
        setLoading(false);
    }

    const getProductHistoryApi = async () => {
        setLoading(true);
        const response: IProducts[] = await getProductHistory();
        if (response) {
            setProducts({ products: response, productsFilter: response });
        }
        setLoading(false);
    }

    const setProductFilter = (products: IProducts[]) => {
        setProducts((prev) => ({ ...prev, productsFilter: products }))
    }

    const getAction = (action: string, data: IProducts) => {
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
        await deleteProduct(Number(dataDialog.id))
        setOpenDeleteDialog(false);
        await getProductsApi();
    }

    const actionDialog = async (data: IProducts) => {
        if (edit) {
            await putProduct(Number(dataDialog.id), data)
        } else {
            await postProduct(data)
        }
        setOpenDialog(false);
        await getProductsApi();
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

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Productos</h1>
                </div>
                <div className="flex items-center gap-4">
                    <DolarComponents />

                    <Button onClick={() => { setOpenDialog(true); setEdit(false) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                </div>
            </header>
            <div className="w-full h-3 bg-[#6f4e37] border-b"></div>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Productos</h2>

                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Filter dataBase={products.products} columns={columns} setDataFilter={setProductFilter} />
                    </div>
                </div>

                <div>
                    <TableComponent columns={columns} dataBase={products.productsFilter} action={getAction}></TableComponent>
                </div>
            </main>

            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[30rem]"
                label2="Agregar Producto"
                label1="Actualizar Producto"
                isEdit={edit}

            >
                <ProductForm onSubmit={actionDialog} data={dataDialog}></ProductForm>
            </DialogComponent>

            <DialogComponent
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                className="w-[28rem]"
                label2=""
                label1="Estas seguro que deseas eliminar este producto?"
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

