import { useEffect, useState } from "react"
import { extraColumn, inventoryColumns } from "./inventory.data"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TableComponent } from "@/components/table/TableComponent"
import { BodyInventory, GroupInventory, IInventory, Resume } from "@/interfaces/inventory.interface"
import { getInventory, getInventoryHistory, postInventory, putInventory } from "@/services/inventory.service"
import { Filter } from "@/components/table/Filter"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Package, Plus } from "lucide-react"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { DialogComponent } from "@/components/dialog/DialogComponent"
import { InventoryForm } from "./InventoryForm"
import { IColumns } from "@/components/table/table.interface"
import { InventoryCards } from "./InventoryCards"
import { useSocket } from "@/services/socket.io"
import { IProducts } from "@/interfaces/product.interface"
import { getProduct } from "@/services/products.service"
import { IOptions } from "@/interfaces/form.interface"

export const Inventory = () => {
    const [inventory, setInventory] = useState<IInventory[]>([]);
    const [inventoryHistory, setInventoryHistory] = useState<IInventory[]>([]);
    const [data, setData] = useState<GroupInventory>({ allInventory: [], inventory: [], });
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<IOptions[]>([]);
    const [column, setColumn] = useState<IColumns<IInventory>[]>(inventoryColumns)
    const [history, setHistory] = useState<boolean>(false);
    const [resumen, setResumen] = useState<Resume>({ totalProducts: 0, downProducts: 0, zeroProducts: 0 });
    const [dataForm, setDataForm] = useState<BodyInventory>({
        productId: 0,
        quantity: 0
    });
    const [inventorySelected, setInventorySelected] = useState<IInventory | null>(null)
    // Filtrar inventario según el término de búsqueda

    // Función para calcular el porcentaje de stock
    // const calcularPorcentajeStock = (stock: number, stockMinimo: number) => {
    //     const porcentaje = (stock / (stockMinimo * 2)) * 100
    //     return Math.min(porcentaje, 100)
    // }

    // // Función para obtener el color según el nivel de stock
    // const getStockColor = (stock: number, stockMinimo: number) => {
    //     if (stock === 0) return "text-red-600"
    //     if (stock < stockMinimo) return "text-yellow-600"
    //     return "text-green-600"
    // }

    // // Función para obtener el color de la barra de progreso
    // const getProgressColor = (stock: number, stockMinimo: number) => {
    //     if (stock === 0) return "bg-red-600"
    //     if (stock < stockMinimo) return "bg-yellow-600"
    //     return "bg-green-600"
    // }

    const toggleButton = (active: boolean) => {
        setHistory(active);
        if (history === active) return;
        if (active) {
            setData({ allInventory: inventoryHistory, inventory: inventoryHistory })
            setColumn((prev) => ([...prev.filter(col => col.icon == false), ...extraColumn]))
        } else {
            setData({ allInventory: inventory, inventory: inventory })
            setColumn(inventoryColumns)
        }
    }

    useEffect(() => {
        getInventoryApi();
        getInventoryHistoryApi();
        getProductsApi();
    }, [])

    const getProductsApi = async () => {
        const response: IProducts[] = await getProduct();
        if(response){
            const parseProducts = response.map(pro => {
                return {
                    label: pro.name,
                    value: pro.id
                }
            })
            setProducts(parseProducts);
        }
    }

    const getInventoryHistoryApi = async () => {
        setLoading(true)
        const response: IInventory[] = await getInventoryHistory();
        if(response) setInventoryHistory(response);
        setLoading(false);
    }

    const getInventoryApi = async () => {
        setLoading(true)
        const response: IInventory[] = await getInventory();
        if(response) {
            setInventory(response);
            const total: number = response.reduce((acc, item) => acc + item.quantity, 0)
            const down: number = response.filter(pro => pro.quantity < 50).length;
            const zero: number = response.filter(pro => pro.quantity === 0).length;
            setResumen({ totalProducts: total, downProducts: down, zeroProducts: zero })
            setData({ allInventory: response, inventory: response });
        }
        setLoading(false);
    }

    const setInventoryFilter = (inventoryFilter: IInventory[]) => {
        setData((prev) => ({ ...prev, inventory: inventoryFilter }));
    }

    const actionDialog = async (data: BodyInventory) => {
        if (dataForm.productId != 0 && inventorySelected) {
            await putInventory(inventorySelected.id, data)
        } else {
            await postInventory(data)
        }
        setOpenDialog(false);
        await getInventoryApi();
        await getInventoryHistoryApi();
    }

    const getAction = (action: string, data: IInventory | null) => {
        setInventorySelected(data);
        if (action == 'Nuevo') {
            setDataForm({ productId: 0, quantity: 0 })
        }

        if (action == 'Editar') {
            const historyFilter = inventoryHistory.filter(inv => inv.productId === data?.productId);
            const historySelected = historyFilter[historyFilter.length - 1]
            setDataForm({ productId: Number(data?.productId), quantity: historySelected.quantity })
        }
        setTimeout(() => {
            setOpenDialog(true);
        }, 0);
        // inventoryHistory
    }

    useSocket('message', async (data) => {
        console.log(data);
        await getInventoryApi();
        await getInventoryHistoryApi();
    })

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex bg-[#6f4e37] text-white h-14 lg:h-[60px] items-center gap-4 border-b px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Inventario</h1>
                </div>

                <div className="border border-[#ebe0d2] rounded-lg p-1 bg-[#6f4e37]/20 flex items-center justify-center gap-2">
                    <Button className={`${history ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => toggleButton(false)}>Inventario</Button>
                    <Button className={`${!history ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => toggleButton(true)}>Historial</Button>
                </div>

                <Button onClick={() => getAction('Nuevo', null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Actualizar inventario
                </Button>
            </header>
            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Inventario</h2>

                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Filter dataBase={data.allInventory} columns={column} setDataFilter={setInventoryFilter} />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <InventoryCards
                        title='Total de Productos'
                        value={resumen.totalProducts}
                        description='Productos en inventario'
                        icon={Package}
                        color='bg-blue-100 text-blue-800'
                    ></InventoryCards>
                    <InventoryCards
                        title='Productos con Stock Bajo'
                        value={resumen.downProducts}
                        description='Productos en inventario'
                        icon={ArrowUpDown}
                        color='bg-yellow-100 text-yellow-800'
                    ></InventoryCards>
                    <InventoryCards
                        title='Productos Agotados'
                        value={resumen.zeroProducts}
                        description='Productos en inventario'
                        icon={Package}
                        color='bg-red-100 text-red-800'
                    ></InventoryCards>
                </div>

                <div>
                    <TableComponent columns={column} dataBase={data.inventory} action={getAction}></TableComponent>
                </div>

                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[30rem]"
                    label2="Actualizar Inventario"
                    label1="Actualizar Inventario"
                    isEdit={false}

                >
                    <InventoryForm onSubmit={actionDialog} products={products} data={dataForm}></InventoryForm>
                </DialogComponent>
            </main>
        </div>
    )
}

