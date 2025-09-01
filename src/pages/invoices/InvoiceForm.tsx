import { Autocomplete } from "@/components/autocomplete/Autocomplete";
import { TableComponent } from "@/components/table/TableComponent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IClients } from "@/interfaces/clients.interface";
import { BodyInventory, GroupInventoryDate, IInventory } from "@/interfaces/inventory.interface";
// import { getInventory } from "@/services/inventory.service";
import { FC, useEffect, useState } from "react";
import { productColumns } from "./invoices.data";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FromProps } from "@/interfaces/form.interface";
import { DatePicker } from "@/components/datepicker/DatePicker";
import { Snackbar } from "@/components/snackbar/Snackbar";
import toast from "react-hot-toast";
import { addDays, addYears } from "date-fns";
import { IInvoice } from "@/interfaces/invoice.interface";
import { clientStore } from "@/store/clientStore";
import { Trash2 } from "lucide-react";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";

interface InvoiceFormProps extends FromProps {
    inventory: GroupInventoryDate
}

export const InvoiceForm: FC<InvoiceFormProps> = ({ onSubmit, data, inventory }) => {
    // const [clients, setClients] = useState<GroupClientsOptions>({ allClients: [], clients: [] });
    const [clientSelected, setClientSelected] = useState<IClients | null>(null);
    const [inventoryData, setInventoryData] = useState<IInventory[]>([]);
    const [gifData, setGiftData] = useState<BodyInventory[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [controlNumber, setControlNumber] = useState<string>('');
    const [priceUSD, setPriceUSD] = useState<boolean>(false);
    const [consignment, setConsignment] = useState<boolean>(false);
    const [dateDispatch, setDateDispatch] = useState<Date | undefined>(new Date());
    const [dateDue, setDateDue] = useState<Date | undefined>(addDays(new Date(), 8));

    const { clients, clientOptions, getClientsApi } = clientStore();

    const newGift = () => {
        setGiftData(prev => [...prev, { productId: 0, quantity: 1 }])
    }


    useEffect(() => {
        const parseData: IInvoice = data as IInvoice;
        if (data != null) {
            const findClient = clients.allClients.find((cli) => cli.id === parseData.clientId);
            setConsignment(parseData.consignment);
            setControlNumber(parseData.controlNumber);
            setDateDispatch(new Date(parseData.dispatchDate));
            setDateDue(new Date(parseData.dueDate));
            setClientSelected(findClient || null);

            const inventoryData = parseData.invoiceItems.filter(item => item.type == 'SALE').map((inv) => {
                const findInventory = inventory.allInventory.find((invData) => invData.productId === inv.productId) as IInventory;
                if (!findInventory) {
                    return undefined;
                }
                return {
                    ...findInventory,
                    quantity: inv.quantity,
                    subtotal: inv.quantity * findInventory?.product.price || 0
                };
            });

            setGiftData(parseData.invoiceItems.filter(item => item.type == 'GIFT').map((inv) => ({
                productId: inv.productId,
                quantity: inv.quantity
            })))

            setTimeout(() => {
                setInventoryData(inventoryData.filter((inv) => inv !== undefined) as IInventory[]);
            }, 0);
        }
    }, [data, inventory, clients])

    const getClientStoreApi = async () => {
        if (!clients || clients.allClients.length == 0) {
            await getClientsApi();
        }
    }

    useEffect(() => {
        getClientStoreApi();
    }, [])

    const selectClient = (client: string) => {
        const findClient = clients.allClients.find((cli) => cli.id === Number(client));
        if (findClient) {
            setClientSelected(findClient)
        }
    }

    const onChangeGift = (data: string, index: number) => {
        const selectedProductData = inventory.allInventory.find((inv) => inv.id === Number(data));
        if (selectedProductData) {
            console.log(selectedProductData);
            setGiftData(prev => prev.map((item, idx) => {
                if (idx === index) {
                    return {
                        ...item,
                        productId: selectedProductData.productId,
                    }
                }
                return item;
            }))
        }
    }

    const onChangeQuantityGift = (quantity: string, index: number) => {
        setGiftData(prev => prev.map((item, idx) => {
            if (idx === index) {
                return {
                    ...item,
                    quantity: Number(quantity),
                }
            }
            return item;
        }))
    }

    const removeGift = (index: number) => {
        setGiftData(prev => prev.filter((_, idx) => idx !== index));
    }

    const selectProduct = (data: string) => {
        const selectedProductData = inventory.allInventory.find((inv) => inv.id === Number(data));
        if (selectedProductData) {
            const selectedProduct = inventoryData.find((inv) => inv.id === Number(data));
            if (!selectedProduct) {
                setInventoryData((prev) => [...prev,
                {
                    ...selectedProductData,
                    quantity: 1,
                    subtotal: Number(selectedProductData.product.price)
                }
                ])
            }
        }
    }

    const changeDataTable = (action: string, data: IInventory) => {
        if (action == 'editable') {
            setInventoryData((prev) => prev.map((inv) => {
                if (inv.id === data.id) {
                    return {
                        ...inv,
                        quantity: data.quantity,
                        subtotal: data.quantity * inv.product.price,
                    };
                } else {
                    return inv;
                }
            }))
        }

        if (action == 'Eliminar') {
            setInventoryData((prev) => prev.filter((inv) => inv.id !== data.id))
        }
    }

    useEffect(() => {
        const total = inventoryData.reduce((acc, inv) => {
            return acc + (inv.subtotal ? inv.subtotal : 0);
        }, 0)
        setTotal(total);
    }, [inventoryData])

    const changePrice = () => {
        setPriceUSD(!priceUSD);
        setInventoryData((prev) => prev.map((inv) => {
            return {
                ...inv,
                subtotal: inv.quantity * (!priceUSD ? Number(inv.product.priceUSD) : Number(inv.product.price))
            }
        }))
    }

    const onChangeDateDispatch = (date: Date | undefined) => {
        setDateDispatch(date);
        const moreDays = addDays(date as Date, 8);
        if (moreDays) {
            setDateDue(moreDays);
        }
    }

    const onSubmitInvoice = () => {
        if (controlNumber === '') {
            toast.custom(<Snackbar success={false} message={"Por favor, complete todos los campos del formulario"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return
        }

        const combineDataInvoiceGift = gifData.map(item => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            type: 'GIFT'
        }));

        const combineDataInvoice = inventoryData.map(item => ({
            productId: item.product.id,
            quantity: Number(item.quantity),
        }));

        const bodyInvoice = {
            clientId: clientSelected?.id,
            controlNumber: controlNumber,
            consignment: consignment,
            dispatchDate: dateDispatch,
            dueDate: dateDue,
            priceUSD: priceUSD,
            details: [...combineDataInvoiceGift, ...combineDataInvoice]
        }
        
        onSubmit(bodyInvoice)
    }

    return (
        <div className="">
            <div className="flex items-center justify-between w-full gap-5 my-4">
                <div className="flex flex-col items-start justify-start gap-2 w-80">
                    <Button variant='primary' onClick={newGift} className="bg-[#6f4e37] text-white" type="button">
                        Agregar regalo
                    </Button>

                    {gifData && gifData.map((item, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-2 w-full">
                            <Autocomplete placeholder="Seleccione un producto" data={inventory.inventory} onChange={(data) => onChangeGift(data, index)}></Autocomplete>
                            <Input className="w-15" value={item.quantity} onChange={(e) => onChangeQuantityGift(e.target.value, index)} type="number" />
                            <Button size='icon' onClick={() => removeGift(index)}><Trash2 className="text-red-500" /></Button>
                        </div>
                    ))}
                    {/* <Input className="w-full" value={controlNumber} onChange={(e) => setControlNumber(e.target.value)} /> */}
                </div>

                <div className="flex flex-col items-start justify-start gap-2 w-80">
                    <Label className="text-right w-42">
                        Numero de factura
                    </Label>
                    <Input className="w-full" value={controlNumber} onChange={(e) => setControlNumber(e.target.value)} />
                </div>
            </div>

            <div className="flex items-center justify-between w-full gap-5 my-4">
                <DatePicker setDate={onChangeDateDispatch} date={dateDispatch} label="Fecha de Despacho" maxDate={new Date()} minDate={new Date(2000)} />

                <DatePicker setDate={setDateDue} date={dateDue} label="Fecha de Vencimiento" minDate={dateDispatch} maxDate={addYears(dateDispatch as Date, 5)} />
            </div>

            <div className="flex items-center justify-between w-full gap-5 my-4">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label className="text-right w-42">
                        Cliente
                    </Label>
                    <Autocomplete placeholder="Seleccione un cliente" data={clientOptions} onChange={selectClient} valueDefault={clientSelected?.id}></Autocomplete>
                </div>

                <div className="flex items-center justify-between w-full translate-y-2 border rounded-md px-2 py-1">
                    Consignación
                    <Switch onClick={() => setConsignment(!consignment)} />
                </div>
            </div>

            <div className="flex items-center justify-between w-full gap-5 my-4">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label className="text-right w-42">
                        Producto
                    </Label>
                    <Autocomplete placeholder="Seleccione un producto" data={inventory.inventory} onChange={selectProduct}></Autocomplete>
                </div>

                <div className="flex items-center justify-between w-full translate-y-2 border rounded-md px-2 py-1">
                    Precio en divisas
                    <Switch onClick={changePrice} />
                </div>
            </div>

            <TableComponent columns={productColumns} total={formatOnlyNumberWithDots(total)} dataBase={inventoryData} action={changeDataTable} includeFooter={true}></TableComponent>

            <div className="flex items-center justify-end mt-4">
                <Button disabled={total === 0 && gifData.length == 0} onClick={onSubmitInvoice}>Generar Factura</Button>
            </div>

            {/* <div className="fixed bottom-0 left-0 w-full border-t bg-white px-6 py-4 flex justify-end z-10">
                <Button disabled={total === 0} onClick={onSubmitInvoice}>
                    Generar Factura
                </Button>
            </div> */}
        </div>
    )
}
