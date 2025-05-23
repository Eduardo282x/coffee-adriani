import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { IInvoice, InvoiceApi, InvoiceItems } from "@/interfaces/invoice.interface";
import { FC, useEffect, useRef, useState } from "react"
import { IoIosArrowDown } from "react-icons/io";
import { TableComponent } from "../table/TableComponent";
import { IColumns } from "../table/table.interface";
import { DialogComponent } from "../dialog/DialogComponent";
import { invoiceItemsColumns } from "@/pages/invoices/invoices.data";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { MdOutlineEdit } from "react-icons/md";
interface ExpansibleProps {
    invoice: InvoiceApi;
    columns: IColumns<IInvoice>[];
}

export const Expansible: FC<ExpansibleProps> = ({ invoice, columns }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const expansibleRef = useRef<HTMLDivElement>(null);
    const [dataDetails, setDataDetails] = useState<InvoiceItems[]>([]);
    const [invoiceSelected, setInvoiceSelected] = useState<IInvoice | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (expansibleRef.current && !expansibleRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const action = (action: string, data: IInvoice) => {
        setInvoiceSelected(data);
        setDataDetails(data.invoiceItems)

        if (action === 'Detalles') {
            setOpenDialog(true)
        }
    }

    return (
        <div ref={expansibleRef} className={`w-full ${open ? 'h-auto' : 'h-10'} interpolate overflow-hidden border rounded-lg px-4 py-2 ease-in-out delay-100 duration-150 transition-all`}>
            <div onClick={() => setOpen(!open)} className="w-full cursor-pointer grid grid-cols-5">
                <span>{invoice.client.name}</span>
                <span>{formatNumberWithDots(invoice.client.rif, '', '', true)}</span>
                <span>{invoice.client.zone}</span>
                <span>{invoice.client.block.name}</span>
                <span className="py-1"><IoIosArrowDown className={`ease-in-out delay-100 duration-150 transition-all text-xl ${!open ? ' rotate-0' : 'rotate-180'}`} /></span>
            </div>
            <div className="w-full mt-1">
                <TableComponent dataBase={invoice.invoices} columns={columns} action={action} hidePaginator={true}/>
            </div>

            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[60rem]"
                label2=""
                label1="Información Factura"
                isEdit={true}
            >
                <div className="w-full relative">
                    <div className="absolute -top-12 left-0 flex items-center justify-center gap-2">
                        <Button className="bg-green-700 hover:bg-green-600 text-white"><Download /> Exportar</Button>
                        <Button ><MdOutlineEdit /> Editar</Button>
                    </div>
                    <div className="grid grid-cols-3 w-full mb-4">
                        <div className=" ">
                            <p><strong>N Factura:</strong> {invoiceSelected?.controlNumber}</p>
                            <p><strong>Cliente:</strong> {invoice.client.name}</p>
                            <p><strong>Rif:</strong> {formatNumberWithDots(invoice.client.rif, '', '', true)}</p>
                        </div>
                        <div>
                            <p><strong>Consignación:</strong> {invoiceSelected?.consignment ? 'Si' : 'No'}</p>
                        </div>
                        <div className="flex flex-col justify-end items-start">
                            <p><strong>Fecha despacho:</strong> {formatDate(String(invoiceSelected?.dispatchDate))}</p>
                            <p><strong>Fecha vencimiento:</strong> {formatDate(String(invoiceSelected?.dueDate))}</p>
                            <p><strong>Total:</strong> {formatNumberWithDots(Number(invoiceSelected?.totalAmount), '', '.00 $',)}</p>
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
