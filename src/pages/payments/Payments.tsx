import { TableComponent } from '@/components/table/TableComponent';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { InvoicePayment, IPayInvoiceForm, IPaymentForm, IPayments, PayDisassociateBody } from '@/interfaces/payment.interface';
import { useEffect, useState } from 'react'
import { paymentsColumns } from './payment.data';
import { PaymentFilter } from './PaymentFilter';
import { DateRangeFilter, InvoiceInvoice } from '@/interfaces/invoice.interface';
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
import { PaymentDateRangeFilter, useOptimizedPayments } from '@/hooks/payment.hook';
import { InvoicePreview } from './InvoicePreview';
import { PaymentStatisticsDetail } from './PaymentStatisticsDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { paymentFilterStore } from '@/store/paymentFilterStore';
import { FilterBadges } from './FilterBadges';

export const Payments = () => {
    // Estados locales específicos del componente
    const [paymentSelected, setPaymentSelected] = useState<IPayments | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogDelete, setOpenDialogDelete] = useState<boolean>(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [openPayDialog, setOpenPayDialog] = useState<boolean>(false);
    const [openDisassociate, setOpenDisassociate] = useState<boolean>(false);
    const [openView, setOpenView] = useState<boolean>(false);
    const [paymentDisassociate, setPaymentDisassociate] = useState<InvoicePayment | null>(null);
    const [columns, setColumns] = useState<IColumns<IPayments>[]>(paymentsColumns);
    const [invoice, setInvoice] = useState<InvoiceInvoice | null>(null);
    const dateStart = paymentFilterStore((state) => state.dateStart);
    const accountType = paymentFilterStore((state) => state.accountType);

    // Hook optimizado
    const {
        payments,
        invoicesForPay,
        paymentMethods,
        paymentAccounts,
        paymentDescriptions,
        productTypes,
        totalCount,
        statistics,
        isLoading,
        isMutating,
        applyDateFilter,
        createPayment,
        updatePayment,
        removePayment,
        associatePayment,
        disassociatePayment,
        confirmZellePayment,
        hasMore,
        loadMore,
        isLoadingMore,
    } = useOptimizedPayments({
        pageSize: 50,
        enableStatistics: true
    });

    const closePreview = () => {
        setOpenView(false);
        setInvoice(null);
    }

    // Aplicar filtro de fecha cuando cambia
    useEffect(() => {
        if (dateStart?.to) {
            const filterDate: DateRangeFilter = {
                startDate: dateStart.from || new Date(),
                endDate: dateStart.to,
            };
            applyDateFilter(filterDate as PaymentDateRangeFilter);
        } else {
            applyDateFilter(null);
        }
    }, [dateStart?.from, dateStart?.to, applyDateFilter]);

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

            case 'Asociar':
                if (status === 'PENDING') {
                    return notify('Solo puede asociar pagos que estén confirmados');
                }

                if (remaining === 0) {
                    return notify('Este pago ya no posee fondos');
                }

                if (data.type === 'SUPPLIER') {
                    return notify('No se puede asociar un pago a proveedor a una factura');
                }

                if (data.type === 'PERSONAL_EXPENSES') {
                    return notify('No se puede asociar un gasto personal a una factura');
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

    const getActionExpansiblePayment = async (data: InvoicePayment, action: string) => {
        setPaymentDisassociate(data);

        if (action === 'Desasociar') setOpenDisassociate(true);
        if (action === 'Ver') {
            setInvoice(data.invoice as unknown as InvoiceInvoice);
            setOpenView(true);
        }
    };

    const handleDisassociatePayment = async (data: boolean) => {
        if (data === true && paymentDisassociate) {
            try {
                const parseBody: PayDisassociateBody = {
                    id: paymentDisassociate.id,
                    invoiceId: paymentDisassociate.invoiceId,
                    paymentId: paymentDisassociate.paymentId
                };
                await disassociatePayment(parseBody);
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
            if (paymentSelected?.type === 'SUPPLIER' || paymentSelected?.type === 'PERSONAL_EXPENSES') {
                toast.custom(<Snackbar success={false} message="Este tipo de pago no puede asociarse a una factura" />, {
                    position: 'bottom-center',
                    duration: 1500,
                });
                setOpenPayDialog(false);
                return;
            }

            await associatePayment(data);
            setOpenPayDialog(false);
            setPaymentSelected(null);
        } catch (error) {
            console.error('Error al asociar pago:', error);
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

    useEffect(() => {
        if (accountType == 'PERSONAL_EXPENSES' || accountType == 'SUPPLIER') {
            setColumns(current => current.map(col => {
                return {
                    ...col,
                    visible: col.column == 'associated' ? false : col.visible
                }
            }))
        } else {
            setColumns(paymentsColumns)
        }
    }, [accountType])

    return (
        <div className="flex flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-15 items-center gap-4 text-white px-6">
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
                            paymentsColumns={paymentsColumns}
                            setPaymentsFilter={setPaymentsFilter}
                            methods={paymentMethods}
                            accounts={paymentAccounts}
                            types={productTypes}
                            typeDescription={paymentDescriptions}
                        />
                    </div>
                </div>

                <div className=''>
                    <div className='w-full flex items-center justify-between my-2'>
                        <div className="flex items-center justify-start gap-2">
                            {isLoading ? (
                                <>
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-6 w-40" />
                                </>
                            ) : statistics && (
                                <>
                                    <p className='text-lg'>
                                        <span className='font-semibold'>Total Ingreso:</span> {formatOnlyNumberWithDots(statistics.totals.total)} $
                                    </p>
                                    <PaymentStatisticsDetail statistics={statistics} />
                                </>
                            )}
                        </div>

                        <FilterBadges />
                    </div>

                    <TableComponent
                        loading={isLoading}
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
                    className="w-200"
                    label2="Registrar Pago"
                    label1="Actualizar Pago"
                    isEdit={paymentSelected ? true : false}
                >
                    <PaymentForm
                        onSubmit={savePayments}
                        data={paymentSelected}
                        accounts={paymentAccounts}
                        descriptions={paymentDescriptions}
                    />
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
                    <AlertDialogPayment onSubmit={handleDisassociatePayment} />
                </DialogComponent>
            )}

            {openConfirmDialog && (
                <DialogComponent
                    open={openConfirmDialog}
                    setOpen={setOpenConfirmDialog}
                    className="w-md"
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
                    className="w-md"
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

            {openView && invoice && (
                <InvoicePreview openDialog={openView} setOpenDialog={closePreview} invoice={invoice} />
            )}
        </div>
    );
};