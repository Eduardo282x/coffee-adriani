import { formatDate, formatNumberWithDots } from "@/hooks/formaters";
import { IInvoice, InvoiceApi, InvoiceItems, IInvoicePayment } from "@/interfaces/invoice.interface";
import { FC, useEffect, useRef, useState } from "react"
import { IoIosArrowDown } from "react-icons/io";
import { TableComponent } from "../table/TableComponent";
import { IColumns } from "../table/table.interface";
import { DialogComponent } from "../dialog/DialogComponent";
import { invoiceItemsColumns, invoiceItemsPaymentColumns } from "@/pages/invoices/invoices.data";
import { Button } from "../ui/button";
// import { Download } from "lucide-react";
import { MdOutlineEdit, MdPayments } from "react-icons/md";
import { CgRemove } from "react-icons/cg";
interface ExpansibleProps {
    invoice: InvoiceApi;
    columns: IColumns<IInvoice>[];
    editInvoice: (data: IInvoice) => void;
    payInvoices: (data: IInvoice) => void;
    pendingInvoices: (data: IInvoice) => void;
    deleteInvoice: (id: number) => void;
}

export const Expansible: FC<ExpansibleProps> = ({ invoice, columns, deleteInvoice, editInvoice, payInvoices, pendingInvoices }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
    const expansibleRef = useRef<HTMLDivElement>(null);
    const [dataDetails, setDataDetails] = useState<InvoiceItems[]>([]);
    const [dataDetailsPay, setDataDetailsPay] = useState<IInvoicePayment[]>([]);
    const [invoiceSelected, setInvoiceSelected] = useState<IInvoice | null>(null);
    const [showDetails, setShowDetails] = useState<boolean>(true);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (expansibleRef.current && !expansibleRef.current.contains(event.target as Node)) {
                // setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const action = (action: string, data: IInvoice) => {
        setInvoiceSelected(data);
        setDataDetails(data.invoiceItems);
        setDataDetailsPay(data.InvoicePayment);

        if (action === 'Detalles') {
            setOpenDialog(true)
        }

        if (action === 'Eliminar') {
            setOpenDialogDelete(true)
        }
    }

    const remainingPay = (invoice: IInvoice | null): string => {
        if (!invoice) return '0.00';
        return Number(invoice.totalAmount - Number(invoice.remaining)).toFixed(2);
    }

    const handleEditInvoice = () => {
        if (invoiceSelected) {
            editInvoice(invoiceSelected);
            setOpenDialog(false);
        }
    }

    const handlePayInvoice = () => {
        if (invoiceSelected) {
            payInvoices(invoiceSelected);
            setOpenDialog(false);
        }
    }

    const handlePendingInvoice = () => {
        if (invoiceSelected) {
            pendingInvoices(invoiceSelected);
            setOpenDialog(false);
        }
    }

    const deleteInvoices = () => {
        deleteInvoice(invoiceSelected?.id || 0);
        setOpenDialogDelete(false);
    }

    return (
        <div ref={expansibleRef} className={`w-full ${open ? 'h-auto' : 'h-10'} interpolate overflow-hidden border rounded-lg px-2 py-2 ease-in-out delay-100 duration-150 transition-all`}>
            <div onClick={() => setOpen(!open)} className="w-full cursor-pointer grid grid-cols-5">
                <span>{invoice.client.name}</span>
                <span>{formatNumberWithDots(invoice.client.rif, '', '', true)}</span>
                <span>{invoice.client.zone}</span>
                <span>{invoice.client.block.name}</span>
                <span className="py-1"><IoIosArrowDown className={`ease-in-out delay-100 duration-150 transition-all text-xl ${!open ? ' rotate-0' : 'rotate-180'}`} /></span>
            </div>
            <div className="w-full mt-1">
                <TableComponent
                    dataBase={invoice.invoices}
                    columns={columns}
                    action={action}
                    hidePaginator={true}
                    shortSpaces={true}
                />
            </div>

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
                    <div className="absolute -top-11 left-0 flex justify-between w-full gap-3">
                        <div className="flex gap-2">
                            {/* <Button className="bg-green-700 hover:bg-green-600 text-white">
                            <Download /> Exportar
                        </Button> */}
                            <Button onClick={handleEditInvoice}>
                                <MdOutlineEdit /> Editar
                            </Button>
                            <Button onClick={handlePendingInvoice}>
                                <CgRemove /> Pendiente
                            </Button>
                            <Button className="bg-green-700 hover:bg-green-600 text-white" onClick={handlePayInvoice}>
                                <MdPayments /> Marcar Pagada
                            </Button>
                        </div>

                        <div className="mr-10">
                            <div className=" border rounded-lg flex items-center justify-start gap-1 w-fit">
                                <Button className={`${!showDetails ? 'bg-transparent' : 'bg-[#6f4e37] text-white'} hover:text-white hover:bg-[#6f4e37]/90`} onClick={() => setShowDetails(true)}>Detalles</Button>
                                <Button className={`${showDetails ? 'bg-transparent' : 'bg-[#6f4e37] text-white'} hover:text-white hover:bg-[#6f4e37]/90`} onClick={() => setShowDetails(false)}>Pagos</Button>
                            </div>
                        </div>
                    </div>

                    {/* Información de factura */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border p-4 rounded-lg shadow-sm bg-gray-50">
                        <div className="space-y-1">
                            <p><strong>N° Factura:</strong> {invoiceSelected?.controlNumber}</p>
                            <p><strong>Cliente:</strong> {invoice.client.name}</p>
                            <p><strong>RIF:</strong> {formatNumberWithDots(invoice.client.rif, '', '', true)}</p>
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
                        {showDetails
                            ? <div className="space-y-2">
                                <p className="text-lg font-semibold text-[#37271b]">Detalles</p>
                                <TableComponent dataBase={dataDetails.filter(item => item.type == 'SALE')} columns={invoiceItemsColumns} />
                                {dataDetails.filter(item => item.type == 'GIFT').length > 0 && (
                                    <>
                                        <p className="text-lg font-semibold text-[#37271b]">Regalos</p>
                                        <TableComponent dataBase={dataDetails.filter(item => item.type == 'GIFT')} columns={invoiceItemsColumns} />
                                    </>
                                )}
                            </div>
                            : <TableComponent dataBase={dataDetailsPay} columns={invoiceItemsPaymentColumns} />
                        }
                    </div>
                </div>
            </DialogComponent>


            <DialogComponent
                open={openDialogDelete}
                setOpen={setOpenDialogDelete}
                className="w-[28rem]"
                label2=""
                label1="Estas seguro que deseas eliminar esta factura?"
                isEdit={true}

            >
                <div className="flex items-center justify-center gap-8 mt-5">
                    <Button onClick={() => setOpenDialogDelete(false)} className="text-lg ">Cancelar</Button>
                    <Button onClick={deleteInvoices} className="text-lg bg-red-500 hover:bg-red-800 text-white">Eliminar</Button>
                </div>
            </DialogComponent>
        </div>
    )
}
