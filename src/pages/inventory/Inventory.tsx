import { useCallback, useEffect, useState } from "react";
import { inventoryColumnDetailHistory, inventoryColumns, inventoryColumnsHistory } from "./inventory.data";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TableComponent } from "@/components/table/TableComponent";
import { BodyInventory, BodyInventorySimple, GroupInventory, IInventory, Resume } from "@/interfaces/inventory.interface";
import { postInventory, putInventory } from "@/services/inventory.service";
import { Filter } from "@/components/table/Filter";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Package, Plus } from "lucide-react";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { DialogComponent } from "@/components/dialog/DialogComponent";
import { InventoryForm, InventoryFormUpdate } from "./InventoryForm";
import { InventoryCards } from "./InventoryCards";
import { useSocket } from "@/services/socket.io";
import { productStore } from "@/store/productStore";
import { useOptimizedInventory } from "@/hooks/inventory.hook";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductType } from "@/interfaces/product.interface";
import { getProductType } from "@/services/products.service";
import { DateRangePicker } from "@/components/datepicker/DateRangePicker";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";

export const Inventory = () => {
    const [data, setData] = useState<GroupInventory>({ allInventory: [], inventory: [], });
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogUpdate, setOpenDialogUpdate] = useState<boolean>(false);

    const [typesProduct, setTypesProduct] = useState<ProductType[]>([]);
    const [history, setHistory] = useState<boolean>(false);
    const [resumen, setResumen] = useState<Resume>({ totalProducts: 0, totalMoney: 0, downProducts: 0, zeroProducts: 0 });
    const [controlNumberInput, setControlNumberInput] = useState<string>('');
    const [dataForm, setDataForm] = useState<BodyInventorySimple>({
        productId: 0,
        quantity: 0
    });
    const [inventorySelected, setInventorySelected] = useState<IInventory | null>(null)

    const {
        inventory,

        isLoading,
        refetchInventory,

        inventoryHistory,
        refetchInventoryHistory,
        typeProduct,
        setTypeProduct,
        movementType,
        setMovementType,
        dateRange,
        setDateRange,
        controlNumber,
        setControlNumber
    } = useOptimizedInventory();

    const productOptions = productStore((state) => state.productOptions);
    const products = productStore((state) => state.products);
    const getProductsApi = productStore((state) => state.getProductsApi);

    const toggleButton = (active: boolean) => {
        setHistory(active);
    }

    useEffect(() => {
        if (!products || products.products.length == 0) {
            getProductsApi();
        }
    }, [products, getProductsApi])

    const getProductsTypesApi = async () => {
        const response = await getProductType();
        setTypesProduct(response);
    }

    useEffect(() => {
        getProductsTypesApi();
    }, [])

    useEffect(() => {
        const total: number = inventory.filter(inv => inv.product.type == typeProduct).reduce((acc, item) => acc + (item.product.presentation === '1kilo' ? (item.quantity * 0.2) : item.quantity), 0)
        const totalMoney: number = inventory.filter(inv => inv.product.type == typeProduct).reduce((acc, item) => acc + ((item.product.presentation === '1kilo' ? (item.quantity * 0.2) : item.quantity) * item.product.price), 0);
        // const total: number = inventory.filter(inv => inv.product.type == typeProduct).reduce((acc, item) => acc + item.quantity, 0)
        const down: number = inventory.filter(inv => inv.product.type == typeProduct).filter(pro => pro.quantity < (total * 0.30)).length;
        const zero: number = inventory.filter(inv => inv.product.type == typeProduct).filter(pro => pro.quantity === 0).length;
        setResumen({ totalProducts: total, totalMoney: totalMoney, downProducts: down, zeroProducts: zero })
        setData({ allInventory: inventory, inventory: inventory });
    }, [inventory, typeProduct])

    useEffect(() => {
        setControlNumberInput(controlNumber);
    }, [controlNumber]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (controlNumberInput !== controlNumber) {
                setControlNumber(controlNumberInput);
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, [controlNumberInput, controlNumber, setControlNumber]);

    const setInventoryFilter = (inventoryFilter: IInventory[]) => {
        setData((prev) => ({ ...prev, inventory: inventoryFilter }));
    }

    const actionDialog = async (data: BodyInventory) => {
        await postInventory(data)
        setOpenDialog(false);
        await refetchInventory();
        await refetchInventoryHistory();
    }

    const actionDialogUpdate = async (data: BodyInventorySimple) => {
        if (inventorySelected) {
            await putInventory(inventorySelected.id, data);
        }
        setOpenDialogUpdate(false);
        await refetchInventory();
        await refetchInventoryHistory();
    }

    const newElement = () => {
        setOpenDialog(true);
    }

    const getAction = (action: string, data: IInventory) => {
        if (action == 'Editar') {
            setInventorySelected(data);
            setDataForm({ productId: data.productId, quantity: data.quantity })
        }
        setTimeout(() => {
            setOpenDialogUpdate(true);
        }, 0);
    }

    const handleSocketMessage = useCallback(async (data: unknown) => {
        console.log(data);
        await refetchInventory();
        await refetchInventoryHistory();
    }, [refetchInventory, refetchInventoryHistory]);

    useSocket('message', handleSocketMessage);

    const onChangeControlNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setControlNumberInput(e.target.value)
    }

    return (
        <div className="flex flex-col">
            {isLoading && (
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

                <Button onClick={newElement}>
                    <Plus className="mr-2 h-4 w-4" />
                    Actualizar inventario
                </Button>
            </header>
            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Inventario</h2>

                    <div className={`flex w-full ${history ? 'justify-end max-w-3xl' : 'max-w-lg'} items-center space-x-2`}>
                        {history && (
                            <>
                                <div className="relative bg-white rounded-md w-60">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="pl-8"
                                        value={controlNumberInput}
                                        onChange={onChangeControlNumber}
                                    />
                                </div>
                                <DateRangePicker setDatePicker={setDateRange} datePicker={dateRange} label={''} />
                            </>
                        )}
                        <Select value={typeProduct} onValueChange={setTypeProduct}>
                            <SelectTrigger className="w-24">
                                <SelectValue placeholder="Tipo de Producto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {typesProduct && typesProduct.map((ty: ProductType, index: number) => (
                                        <SelectItem key={index} value={ty.type}>{ty.type}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {history && (
                            <>
                                <Select value={movementType} onValueChange={setMovementType}>
                                    <SelectTrigger className="w-24">
                                        <SelectValue placeholder="Tipo de Movimiento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value={'ALL'}>Todos</SelectItem>
                                            <SelectItem value={'IN'}>Entrada</SelectItem>
                                            <SelectItem value={'OUT'}>Salida</SelectItem>
                                            <SelectItem value={'ADJUSTMENT'}>Ajuste</SelectItem>
                                            <SelectItem value={'EDIT'}>Edición</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </>
                        )}
                        {!history && (
                            <Filter dataBase={data.allInventory} columns={inventoryColumns} setDataFilter={setInventoryFilter} />
                        )}
                    </div>
                </div>

                {!history && (
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <InventoryCards
                            title='Total de Productos'
                            value={`${resumen.totalProducts} ($${formatOnlyNumberWithDots(resumen.totalMoney)})`}
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
                )}

                <div>
                    {history ? (
                        <TableComponent
                            key="inventory-history"
                            columns={inventoryColumnsHistory}
                            dataBase={inventoryHistory}
                            isExpansible={true}
                            renderRow={
                                (details) => (
                                    <TableComponent
                                        dataBase={details.details}
                                        columns={inventoryColumnDetailHistory}>
                                    </TableComponent>
                                )
                            }></TableComponent>
                    ) : (
                        <TableComponent key="inventory-list" columns={inventoryColumns} dataBase={data.inventory} action={getAction}></TableComponent>
                    )}
                </div>

                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-176"
                    label2="Actualizar Inventario"
                    label1="Actualizar Inventario"
                    isEdit={false}

                >
                    <InventoryForm onSubmit={actionDialog} productOptions={productOptions} products={products.products} data={undefined}></InventoryForm>
                </DialogComponent>

                <DialogComponent
                    open={openDialogUpdate}
                    setOpen={setOpenDialogUpdate}
                    className="w-120"
                    label2="Actualizar Inventario"
                    label1="Actualizar Inventario"
                    isEdit={false}

                >
                    <InventoryFormUpdate onSubmit={actionDialogUpdate} productOptions={productOptions} products={products.products} data={dataForm}></InventoryFormUpdate>
                </DialogComponent>
            </main>
        </div>
    )
}

