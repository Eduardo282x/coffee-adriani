import { DateRangePicker } from '@/components/datepicker/DateRangePicker';
import { Label } from '@/components/ui/label';
import { FC, useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from '@/components/table/Filter';
import { getPaymentMethod, getPaymentAccounts, getPaymentDescriptions } from '@/services/payment.service';
import { Account, DescriptionPayment, IPayments, Method } from '@/interfaces/payment.interface';
import { DateRange } from 'react-day-picker';
import { IColumns } from '@/components/table/table.interface';
import { DropDownFilter } from '@/components/dropdownFilter/DropDownFilter';
import { PaymentFilters, PaymentFilterType } from './payment.data';
import { IOptions } from '@/interfaces/form.interface';
import { ProductType } from '@/interfaces/product.interface';
import { getProductType } from '@/services/products.service';


interface SelectFiltersOptions {
    label: string;
    value: string;
    name: PaymentFilterType;
    options: IOptions[];
}

interface PaymentsFilterProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    payments: IPayments[];
    handleChangeSearch: (value: string) => void;
    setPaymentsFilter: (value: IPayments[]) => void;
    paymentsColumns: IColumns<IPayments>[];
    filters: PaymentFilters;
    handleChangeFilter: (filter: PaymentFilterType, value: string) => void;
}

export const PaymentFilter: FC<PaymentsFilterProps> = ({
    date,
    setDate,
    filters,
    handleChangeFilter,
    // payments,
    handleChangeSearch,
    setPaymentsFilter,
    paymentsColumns
}) => {
    const [methods, setMethods] = useState<Method[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [types, setTypes] = useState<ProductType[]>([]);
    const [typeDescription, setTypeDescription] = useState<DescriptionPayment[]>([]);

    const [optionsFilters, setOptionsFilters] = useState<SelectFiltersOptions[]>([])

    const getPaymentAccountsApi = async () => {
        const response = await getPaymentAccounts();
        setAccounts(response);
    }
    const getPaymentMethodsApi = async () => {
        const response = await getPaymentMethod();
        setMethods(response);
    }
    const getProductsTypesApi = async () => {
        const response = await getProductType();
        setTypes(response);
    }
    const getPaymentTypeDescriptionApi = async () => {
        const response = await getPaymentDescriptions();
        setTypeDescription(response);
    }

    useEffect(() => {
        const filtersOptions: SelectFiltersOptions[] = [
            {
                label: 'Cuentas de pago',
                value: filters.account,
                name: 'account',
                options: [
                    { label: 'Todos', value: 'all' },
                    ...accounts.map(acc => ({ label: `${acc.name} ${acc.bank}`, value: acc.id.toString() }))
                ]
            },
            {
                label: 'Métodos de pago',
                value: filters.method,
                name: 'method',
                options: [
                    { label: 'Todas', value: 'all' },
                    ...methods.map(met => ({ label: met.name, value: met.id.toString() }))
                ]
            },
            {
                label: 'Pagos asociados',
                value: filters.associated,
                name: 'associated',
                options: [
                    { label: 'Todos', value: 'all' },
                    { label: 'Asociados', value: 'associated' },
                    { label: 'Sin Asociar', value: 'noAssociated' }
                ]
            },
            {
                label: 'Pagos con abonos',
                value: filters.credit,
                name: 'credit',
                options: [
                    { label: 'Todos', value: 'all' },
                    { label: 'Abonos', value: 'credit' },
                    { label: 'Sin Abonos', value: 'noCredit' }
                ]
            },
            {
                label: 'Tipo de producto',
                value: filters.type,
                name: 'type',
                options: [
                    { label: 'Todos', value: 'all' },
                    ...types.map(ty => ({ label: ty.type, value: ty.type }))
                ]
            },
            {
                label: 'Tipo de gasto',
                value: filters.typeDescription,
                name: 'typeDescription',
                options: [
                    { label: 'Todos', value: 'all' },
                    ...typeDescription.map(ty => ({ label: ty.description, value: ty.description }))
                ]
            },
        ];

        setOptionsFilters(filtersOptions);
    }, [methods, accounts, types, filters])

    useEffect(() => {
        getProductsTypesApi();
        getPaymentMethodsApi();
        getPaymentAccountsApi();
        getPaymentTypeDescriptionApi();
    }, [])

    return (
        <div className="flex items-center gap-3">
            <DateRangePicker setDatePicker={setDate} datePicker={date} label={'Rango de Fecha'} />
            <div className="w-60">
                <Label className="mb-2">Buscar</Label>
                <Filter
                    dataBase={[]}
                    columns={paymentsColumns}
                    setDataFilter={setPaymentsFilter}
                    setSearch={handleChangeSearch}
                    filterInvoices={true}
                    filterInvoicesPayments={true}
                />
            </div>

            <DropDownFilter>
                <div className='space-y-2 p-1'>
                    {optionsFilters.map((item, index) => (
                        <div key={index} className="flex items-center justify-between w-80">
                            <Label className="mb-2">{item.label}</Label>
                            <Select value={item.value} onValueChange={(value) => handleChangeFilter(item.name, value)}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Métodos de pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {item.options.map((opt: IOptions) => (
                                            <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}

                </div>
            </DropDownFilter>
        </div>
    )
}