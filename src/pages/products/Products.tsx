import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { deleteProduct, getProduct, getProductDolar, getProductHistory, postProduct, putProduct } from "@/services/products.service"
import { GroupProducts, IDolar, IProducts } from "@/interfaces/product.interface"
import { TableComponent } from "@/components/table/TableComponent"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { Filter } from "@/components/table/Filter"
import { defaultValues, IProductsForm, productsColumns } from "./products.data"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { ProductForm } from "./ProductForm"
import { formatNumberWithDots } from "@/hooks/formaters"
import { useLocation } from "react-router"
import { IColumns } from "@/components/table/table.interface"

export const Products = () => {
    const location = useLocation();
    const [products, setProducts] = useState<GroupProducts>({ products: [], productsFilter: [] });
    const [dolar, setDolar] = useState<IDolar>();
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
        getProductDolarApi();
    }, [location])

    const getProductsApi = async () => {
        setLoading(true);
        const response: IProducts[] = await getProduct();
        setProducts({ products: response, productsFilter: response });
        setLoading(false);
    }

    const getProductHistoryApi = async () => {
        setLoading(true);
        const response: IProducts[] = await getProductHistory();
        setProducts({ products: response, productsFilter: response });
        setLoading(false);
    }

    const getProductDolarApi = async () => {
        const response: IDolar = await getProductDolar();
        setDolar(response)
    }

    const setProductFilter = (products: IProducts[]) => {
        setProducts((prev) => ({ ...prev, productsFilter: products }))
    }

    // Función para obtener el color de la insignia según el estado
    // const getBadgeVariant = (estado: string) => {
    //     switch (estado) {
    //         case "Disponible":
    //             return "bg-green-100 text-green-800"
    //         case "Bajo Stock":
    //             return "bg-yellow-100 text-yellow-800"
    //         case "Agotado":
    //             return "bg-red-100 text-red-800"
    //         default:
    //             return "bg-gray-100 text-gray-800"
    //     }
    // }

    const getAction = (action: string, data: IProducts) => {
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

            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Productos</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="border px-4 py-1 rounded-lg">
                        <span className="font-semibold">Dolar:</span> {formatNumberWithDots(Number(dolar?.dolar).toFixed(2), '', ' Bs')}
                    </div>

                    <Button onClick={() => { setOpenDialog(true); setEdit(false) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Gestión de Productos</h2>

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
                    <Button onClick={deleteAction} className="text-lg bg-red-500 hover:bg-red-800">Eliminar</Button>
                </div>
            </DialogComponent>
        </div>
    )
}

