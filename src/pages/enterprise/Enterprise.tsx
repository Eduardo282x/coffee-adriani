import { TableComponent } from '@/components/table/TableComponent';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DateRangePicker } from '@/components/datepicker/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Filter } from '@/components/table/Filter';
import { DialogComponent } from '@/components/dialog/DialogComponent';
import { DateRange } from 'react-day-picker';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { enterpriseColumns, enterpriseDetailColumns, enterprisePaymentColumns } from './enterprise.data';
import { EnterpriseForm } from './EnterpriseForm';
import { EntryPaymentForm } from './EntryPaymentForm';
import { useEnterpriseEntries } from '@/hooks/enterprise-entries.hook';
import { IInventoryEntry, CreateInventoryEntryForm, EntryPaymentForm as EntryPaymentFormType, EntryPaymentsResponse } from '@/interfaces/inventory.interface';
import { productStore } from '@/store/productStore';
import { useSuppliers } from '@/hooks/supplier.hook';
import { useOptimizedPayments } from '@/hooks/payment.hook';
import { getEntryPayments } from '@/services/inventory.service';
import { Snackbar } from '@/components/snackbar/Snackbar';
import toast from 'react-hot-toast';
import { DolarComponents } from '@/components/dolar/DolarComponents';

export const Enterprise = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [openPaymentsListDialog, setOpenPaymentsListDialog] = useState<boolean>(false);
    const [entrySelected, setEntrySelected] = useState<IInventoryEntry | null>(null);
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [entryPayments, setEntryPayments] = useState<EntryPaymentsResponse | null>(null);

    const { products, productOptions } = productStore((state) => state);
    const getProductsApi = productStore((state) => state.getProductsApi);

    const { suppliers } = useSuppliers();
    const { paymentAccounts } = useOptimizedPayments({ pageSize: 50 });

    const {
        entries,
        pagination,
        isLoading,
        isMutating,
        createEntry,
        updateEntry,
        removeEntry,
        applyDateFilter,
        handleChangeSearch,
        refetch,
    } = useEnterpriseEntries({ pageSize: 50 });

    useEffect(() => {
        if (!products || products.products.length == 0) {
            getProductsApi();
        }
    }, [products, getProductsApi])

    useEffect(() => {
        if (date?.from && date?.to) {
            applyDateFilter({
                startDate: date.from,
                endDate: date.to
            });
        } else {
            applyDateFilter(null);
        }
    }, [date?.from, date?.to]);

    const getActions = async (action: string, data: IInventoryEntry) => {
        if (action === 'Ver Pagos') {
            setEntrySelected(data);
            const payments = await getEntryPayments(data.id);
            setEntryPayments(payments);
            setTimeout(() => setOpenPaymentsListDialog(true), 0);
        }
        if (action === 'Agregar Pago') {
            if (Number(data.remaining) <= 0) {
                toast.custom(<Snackbar success={false} message={"Esta entrada ya está completamente pagada"} />, {
                    duration: 1500,
                    position: 'bottom-center'
                });
                return;
            }
            setEntrySelected(data);
            setTimeout(() => setOpenPaymentDialog(true), 0);
        }
        if (action === 'Editar') {
            setEntrySelected(data);
            setTimeout(() => setOpenDialog(true), 0);
        }
        if (action === 'Eliminar') {
            setEntrySelected(data);
            setTimeout(() => setOpenDeleteDialog(true), 0);
        }
    };

    const handleNewEntry = () => {
        setEntrySelected(null);
        setTimeout(() => setOpenDialog(true), 0);
    };

    const handleSubmit = async (data: CreateInventoryEntryForm) => {
        try {
            if (entrySelected) {
                await updateEntry(entrySelected.id, data);
            } else {
                await createEntry(data);
            }
            setOpenDialog(false);
            setEntrySelected(null);
        } catch (error) {
            console.error('Error al guardar entrada:', error);
        }
    };

    const handleDelete = async () => {
        if (entrySelected) {
            await removeEntry(entrySelected.id);
        }
        setOpenDeleteDialog(false);
        setEntrySelected(null);
    };

    const handlePaymentSubmit = async (data: EntryPaymentFormType) => {
        try {
            // The payment creation is handled by the entry-payments endpoint
            // We need to call it from here
            const { createEntryPayment } = await import('@/services/inventory.service');
            await createEntryPayment(data);
            setOpenPaymentDialog(false);
            setEntrySelected(null);
            await refetch();
        } catch (error) {
            console.error('Error al registrar pago:', error);
        }
    };

    return (
        <div className="flex flex-col">
            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Entradas de Inventario</h1>
                </div>

                <div className="flex items-center gap-4">
                    <DolarComponents />

                    <Button onClick={handleNewEntry} disabled={isMutating}>
                        <Plus className="mr-2 h-4 w-4" />
                        Registrar Entrada
                    </Button>
                </div>
            </header>

            <div className="w-full h-3 bg-[#6f4e37] border-b"></div>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">
                        Gestión de Entradas de Inventario
                    </h2>

                    <div className="flex items-end gap-2">
                        <DateRangePicker
                            setDatePicker={setDate}
                            datePicker={date}
                            label={'Rango de Fecha'}
                        />
                        <div className="w-60">
                            <Label className="mb-2">Buscar</Label>
                            <Filter
                                dataBase={entries}
                                columns={enterpriseColumns}
                                setDataFilter={() => { }}
                                setSearch={handleChangeSearch}
                                filterInvoices={false}
                            />
                        </div>
                    </div>
                </div>

                <div className=''>
                    <TableComponent
                        loading={isLoading}
                        columns={enterpriseColumns}
                        dataBase={entries}
                        totalElements={pagination?.totalCount || 0}
                        action={getActions}
                        isExpansible={true}
                        renderRow={
                            (entry) => (
                                <div className="space-y-4">
                                    <TableComponent
                                        dataBase={entry.details}
                                        columns={enterpriseDetailColumns}>
                                    </TableComponent>
                                    {/* {entry.payments && entry.payments.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2 px-4">Pagos Asociados</h4>
                                            <TableComponent
                                                dataBase={entry.payments}
                                                columns={enterprisePaymentColumns}>
                                            </TableComponent>
                                        </div>
                                    )} */}
                                </div>
                            )
                        }
                    />
                </div>
            </main>

            {openDialog && (
                <DialogComponent
                    open={openDialog}
                    setOpen={setOpenDialog}
                    className="w-[50rem]"
                    label2="Registrar Entrada de Inventario"
                    label1="Actualizar Entrada de Inventario"
                    isEdit={entrySelected ? true : false}
                >
                    <EnterpriseForm
                        productOptions={productOptions}
                        products={products.products}
                        suppliers={suppliers}
                        onSubmit={handleSubmit}
                        data={entrySelected}
                    />
                </DialogComponent>
            )}

            {openPaymentDialog && entrySelected && (
                <DialogComponent
                    open={openPaymentDialog}
                    setOpen={setOpenPaymentDialog}
                    className="w-[40rem]"
                    label2="Registrar Pago"
                    label1="Registrar Pago"
                    isEdit={false}
                >
                    <EntryPaymentForm
                        entry={entrySelected}
                        accounts={paymentAccounts}
                        onSubmit={handlePaymentSubmit}
                        onCancel={() => setOpenPaymentDialog(false)}
                    />
                </DialogComponent>
            )}

            {openPaymentsListDialog && entrySelected && (
                <DialogComponent
                    open={openPaymentsListDialog}
                    setOpen={setOpenPaymentsListDialog}
                    className="w-[50rem]"
                    label2="Pagos de la Entrada"
                    label1="Pagos de la Entrada"
                    isEdit={true}
                >
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Total:</span>
                                    <p className="font-semibold">$ {entryPayments?.totalAmount || '0.00'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Pagado:</span>
                                    <p className="font-semibold text-green-600">$ {entryPayments?.totalPaid || '0.00'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Pendiente:</span>
                                    <p className="font-semibold text-red-600">$ {entryPayments?.remaining || '0.00'}</p>
                                </div>
                            </div>
                        </div>
                        {entryPayments?.payments && entryPayments.payments.length > 0 ? (
                            <TableComponent
                                dataBase={entryPayments.payments}
                                columns={enterprisePaymentColumns}>
                            </TableComponent>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No hay pagos registrados</p>
                        )}
                    </div>
                </DialogComponent>
            )}

            {openDeleteDialog && (
                <DialogComponent
                    open={openDeleteDialog}
                    setOpen={setOpenDeleteDialog}
                    className="w-[28rem]"
                    label2=""
                    label1="¿Deseas eliminar esta entrada?"
                    isEdit={true}
                >
                    <div className="flex items-center justify-center gap-8 mt-5">
                        <Button
                            onClick={() => setOpenDeleteDialog(false)}
                            className="text-lg"
                            disabled={isMutating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDelete}
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
