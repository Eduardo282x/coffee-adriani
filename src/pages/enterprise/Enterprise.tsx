import { ScreenLoader } from '@/components/loaders/ScreenLoader';
import { TableComponent } from '@/components/table/TableComponent';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DateRangePicker } from '@/components/datepicker/DateRangePicker';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Filter } from '@/components/table/Filter';
import { DialogComponent } from '@/components/dialog/DialogComponent';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IPaymentEnterprise, PaymentEnterpriseForm } from '@/interfaces/payment.interface';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { enterpriseColumns, enterpriseItemColumnsDetails } from './enterprise.data';
import { EnterpriseForm } from './EnterpriseForm';
import { useEnterprisePayments } from '@/hooks/enterprise.hook';
import { ProductType } from '@/interfaces/product.interface';
import { getProductType } from '@/services/products.service';
import { useEffect } from 'react';
import { productStore } from '@/store/productStore';

export const Enterprise = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [paymentSelected, setPaymentSelected] = useState<IPaymentEnterprise | null>(null);
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);

    const { products, productOptions } = productStore((state) => state);
    const getProductsApi = productStore((state) => state.getProductsApi);

    useEffect(() => {
        if (!products || products.products.length == 0) {
            getProductsApi();
        }
    }, [products, getProductsApi])

    const {
        payments,
        pagination,
        isLoading,
        isMutating,
        createPayment,
        updatePayment,
        removePayment,
        applyDateFilter,
        typeProduct,
        handleChangeType,
        handleChangeSearch,
    } = useEnterprisePayments({ pageSize: 50 });

    useEffect(() => {
        fetchProductTypes();
    }, []);

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

    const fetchProductTypes = async () => {
        const types = await getProductType() as ProductType[];
        setProductTypes(types);
    };

    const getActions = (action: string, data: IPaymentEnterprise) => {
        if (action === 'Editar') {
            setPaymentSelected(data);
            setTimeout(() => setOpenDialog(true), 0);
        }
        if (action === 'Eliminar') {
            setPaymentSelected(data);
            setTimeout(() => setOpenDeleteDialog(true), 0);
        }
    };

    const handleNewPayment = () => {
        setPaymentSelected(null);
        setTimeout(() => setOpenDialog(true), 0);
    };

    const handleSubmit = async (data: PaymentEnterpriseForm) => {
        try {
            if (paymentSelected) {
                await updatePayment(paymentSelected.id, data);
            } else {
                await createPayment(data);
            }
            setOpenDialog(false);
            setPaymentSelected(null);
        } catch (error) {
            console.error('Error al guardar pago empresarial:', error);
        }
    };

    const handleDelete = async () => {
        if (paymentSelected) {
            await removePayment(paymentSelected.id);
        }
        setOpenDeleteDialog(false);
        setPaymentSelected(null);
    };

    return (
        <div className="flex flex-col">
            {(isLoading || isMutating) && <ScreenLoader />}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Pagos Empresariales</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={handleNewPayment} disabled={isMutating}>
                        <Plus className="mr-2 h-4 w-4" />
                        Registrar Pago
                    </Button>
                </div>
            </header>

            <div className="w-full h-3 bg-[#6f4e37] border-b"></div>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">
                        Gestión de Pagos Empresariales
                    </h2>

                    <div className="flex items-end gap-2">
                        <Select value={typeProduct} onValueChange={handleChangeType}>
                            <SelectTrigger className="w-24">
                                <SelectValue placeholder="Tipo de Producto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {productTypes && productTypes.map((ty: ProductType, index: number) => (
                                        <SelectItem key={index} value={ty.type}>{ty.type}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <DateRangePicker
                            setDatePicker={setDate}
                            datePicker={date}
                            label={'Rango de Fecha'}
                        />
                        <div className="w-60">
                            <Label className="mb-2">Buscar</Label>
                            <Filter
                                dataBase={payments}
                                columns={enterpriseColumns}
                                setDataFilter={() => { }}
                                setSearch={handleChangeSearch}
                                filterInvoices={false}
                            />
                        </div>
                    </div>
                </div>

                <div className=''>
                    <div className='w-full flex items-center justify-between my-2'>
                        <div className="flex items-center justify-start gap-2">
                            <p className='text-lg'>
                                <span className='font-semibold'>Total:</span> {payments.length} pagos
                            </p>
                        </div>
                        {pagination && (
                            <div className='flex items-center justify-start gap-2'>
                                <p className=''>
                                    <span className='font-semibold'>Página:</span> {pagination.page} de {pagination.totalPages}
                                </p>
                            </div>
                        )}
                    </div>

                    <TableComponent
                        columns={enterpriseColumns}
                        dataBase={payments}
                        totalElements={pagination?.totalCount || 0}
                        action={getActions}
                        isExpansible={true}
                        renderRow={
                            (details) => (
                                <TableComponent
                                    dataBase={details.items}
                                    columns={enterpriseItemColumnsDetails}>
                                </TableComponent>
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
                    label2="Registrar Pago Empresarial"
                    label1="Actualizar Pago Empresarial"
                    isEdit={paymentSelected ? true : false}
                >
                    <EnterpriseForm
                        productOptions={productOptions}
                        products={products.products}
                        onSubmit={handleSubmit}
                        data={paymentSelected}
                    />
                </DialogComponent>
            )}

            {openDeleteDialog && (
                <DialogComponent
                    open={openDeleteDialog}
                    setOpen={setOpenDeleteDialog}
                    className="w-[28rem]"
                    label2=""
                    label1="¿Deseas eliminar el pago empresarial?"
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