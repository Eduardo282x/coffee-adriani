import { ScreenLoader } from '@/components/loaders/ScreenLoader';
import { TableComponent } from '@/components/table/TableComponent';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { InvoicePayment, IPayInvoiceForm, IPaymentForm, IPayments, PayDisassociateBody } from '@/interfaces/payment.interface';
import { postAssociatePayment, putDisassociatePayment } from '@/services/payment.service';
import { useEffect, useState } from 'react'
import { initialPaymentFilters, PaymentFilters, PaymentFilterType, paymentsColumns } from './payment.data';
import { PaymentFilter } from './PaymentFilter';
import { DateRange } from 'react-day-picker';
import { DateRangeFilter, IInvoice } from '@/interfaces/invoice.interface';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DialogComponent } from '@/components/dialog/DialogComponent';
import { AlertDialogPayment, PaymentForm } from './paymentForm';
import toast from 'react-hot-toast';
import { Snackbar } from '@/components/snackbar/Snackbar';
import { PayInvoiceForm } from './PayInvoiceForm';
import { formatOnlyNumberWithDots } from '@/hooks/formaters';
import { DolarComponents } from '@/components/dolar/DolarComponents';
import { PaymentExpandible } from './PaymentExpandible';
import { DropdownColumnFilter } from '@/components/table/DropdownColumnFilter';
import { IColumns } from '@/components/table/table.interface';
import { getInvoiceUnordered } from '@/services/invoice.service';
import { useOptimizedPayments } from '@/hooks/payment.hook';

export const Payments = () => {
    // Estados locales específicos del componente
    const [paymentSelected, setPaymentSelected] = useState<IPayments | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [openPayDialog, setOpenPayDialog] = useState<boolean>(false);
    const [openDisassociate, setOpenDisassociate] = useState<boolean>(false);
    const [paymentDisassociate, setPaymentDisassociate] = useState<InvoicePayment | null>(null);
    const [invoicesForPay, setInvoicesForPay] = useState<IInvoice[]>([]);
    const [columns, setColumns] = useState<IColumns<IPayments>[]>(paymentsColumns);
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [filter, setFilters] = useState<PaymentFilters>(initialPaymentFilters);

    // Hook optimizado
    const {
        payments,
        totalCount,
        statistics,
        isLoading,
        isMutating,
        applyDateFilter,
        createPayment,
        updatePayment,
        removePayment,
        confirmZellePayment,
        handleChangeAccount,
        handleChangeMethod,
        handleChangeCredit,
        handleChangeTypeProduct,
        // handleChangeStatus,
        handleChangeAssociation,
        handleChangeSearch,
        hasMore,
        loadMore,
        isLoadingMore,
    } = useOptimizedPayments({
        pageSize: 50,
        enableStatistics: true
    });

    // Efectos iniciales
    useEffect(() => {
        getInvoiceApi();
    }, []);

    // Aplicar filtro de fecha cuando cambia
    useEffect(() => {
        if (date?.to) {
            const filterDate: DateRangeFilter = {
                startDate: date.from || new Date(),
                endDate: addDays(date.to, 1),
            };
            applyDateFilter(filterDate);
        } else {
            applyDateFilter(null);
        }
    }, [date?.to, applyDateFilter]);

    const handleChangeFilter = (filter: PaymentFilterType, value: string) => {
        switch (filter) {
            case 'account':
                handleChangeAccount(Number(value));
                break;
            case 'method':
                handleChangeMethod(Number(value));
                break;
            case 'credit':
                handleChangeCredit(value as 'credit' | 'noCredit' | 'all');
                break;
            case 'type':
                handleChangeTypeProduct(value);
                break;
            case 'associated':
                handleChangeAssociation(value as 'associated' | 'unassociated' | 'all');
                break;
            default:
                break;
        };
        setFilters(prev => ({
            ...prev,
            [filter]: value
        }));
    };

    useEffect(() => {
        console.log(filter);

    }, [filter])

    const savePayments = async (data: IPaymentForm) => {
        try {
            if (paymentSelected) {
                await updatePayment(paymentSelected.id, data);
            } else {
                await createPayment(data);
            }
            setOpenDialog(false);
            setPaymentSelected(null);
        } catch (error) {
            console.error('Error al guardar pago:', error);
        }
    };

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

    const getActionExpansiblePayment = async (data: InvoicePayment) => {
        setPaymentDisassociate(data);
        setOpenDisassociate(true);
    };

    const disassociatePayment = async (data: boolean) => {
        if (data === true && paymentDisassociate) {
            try {
                const parseBody: PayDisassociateBody = {
                    id: paymentDisassociate.id,
                    invoiceId: paymentDisassociate.invoiceId,
                    paymentId: paymentDisassociate.paymentId
                };
                await putDisassociatePayment(parseBody);
                console.log('Pago desasociado');
            } catch (error) {
                console.error('Error al desasociar pago:', error);
            }
        }
        setOpenDisassociate(false);
        setPaymentDisassociate(null);
    };

    const handleNewPayments = () => {
        setPaymentSelected(null);
        setTimeout(() => {
            setOpenDialog(true);
        }, 0);
    };

    const confirmPayment = async () => {
        try {
            if (paymentSelected) {
                await confirmZellePayment(paymentSelected.id);
            }
            setOpenConfirmDialog(false);
            setPaymentSelected(null);
        } catch (error) {
            console.error('Error al confirmar pago:', error);
        }
    };

    const deletePaymentApi = async () => {
        try {
            if (paymentSelected) {
                await removePayment(paymentSelected.id);
            }
            setOpenDialogDelete(false);
            setPaymentSelected(null);
        } catch (error) {
            console.error('Error al eliminar pago:', error);
        }
    };

    const payInvoice = async (data: IPayInvoiceForm) => {
        try {
            await postAssociatePayment(data);
            setOpenPayDialog(false);
            setPaymentSelected(null);
        } catch (error) {
            console.error('Error al asociar pago:', error);
        }
    };

    const getInvoiceApi = async () => {
        try {
            const response: IInvoice[] = await getInvoiceUnordered();
            setInvoicesForPay(response);
        } catch (error) {
            console.error('Error al cargar facturas:', error);
        }
    };

    const setPaymentsFilter = (data: IPayments[]) => {
        // Esta función ya no es necesaria con useMemo, pero la mantenemos para compatibilidad
        console.log('setPaymentsFilter llamado con:', data.length, 'pagos');
    };

    const handleLoadMore = () => {
        if (hasMore && !isLoadingMore) {
            loadMore();
        }
    };

    return (
        <div className="flex flex-col">
            {(isLoading || isMutating) && <ScreenLoader />}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Pagos</h1>
                </div>

                <div className="flex items-center gap-4">
                    <DolarComponents />

                    <Button onClick={handleNewPayments} disabled={isMutating}>
                        <Plus className="mr-2 h-4 w-4" />
                        Registrar Pago
                    </Button>
                </div>
            </header>

            <div className="w-full h-3 bg-[#6f4e37] border-b"></div>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">
                        Gestión de Pagos
                    </h2>

                    <div className="flex items-end gap-2">
                        <DropdownColumnFilter columns={columns} setColumns={setColumns} />
                        <PaymentFilter
                            filters={filter}
                            handleChangeFilter={handleChangeFilter}
                            paymentsColumns={paymentsColumns}
                            setPaymentsFilter={setPaymentsFilter}
                            handleChangeSearch={handleChangeSearch}
                            payments={[]}
                            date={date}
                            setDate={setDate}
                        />
                    </div>
                </div>

                <div className=''>
                    <div className='w-full flex items-center justify-between my-2'>
                        <div className="flex items-center justify-start gap-2">
                            {statistics && (
                                <>
                                    <p className='text-lg'>
                                        <span className='font-semibold'>Total Bs:</span> {formatOnlyNumberWithDots(statistics.totals.totalBs)} Bs
                                    </p>
                                    <p className='text-lg'>
                                        <span className='font-semibold'>Total $:</span> {formatOnlyNumberWithDots(statistics.totals.totalUSD)} $
                                    </p>
                                </>
                            )}
                        </div>

                        <div className='flex items-center justify-start gap-2'>
                            <p className=''>
                                <span className='font-semibold'>Total:</span> {statistics ? formatOnlyNumberWithDots(statistics.totals.total) : ''} $
                            </p>
                            <p className=''>
                                <span className='font-semibold'>Sobrante:</span> {statistics ? formatOnlyNumberWithDots(statistics.totals.remaining) : ''} $
                            </p>
                        </div>
                    </div>

                    <TableComponent
                        columns={columns.filter(col => col.visible === true)}
                        dataBase={payments}
                        isExpansible={true}
                        totalElements={totalCount}
                        renderRow={(pay, index) => (
                            <PaymentExpandible
                                key={index}
                                payment={pay}
                                actionPayment={getActionExpansiblePayment}
                            />
                        )}
                        action={getActions}
                    />

                    {/* Botón para cargar más */}
                    {hasMore && (
                        <div className="text-center mt-4">
                            <Button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                variant="outline"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                        Cargando más...
                                    </>
                                ) : (
                                    'Cargar más pagos'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Diálogos existentes */}
            {openDialog && (
                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[30rem]"
                    label2="Registrar Pago"
                    label1="Actualizar Pago"
                    isEdit={paymentSelected ? true : false}
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
                    <PayInvoiceForm
                        onSubmit={payInvoice}
                        data={paymentSelected}
                        invoiceForPay={invoicesForPay}
                    />
                </DialogComponent>
            )}

            {openDisassociate && (
                <DialogComponent
                    open={openDisassociate}
                    setOpen={setOpenDisassociate}
                    className="w-[30%]"
                    label2=""
                    label1="Desasociar pago"
                    isEdit={true}
                >
                    <AlertDialogPayment onSubmit={disassociatePayment} />
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
                        <Button
                            onClick={() => setOpenConfirmDialog(false)}
                            className="text-lg"
                            disabled={isMutating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmPayment}
                            className="text-lg bg-blue-500 hover:bg-blue-800 text-white"
                            disabled={isMutating}
                        >
                            {isMutating ? 'Confirmando...' : 'Confirmar'}
                        </Button>
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
                        <Button
                            onClick={() => setOpenDialogDelete(false)}
                            className="text-lg"
                            disabled={isMutating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={deletePaymentApi}
                            className="text-lg bg-red-500 hover:bg-red-800 text-white"
                            disabled={isMutating}
                        >
                            {isMutating ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </div>
                </DialogComponent>
            )}
        </div>
    );
};