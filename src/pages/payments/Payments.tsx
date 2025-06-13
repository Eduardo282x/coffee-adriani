import { ScreenLoader } from '@/components/loaders/ScreenLoader';
import { TableComponent } from '@/components/table/TableComponent';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GroupPayments, IPayInvoiceForm, IPaymentForm, IPayments, PaymentAPI, TotalPay } from '@/interfaces/payment.interface';
import { deletePayment, getPayment, getPaymentFilter, postAssociatePayment, postPayment, putConfirmPayment, putPayment } from '@/services/payment.service';
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
import { formatNumberWithDots } from '@/hooks/formaters';
import { DolarComponents } from '@/components/dolar/DolarComponents';
import { getProductDolar } from '@/services/products.service';
import { IDolar } from '@/interfaces/product.interface';

export const Payments = () => {
    const [payments, setPayments] = useState<GroupPayments>({ allPayments: [], payments: [], paymentsFilter: [] });
    const [paymentSelected, setPaymentSelected] = useState<IPayments | null>(null);
    const [totalPayments, setTotalPayments] = useState<TotalPay>({ totalBs: 0, totalUSD: 0 })
    const [dolar, setDolar] = useState<IDolar>();
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [openPayDialog, setOpenPayDialog] = useState<boolean>(false);
    // const today = new Date();

    const [date, setDate] = useState<DateRange | undefined>(undefined)

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [associatedFilter, setAssociatedFilter] = useState<string>('all');
    const [methodFilter, setMethodFilter] = useState<string>('all');

    useEffect(() => {
        getAllPaymentsApi();
        getProductDolarApi();
    }, [])

    const getProductDolarApi = async () => {
        const response: IDolar = await getProductDolar();
        setDolar(response)
    }

    useEffect(() => {
        if (date?.to) {
            getPaymentsFilterApi()
        }
    }, [date?.to])


    const getAllPaymentsApi = async () => {
        setLoading(true);
        const response: PaymentAPI = await getPayment();
        if (response) {
            setTotalPayments({ totalBs: response.totalBs, totalUSD: response.totalUSD });
            setPayments({
                allPayments: response.payments,
                payments: response.payments,
                paymentsFilter: response.payments
            });
        }
        setLoading(false)
    }

    const getPaymentsFilterApi = async () => {
        setLoading(true);
        const filterDate: DateRangeFilter = {
            startDate: date?.from ? date.from : new Date(),
            endDate: date?.to ? addDays(date.to, 1) : new Date(),
        }
        const response: PaymentAPI = await getPaymentFilter(filterDate);
        if (response) {
            setTotalPayments({ totalBs: response.totalBs, totalUSD: response.totalUSD });
            setPayments({
                allPayments: response.payments,
                payments: response.payments,
                paymentsFilter: response.payments
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
        setStatusFilter(option);
    };

    const handleChangeStatusAssociated = (option: string) => {
        setAssociatedFilter(option);
    };

    const handleChangeMethods = (option: string) => {
        setMethodFilter(option);
    };


    useEffect(() => {
        let filtered = [...payments.allPayments];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(pay => pay.status === statusFilter);
        }

        if (associatedFilter !== 'all') {
            filtered = filtered.filter(pay => pay.associated === (associatedFilter === 'associated'));
        }

        if (methodFilter !== 'all') {
            filtered = filtered.filter(pay => pay.account.method.id === Number(methodFilter));
        }

        setPayments(prev => ({
            ...prev,
            payments: filtered
        }));
    }, [statusFilter, associatedFilter, methodFilter, payments.allPayments]);



    const savePayments = async (data: IPaymentForm) => {
        if (paymentSelected) {
            await putPayment(paymentSelected.id, data)
        } else {
            await postPayment(data)
        }
        await getPaymentsFilterApi();
        setOpenDialog(false);
    }

    const getActions = (action: string, data: IPayments) => {
        setPaymentSelected(data);

        const method = data.account.method.name;
        const status = data.status;
        const remaining = Number(data.remaining);

        const notify = (message: string) => {
            toast.custom(<Snackbar success={false} message={message} />, {
                position: 'bottom-center',
                duration: 1500,
            });
        };

        switch (action) {
            case 'Confirmar':
                if (method !== 'Zelle') {
                    return notify('Solo puede confirmar pagos por Zelle');
                }

                if (status !== 'PENDING') {
                    return notify('Solo puede confirmar pagos que estén pendientes');
                }

                return setTimeout(() => setOpenConfirmDialog(true), 0);

            case 'Pagar':
                if (status === 'PENDING') {
                    return notify('Solo puede asociar pagos que estén confirmados');
                }

                if (remaining === 0) {
                    return notify('Este pago ya no posee fondos');
                }

                return setTimeout(() => setOpenPayDialog(true), 0);

            case 'Editar':
                return setTimeout(() => setOpenDialog(true), 0);

            case 'Eliminar':
                return setTimeout(() => setOpenDialogDelete(true), 0);

            default:
                console.warn(`Acción no reconocida: ${action}`);
                break;
        }
    };


    const handleNewPayments = () => {
        setPaymentSelected(null);
        setTimeout(() => {
            setOpenDialog(true);
        }, 0);
    }

    const confirmPayment = async () => {
        await putConfirmPayment(paymentSelected ? paymentSelected.id : 0);
        await getPaymentsFilterApi();
        setOpenConfirmDialog(false)
    }

    const deletePaymentApi = async () => {
        await deletePayment(paymentSelected ? paymentSelected.id : 0);
        await getPaymentsFilterApi();
        setOpenDialogDelete(false)
    }

    const payInvoice = async (data: IPayInvoiceForm) => {
        setPayments((prev) => {
            return {
                ...prev,
                payments: prev.payments.map(item => {
                    return  {
                        ...item,
                        associated: item.id === data.paymentId ? true : item.associated
                    }
                })
            }
        })
        await postAssociatePayment(data);
        setOpenPayDialog(false)
    }

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Pagos</h1>
                </div>

                <div className="flex items-center gap-4">
                    <DolarComponents />

                    <Button onClick={handleNewPayments}>
                        <Plus className="mr-2 h-4 w-4" />
                        Registrar Pago
                    </Button>
                </div>
            </header>
            <div className="w-full h-3 bg-[#6f4e37] border-b"></div>


            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Pagos</h2>

                    <PaymentFilter
                        paymentsColumns={paymentsColumns}
                        setPaymentsFilter={setPaymentsFilter}
                        payments={payments.paymentsFilter}
                        date={date}
                        setDate={setDate}
                        handleChangeMethods={handleChangeMethods}
                        handleChangeStatusPay={handleChangeStatusPay}
                        handleChangeStatusAssociated={handleChangeStatusAssociated}
                    />
                </div>

                <div className=''>
                    <div className="flex items-center justify-start gap-2">
                        <p className='mb-2 text-lg'><span className='font-semibold'>Total Bs:</span> {formatNumberWithDots(totalPayments.totalBs.toFixed(2), '', ' Bs')}</p>
                        <p className='mb-2 text-lg'><span className='font-semibold'>Total $:</span> {formatNumberWithDots(totalPayments.totalUSD.toFixed(2), '', ' $')}</p>
                    </div>
                    <TableComponent columns={paymentsColumns} dataBase={payments.payments} action={getActions}></TableComponent>
                </div>
            </main>


            {openDialog && (
                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[30rem]"
                    label2="Agregar Cliente"
                    label1="Registrar Pago"
                    isEdit={false}
                >
                    <PaymentForm onSubmit={savePayments} data={paymentSelected} />
                </DialogComponent>
            )}

            {openPayDialog && (
                <DialogComponent
                    open={openPayDialog}
                    setOpen={setOpenPayDialog}
                    className="w-[45%]"
                    label2=""
                    label1="Asociar pago a factura"
                    isEdit={true}
                >
                    <PayInvoiceForm onSubmit={payInvoice} data={paymentSelected} dolar={dolar} />
                </DialogComponent>
            )}

            {openConfirmDialog && (
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
            )}

            {openDialogDelete && (
                <DialogComponent
                    open={openDialogDelete}
                    setOpen={setOpenDialogDelete}
                    className="w-[28rem]"
                    label2=""
                    label1="Deseas eliminar el pago ?"
                    isEdit={true}
                >
                    <div className="flex items-center justify-center gap-8 mt-5">
                        <Button onClick={() => setOpenDialogDelete(false)} className="text-lg ">Cancelar</Button>
                        <Button onClick={deletePaymentApi} className="text-lg bg-red-500 hover:bg-red-800 text-white">Eliminar</Button>
                    </div>
                </DialogComponent>
            )}
        </div>
    )
}
