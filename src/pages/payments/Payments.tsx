// import { DialogComponent } from '@/components/dialog/DialogComponent';
import { ScreenLoader } from '@/components/loaders/ScreenLoader';
import { TableComponent } from '@/components/table/TableComponent';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GroupPayments, IPaymentForm, IPayments } from '@/interfaces/payment.interface';
import { getPaymentFilter, postPayment, putConfirmPayment, postAssociatePayment } from '@/services/payment.service';
import { useEffect, useState } from 'react'
import { paymentsColumns } from './payment.data';
import { PaymentFilter } from './PaymentFilter';
import { DateRange } from 'react-day-picker';
import { DateRangeFilter } from '@/interfaces/invoice.interface';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DialogComponent } from '@/components/dialog/DialogComponent';
import { PaymentForm } from './paymentForm';
import toast from 'react-hot-toast';
import { Snackbar } from '@/components/snackbar/Snackbar';
import { PayInvoiceForm } from './PayInvoiceForm';
import { AssociatePayInvoice, IPayInvoiceForm } from '@/interfaces/payment.interface';

export const Payments = () => {
    const [payments, setPayments] = useState<GroupPayments>({ allPayments: [], payments: [], paymentsFilter: [] });
    const [paymentSelected, setPaymentSelected] = useState<IPayments>();
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [openPayDialog, setOpenPayDialog] = useState<boolean>(false);
    const today = new Date();

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, today.getMonth(), 1),
        to: new Date(2025, today.getMonth() + 1, 1),
    })

    useEffect(() => {
        if (date?.to) {
            getPaymentsFilterApi()
        }
    }, [date?.to])

    const getPaymentsFilterApi = async () => {
        setLoading(true);
        const filterDate: DateRangeFilter = {
            startDate: date?.from ? date.from : new Date(),
            endDate: date?.to ? addDays(date.to, 1) : new Date(),
        }
        const response: IPayments[] = await getPaymentFilter(filterDate);
        if (response) {
            setPayments({
                allPayments: response,
                payments: response,
                paymentsFilter: response
            });
        }
        setLoading(false)
    }

    const setPaymentsFilter = (data: IPayments[]) => {
        setPayments({
            ...payments,
            payments: data
        })
    }

    const handleChangeStatusPay = (option: string) => {
        if (option === 'all') return setPayments((prev) => ({ ...prev, payments: payments.allPayments }))
        const filterPaymentsByStatus = payments.allPayments.filter(pay => pay.status === option)
        setPayments((prev) => ({ ...prev, paymentsFilter: filterPaymentsByStatus }))
    }

    const handleChangeMethods = (option: string) => {
        if (option === 'all') return setPayments((prev) => ({ ...prev, payments: payments.allPayments }))
        const filterPaymentsByMethods = payments.allPayments.filter(pay => pay.methodId === Number(option))
        setPayments((prev) => ({ ...prev, paymentsFilter: filterPaymentsByMethods }))
    }

    const savePayments = async (data: IPaymentForm) => {
        await postPayment(data)
        await getPaymentsFilterApi();
        setOpenDialog(false);
    }

    const getActions = (action: string, data: IPayments) => {
        setPaymentSelected(data);

        if (action === 'Confirmar' && data.method.name !== 'Zelle') {
            toast.custom(<Snackbar success={false} message='Solo puede confirmar pagos por zelle'></Snackbar>,
                { position: 'bottom-center', duration: 1500 }
            )
        }
        if (action === 'Confirmar' && data.method.name === 'Zelle' && data.status !== 'PENDING') {
            toast.custom(<Snackbar success={false} message='Solo puede confirmar pagos que estén pendientes'></Snackbar>,
                { position: 'bottom-center', duration: 1500 }
            )
        }
        if (action === 'Confirmar' && data.method.name === 'Zelle' && data.status === 'PENDING') {
            setOpenConfirmDialog(true)
        }

        if (action === 'Pagar' && data.status === 'PENDING') {
            toast.custom(<Snackbar success={false} message='Solo puede asociar pagos que estén confirmados'></Snackbar>,
                { position: 'bottom-center', duration: 1500 }
            )
        }

        if (action === 'Pagar' && data.status !== 'PENDING') {
            setOpenPayDialog(true);
        }
    }

    const confirmPayment = async () => {
        await putConfirmPayment(paymentSelected ? paymentSelected.id : 0);
        await getPaymentsFilterApi();
        setOpenConfirmDialog(false)
    }

    const payInvoice = async (data: AssociatePayInvoice) => {
        const parseDat: IPayInvoiceForm = {
            paymentId: Number(paymentSelected?.id),
            invoiceId: data.invoice,
            amount: Number(paymentSelected?.amount)
        }
        
        await postAssociatePayment(parseDat);
        setOpenPayDialog(false)
    }

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Pagos</h1>
                </div>

                <Button onClick={() => setOpenDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Pago
                </Button>

            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Pagos</h2>

                    <PaymentFilter
                        paymentsColumns={paymentsColumns}
                        setPaymentsFilter={setPaymentsFilter}
                        payments={payments.paymentsFilter}
                        date={date}
                        setDate={setDate}
                        handleChangeMethods={handleChangeMethods}
                        handleChangeStatusPay={handleChangeStatusPay}
                    />
                </div>

                <div>
                    <TableComponent columns={paymentsColumns} dataBase={payments.payments} action={getActions}></TableComponent>
                </div>
            </main>


            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[30rem]"
                label2="Agregar Cliente"
                label1="Registrar Pago"
                isEdit={false}
            >
                <PaymentForm onSubmit={savePayments} />
            </DialogComponent>

            <DialogComponent
                open={openPayDialog}
                setOpen={setOpenPayDialog}
                className="w-[28rem]"
                label2=""
                label1="Asociar pago a factura"
                isEdit={true}
            >
                <PayInvoiceForm onSubmit={payInvoice} data={paymentSelected} />
            </DialogComponent>

            <DialogComponent
                open={openConfirmDialog}
                setOpen={setOpenConfirmDialog}
                className="w-[28rem]"
                label2=""
                label1="Deseas confirmar el pago ?"
                isEdit={true}

            >
                <div className="flex items-center justify-center gap-8 mt-5">
                    <Button onClick={() => setOpenConfirmDialog(false)} className="text-lg ">Cancelar</Button>
                    <Button onClick={confirmPayment} className="text-lg bg-blue-500 hover:bg-blue-800 text-white">Confirmar</Button>
                </div>
            </DialogComponent>
        </div>
    )
}
