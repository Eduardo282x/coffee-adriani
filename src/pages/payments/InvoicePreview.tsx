import { DialogComponent } from '@/components/dialog/DialogComponent'
import { TableComponent } from '@/components/table/TableComponent'
import { formatDate, formatNumberWithDots } from '@/hooks/formaters'
import { invoiceItemsColumns, invoiceItemsPaymentColumns } from '../invoices/invoices.data'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { IInvoicePayment, InvoiceInvoice, InvoiceItems } from '@/interfaces/invoice.interface'

interface InvoicePreviewProps {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    invoice: InvoiceInvoice | null
}


export const InvoicePreview = ({ openDialog, setOpenDialog, invoice }: InvoicePreviewProps) => {
    const [showDetails, setShowDetails] = useState<boolean>(true);
    const [dataDetails, setDataDetails] = useState<InvoiceItems[]>([]);
    const [dataDetailsPay, setDataDetailsPay] = useState<IInvoicePayment[]>([]);

    useEffect(() => {
        console.log(invoice);
        if(invoice){
            setDataDetails(invoice.invoiceItems);
            setDataDetailsPay(invoice.InvoicePayment);
        }
    },[invoice])

    const remainingPay = (invoice: InvoiceInvoice | null): string => {
        if (!invoice) return '0.00';
        return Number(Number(invoice.totalAmount) - Number(invoice.remaining)).toFixed(2);
    }

    return (
        <div>
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
                            <p><strong>N° Factura:</strong> {invoice?.controlNumber}</p>
                            <p><strong>Cliente:</strong> {invoice?.client?.name}</p>
                            <p><strong>RIF:</strong> {formatNumberWithDots(invoice?.client?.rif || '', '', '', true)}</p>
                        </div>

                        <div className="space-y-1">
                            <p><strong>Consignación:</strong> {invoice?.consignment ? 'Sí' : 'No'}</p>
                            <p><strong>Fecha despacho:</strong> {formatDate(String(invoice?.dispatchDate))}</p>
                            <p><strong>Fecha vencimiento:</strong> {formatDate(String(invoice?.dueDate))}</p>
                        </div>

                        <div className="space-y-1">
                            <p><strong>Total:</strong> {formatNumberWithDots(Number(Number(invoice?.totalAmount).toFixed(2)), '', ' $')}</p>
                            <p><strong>Pagado:</strong> {formatNumberWithDots(Number(remainingPay(invoice)), '', ' $')}</p>
                            <p><strong>Debe:</strong> {formatNumberWithDots(Number(invoice?.remaining), '', ' $')}</p>
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
        </div>
    )
}
