import { Autocomplete } from "@/components/autocomplete/Autocomplete";
import { TableComponent } from "@/components/table/TableComponent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GroupClientsOptions, IClients } from "@/interfaces/clients.interface";
import { GroupInventoryDate, IInventory } from "@/interfaces/inventory.interface";
import { getClients } from "@/services/clients.service";
import { getInventory } from "@/services/inventory.service";
import { FC, useEffect, useState } from "react";
import { productColumns } from "./invoices.data";
import { formatNumberWithDots } from "@/hooks/formaters";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FromProps } from "@/interfaces/form.interface";
import { DatePicker } from "@/components/datepicker/DatePicker";
import { Snackbar } from "@/components/snackbar/Snackbar";
import toast from "react-hot-toast";
import { addYears } from "date-fns";


export const InvoiceForm: FC<FromProps> = ({ onSubmit }) => {
    const [clients, setClients] = useState<GroupClientsOptions>({ allClients: [], clients: [] });
    const [clientSelected, setClientSelected] = useState<IClients | null>(null);
    const [inventory, setInventory] = useState<GroupInventoryDate>({ allInventory: [], inventory: [] });
    const [inventoryData, setInventoryData] = useState<IInventory[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [controlNumber, setControlNumber] = useState<string>('');
    const [priceUSD, setPriceUSD] = useState<boolean>(false);
    const [consignment, setConsignment] = useState<boolean>(false);
    const [dateDispatch, setDateDispatch] = useState<Date>(new Date());
    const [dateDue, setDateDue] = useState<Date>(new Date());

    const getClientsApi = async () => {
        const response: IClients[] = await getClients();
        if(response){
            const parseClients = response.map((cli: IClients) => {
                return {
                    label: `${cli.name} - ${formatNumberWithDots(cli.rif, '', '', true)}`,
                    value: cli.id
                }
            })
            setClients({ allClients: response, clients: parseClients });
        }
    }

    const getInventoryApi = async () => {
        const response: IInventory[] = await getInventory();
        if(response){
            const parseInventory = response.map((inv: IInventory) => {
                return {
                    label: `${inv.product.name} - ${inv.product.presentation}`,
                    value: inv.id
                }
            })
            setInventory({ allInventory: response, inventory: parseInventory });
        }
    }

    useEffect(() => {
        getClientsApi();
        getInventoryApi();
    }, [])

    const selectClient = (client: string) => {
        const findClient = clients.allClients.find((cli) => cli.id === Number(client));
        if (findClient) {
            setClientSelected(findClient)
        }
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

    const onSubmitInvoice = () => {
        if (controlNumber === '') {
            toast.custom(<Snackbar success={false} message={"Por favor, complete todos los campos del formulario"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return
        }

        const bodyInvoice = {
            clientId: clientSelected?.id,
            controlNumber: controlNumber,
            consignment: consignment,
            dispatchDate: dateDispatch,
            dueDate: dateDue,
            priceUSD: priceUSD,
            details: inventoryData.map((inv) => {
                return {
                    productId: inv.product.id,
                    quantity: Number(inv.quantity),
                }
            })
        }
        onSubmit(bodyInvoice)
    }

    return (
        <div>
            <div className="flex items-center justify-end w-full gap-5 my-4">
                <div className="flex flex-col items-start justify-start gap-2 w-80">
                    <Label className="text-right w-42">
                        Numero de factura
                    </Label>
                    <Input className="w-full" value={controlNumber} onChange={(e) => setControlNumber(e.target.value)} />
                </div>
            </div>

            <div className="flex items-center justify-between w-full gap-5 my-4">
                <DatePicker setDatePicker={setDateDispatch} label="Fecha de Despacho" maxDate={new Date()} minDate={new Date(2000)} />

                <DatePicker setDatePicker={setDateDue} label="Fecha de Vencimiento" minDate={dateDispatch} maxDate={addYears(dateDispatch, 5)}/>
            </div>

            <div className="flex items-center justify-between w-full gap-5 my-4">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label className="text-right w-42">
                        Cliente
                    </Label>
                    <Autocomplete placeholder="Seleccione un cliente" data={clients.clients} onChange={selectClient}></Autocomplete>
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

            <TableComponent columns={productColumns} total={total.toFixed(2)} dataBase={inventoryData} action={changeDataTable} includeFooter={true}></TableComponent>

            <div className="flex items-center justify-end mt-4">
                <Button disabled={total === 0} onClick={onSubmitInvoice}>Generar Factura</Button>
            </div>
        </div>
    )
}
