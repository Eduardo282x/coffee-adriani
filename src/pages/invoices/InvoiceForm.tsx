import { Autocomplete } from "@/components/autocomplete/Autocomplete";
import { TableComponent } from "@/components/table/TableComponent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IClients } from "@/interfaces/clients.interface";
import { IOptions } from "@/interfaces/form.interface";
import { IInventory } from "@/interfaces/inventory.interface";
import { getClients } from "@/services/clients.service";
import { getInventory } from "@/services/inventory.service";
import { useEffect, useState } from "react";
import { productColumns } from "./invoices.data";
import { formatNumberWithDots } from "@/hooks/formaters";


export const InvoiceForm = () => {
    const [clients, setClients] = useState<IOptions[]>([]);
    const [inventory, setInventory] = useState<IOptions[]>([]);
    const [inventoryData, setInventoryData] = useState<IInventory[]>([]);

    const getClientsApi = async () => {
        const response: IClients[] = await getClients();
        const parseClients = response.map((cli: IClients) => {
            return {
                label: `${cli.name} - ${formatNumberWithDots(cli.rif,'','', true)}`,
                value: cli.id
            }
        })
        setClients(parseClients);
    }

    const getInventoryApi = async () => {
        const response: IInventory[] = await getInventory();
        setInventoryData(response)
        const parseInventory = response.map((inv: IInventory) => {
            return {
                label: `${inv.product.name} - ${inv.product.presentation}`,
                value: inv.id
            }
        })
        setInventory(parseInventory);
    }

    useEffect(() => {
        getClientsApi();
        getInventoryApi();
    }, [])

    const selectClient = (client: unknown) => {
        console.log(client);
    }


    return (
        <div>
            <div className="flex items-start justify-end w-full">
                <div className="flex flex-col items-start justify-start gap-2 w-80">
                    <Label className="text-right w-42">
                        Numero de factura
                    </Label>
                    <Input className="w-full" />
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full my-4">
                <Label className="text-right w-42">
                    Cliente
                </Label>
                {/* <Input className="w-full" /> */}
                <Autocomplete placeholder="Seleccione un cliente" data={clients} onChange={selectClient}></Autocomplete>
            </div>

            <div className="flex flex-col items-start justify-start gap-2 w-full my-4">
                <Label className="text-right w-42">
                    Producto
                </Label>
                {/* <Input className="w-full" /> */}
                <Autocomplete placeholder="Seleccione un producto" data={inventory} onChange={selectClient}></Autocomplete>
            </div>

            <TableComponent columns={productColumns} dataBase={inventoryData} includeFooter={true}></TableComponent>
        </div>
    )
}
