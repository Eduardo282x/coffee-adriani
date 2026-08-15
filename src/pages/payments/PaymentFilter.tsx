import { DateRangePicker } from '@/components/datepicker/DateRangePicker';
import { Label } from '@/components/ui/label';
import { FC } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from '@/components/table/Filter';
import { AccountPay, DescriptionPayment, IPayments, Method } from '@/interfaces/payment.interface';
import { IColumns } from '@/components/table/table.interface';
import { DropDownFilter } from '@/components/dropdownFilter/DropDownFilter';
import { PaymentFilterType } from './payment.data';
import { IOptions } from '@/interfaces/form.interface';
import { ProductType } from '@/interfaces/product.interface';
import { paymentFilterStore } from '@/store/paymentFilterStore';


interface SelectFiltersOptions {
    label: string;
    value: string;
    name: PaymentFilterType;
    options: IOptions[];
}

interface PaymentsFilterProps {
    setPaymentsFilter: (value: IPayments[]) => void;
    paymentsColumns: IColumns<IPayments>[];
    methods: Method[];
    accounts: AccountPay[];
    types: ProductType[];
    typeDescription: DescriptionPayment[];
}

export const PaymentFilter: FC<PaymentsFilterProps> = ({
    setPaymentsFilter,
    paymentsColumns,
    methods,
    accounts,
    types,
    typeDescription,
}) => {
    const search = paymentFilterStore((state) => state.search);
    const setSearch = paymentFilterStore((state) => state.setSearch);
    const selectedAccount = paymentFilterStore((state) => state.selectedAccount);
    const selectedMethod = paymentFilterStore((state) => state.selectedMethod);
    const selectCredits = paymentFilterStore((state) => state.selectCredits);
    const typeProduct = paymentFilterStore((state) => state.typeProduct);
    const typeDescriptionSelected = paymentFilterStore((state) => state.typeDescription);
    const selectedAssociation = paymentFilterStore((state) => state.selectedAssociation);
    const accountType = paymentFilterStore((state) => state.accountType);
    const setSelectedAccount = paymentFilterStore((state) => state.setSelectedAccount);
    const setSelectedMethod = paymentFilterStore((state) => state.setSelectedMethod);
    const setSelectCredits = paymentFilterStore((state) => state.setSelectCredits);
    const setTypeProduct = paymentFilterStore((state) => state.setTypeProduct);
    const setTypeDescription = paymentFilterStore((state) => state.setTypeDescription);
    const setSelectedAssociation = paymentFilterStore((state) => state.setSelectedAssociation);
    const setAccountType = paymentFilterStore((state) => state.setAccountType);
    const dateStart = paymentFilterStore((state) => state.dateStart);
    const setDateStart = paymentFilterStore((state) => state.setDateStart);

    const handleChangeFilter = (name: PaymentFilterType, value: string) => {
        switch (name) {
            case 'account':
                setSelectedAccount(value);
                break;
            case 'method':
                setSelectedMethod(value);
                break;
            case 'credit':
                setSelectCredits(value as 'credit' | 'noCredit' | 'all');
                break;
            case 'type':
                setTypeProduct(value);
                break;
            case 'typeDescription':
                setTypeDescription(value);
                break;
            case 'associated':
                setSelectedAssociation(value as 'associated' | 'unassociated' | 'all');
                break;
            case 'accountType':
                setAccountType(value);
                break;
            default:
                break;
        }
    };

    const optionsFilters: SelectFiltersOptions[] = [
        {
            label: 'Tipo de cuenta',
            value: accountType,
            name: 'accountType',
            options: [
                { label: 'Todos', value: 'all' },
                { label: 'Entrada', value: 'INCOME' },
                { label: 'Proveedores', value: 'SUPPLIER' },
                { label: 'Gastos/Salidas', value: 'EXPENSE' },
                { label: 'Gastos Personales', value: 'PERSONAL_EXPENSES' }
            ]
        },
        {
            label: 'Cuentas de pago',
            value: selectedAccount,
            name: 'account',
            options: [
                { label: 'Todos', value: 'all' },
                ...accounts.map(acc => ({ label: `${acc.name} ${acc.bank}`, value: acc.id.toString() }))
            ]
        },
        {
            label: 'Métodos de pago',
            value: selectedMethod,
            name: 'method',
            options: [
                { label: 'Todas', value: 'all' },
                ...methods.map(met => ({ label: met.name, value: met.id.toString() }))
            ]
        },
        {
            label: 'Pagos asociados',
            value: selectedAssociation,
            name: 'associated',
            options: [
                { label: 'Todos', value: 'all' },
                { label: 'Asociados', value: 'associated' },
                { label: 'Sin Asociar', value: 'unassociated' }
            ]
        },
        {
            label: 'Pagos con abonos',
            value: selectCredits,
            name: 'credit',
            options: [
                { label: 'Todos', value: 'all' },
                { label: 'Abonos', value: 'credit' },
                { label: 'Sin Abonos', value: 'noCredit' }
            ]
        },
        {
            label: 'Tipo de producto',
            value: typeProduct,
            name: 'type',
            options: [
                { label: 'Todos', value: 'all' },
                ...types.map(ty => ({ label: ty.type, value: ty.type }))
            ]
        },
        {
            label: 'Tipo de gasto',
            value: typeDescriptionSelected,
            name: 'typeDescription',
            options: [
                { label: 'Todos', value: 'all' },
                ...typeDescription.map(ty => ({ label: ty.description, value: ty.description }))
            ]
        },
    ];

    return (
        <div className="flex items-center gap-3">
            <DateRangePicker setDatePicker={setDateStart} datePicker={dateStart} label={'Rango de Fecha'} />
            <div className="w-60">
                <Label className="mb-2">Buscar</Label>
                <Filter
                    dataBase={[]}
                    columns={paymentsColumns}
                    setDataFilter={setPaymentsFilter}
                    setSearch={setSearch}
                    filterInvoices={true}
                    filterInvoicesPayments={true}
                    initialValue={search}
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