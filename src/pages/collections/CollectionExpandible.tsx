import { TableComponent } from "@/components/table/TableComponent";
import { IInvoice, InvoiceItems } from "@/interfaces/invoice.interface";
import { invoiceCollectionColumns } from "./collection.data.tsx";
import { DialogComponent } from "@/components/dialog/DialogComponent.tsx";
import { useState } from "react";
import { formatDate, formatNumberWithDots } from "@/hooks/formaters.ts";
import { invoiceItemsColumns } from "../invoices/invoices.data.ts";
import { ICollection } from "@/interfaces/collection.interface.ts";

interface CollectionExpandibleProps {
    collection: ICollection;
}

export const CollectionExpandible = ({ collection }: CollectionExpandibleProps) => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dataDetails, setDataDetails] = useState<InvoiceItems[]>([]);
    const [invoiceSelected, setInvoiceSelected] = useState<IInvoice | null>(null);

    const action = (action: string, data: IInvoice) => {
        setInvoiceSelected(data);
        setDataDetails(data.invoiceItems);
        // setDataDetailsPay(data.InvoicePayment);

        if (action === 'Detalles') {
            setOpenDialog(true)
        }
    }


    const remainingPay = (invoice: IInvoice | null): string => {
        if (!invoice) return '0.00';
        return Number(invoice.totalAmount - Number(invoice.remaining)).toFixed(2);
    }

    return (
        <div className={"w-full"}>
            {collection && collection.invoices && collection.invoices.length > 0 ? (
                <TableComponent dataBase={collection.invoices} columns={invoiceCollectionColumns} action={action} />
            )
                :
                <p className="h-10 text-lg flex items-center justify-center font-medium text-gray-400">Sin facturas asociados</p>
            }

            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[60rem]"
                label2=""
                label1="Información Factura"
                isEdit={true}
            >
                <div className="w-full relative space-y-6">
                    {/* Botones de acciones */}

                    {/* Información de factura */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border p-4 rounded-lg shadow-sm bg-gray-50">
                        <div className="space-y-1">
                            <p><strong>N° Factura:</strong> {invoiceSelected?.controlNumber}</p>
                            <p><strong>Cliente:</strong> {collection.client && collection.client.name}</p>
                            <p><strong>RIF:</strong> {collection.client && formatNumberWithDots(String(collection.client.rif), '', '', true)}</p>
                        </div>

                        <div className="space-y-1">
                            <p><strong>Consignación:</strong> {invoiceSelected?.consignment ? 'Sí' : 'No'}</p>
                            <p><strong>Fecha despacho:</strong> {formatDate(String(invoiceSelected?.dispatchDate))}</p>
                            <p><strong>Fecha vencimiento:</strong> {formatDate(String(invoiceSelected?.dueDate))}</p>
                        </div>

                        <div className="space-y-1">
                            <p><strong>Total:</strong> {formatNumberWithDots(Number(Number(invoiceSelected?.totalAmount).toFixed(2)), '', ' $')}</p>
                            <p><strong>Pagado:</strong> {formatNumberWithDots(Number(remainingPay(invoiceSelected)), '', ' $')}</p>
                            <p><strong>Debe:</strong> {formatNumberWithDots(Number(invoiceSelected?.remaining), '', ' $')}</p>
                        </div>
                    </div>

                    <div className="w-full">
                        <TableComponent dataBase={dataDetails} columns={invoiceItemsColumns} />
                    </div>
                </div>
            </DialogComponent>
        </div>
    )
}
