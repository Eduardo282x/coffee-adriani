import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, RefreshCcw } from "lucide-react"
import { deleteProduct, getProduct, getProductDolar, getProductHistory, postProduct, putProduct, updateDolar, updateDolarAutomatic } from "@/services/products.service"
import { DolarBody, GroupProducts, IDolar, IDolarForm, IProducts } from "@/interfaces/product.interface"
import { TableComponent } from "@/components/table/TableComponent"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { Filter } from "@/components/table/Filter"
import { defaultValues, IProductsForm, productsColumns } from "./products.data"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { ProductForm } from "./ProductForm"
import { formatDateWithDateTime, formatNumberWithDots } from "@/hooks/formaters"
import { useLocation } from "react-router"
import { IColumns } from "@/components/table/table.interface"
import { ToolTip } from "@/components/tooltip/ToolTip"
import { MdOutlineCurrencyExchange } from "react-icons/md"
import { DolarForm } from "./DolarForm"

export const Products = () => {
    const location = useLocation();
    const [products, setProducts] = useState<GroupProducts>({ products: [], productsFilter: [] });
    const [dolar, setDolar] = useState<IDolar>();
    const [columns, setColumns] = useState<IColumns<IProducts>[]>(productsColumns);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDolar, setOpenDolar] = useState<boolean>(false);
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
        const response: IProducts[]= await getProduct();
        if(response){
            setProducts({ products: response, productsFilter: response });
        }
        setLoading(false);
    }

    const getProductHistoryApi = async () => {
        setLoading(true);
        const response: IProducts[] = await getProductHistory();
        if(response){
            setProducts({ products: response, productsFilter: response });
        }
        setLoading(false);
    }

    const getProductDolarApi = async () => {
        const response: IDolar = await getProductDolar();
        setDolar(response)
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

    const updateDolarManual = async (data: IDolarForm) => {
        const dataDolar: DolarBody = {
            dolar: Number(data.dolar),
            date: new Date()
        };
        await updateDolar(dataDolar);
        await getProductDolarApi();
        setOpenDolar(false);
        console.log(data);
    }

    useEffect(() => {
        if (!openDialog) {
            setDataDialog(defaultValues)
        }
    }, [openDialog])

    const updateDolarApi = async () => {
        await updateDolarAutomatic();
        await getProductDolarApi();
    }

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
                    <ToolTip tooltip="Actualizar manual" position="left">
                        <Button onClick={() => setOpenDolar(true)}>
                            <MdOutlineCurrencyExchange />
                        </Button>
                    </ToolTip>
                    <ToolTip tooltip="Actualizar tasa dolar" position="left">
                        <Button onClick={updateDolarApi}>
                            <RefreshCcw />
                        </Button>
                    </ToolTip>

                    <div className="border border-[#ebe0d2] px-4 py-1 rounded-lg relative">
                        <span className="font-semibold text-[#ebe0d2]">Dolar:</span> {dolar ? formatNumberWithDots(Number(dolar?.dolar).toFixed(2), '', ' Bs') : '00,0 Bs'}
                        <span className=" absolute -bottom-6 -left-32 text-sm w-80">Ultima actualización: {formatDateWithDateTime(dolar ? dolar.date as Date : new Date())}</span>
                    </div>

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
                open={openDolar}
                setOpen={setOpenDolar}
                className="w-[30rem]"
                label2="Agregar Producto"
                label1="Actualizar Dolar"
                isEdit={true}

            >
                <DolarForm onSubmit={updateDolarManual}></DolarForm>
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

