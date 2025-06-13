import { DateRangePicker } from '@/components/datepicker/DateRangePicker';
// import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { FC, useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from '@/components/table/Filter';
import { getPaymentMethod } from '@/services/payment.service';
import { IPayments, Method } from '@/interfaces/payment.interface';
import { DateRange } from 'react-day-picker';
import { IColumns } from '@/components/table/table.interface';
// import { Download } from 'lucide-react';
import { DropDownFilter } from '@/components/dropdownFilter/DropDownFilter';

// import { FaFilter } from 'react-icons/fa';

interface PaymentsFilterProps {
    // handleChangeStatusPay: (value: string) => void;
    handleChangeMethods: (value: string) => void;
    handleChangeStatusAssociated: (value: string) => void;
    handleChangeCredit: (value: string) => void;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    payments: IPayments[];
    setPaymentsFilter: (value: IPayments[]) => void;
    paymentsColumns: IColumns<IPayments>[];
}

interface PaymentSelectsProps {
    handleChangeMethods: (value: string) => void;
    handleChangeStatusAssociated: (value: string) => void;
    handleChangeCredit: (value: string) => void;
    methods: Method[];
}

export const PaymentFilter: FC<PaymentsFilterProps> = ({
    date,
    setDate,
    handleChangeMethods,
    handleChangeStatusAssociated,
    handleChangeCredit,
    payments,
    setPaymentsFilter,
    paymentsColumns
}) => {
    const [methods, setMethods] = useState<Method[]>([]);

    const getPaymentMethodsApi = async () => {
        const response = await getPaymentMethod();
        setMethods(response);
    }

    useEffect(() => {
        getPaymentMethodsApi();
    }, [])

    return (
        <div className="flex items-center gap-3">
            <DateRangePicker setDatePicker={setDate} datePicker={date} label={'Rango de Fecha'} />

            <div className="w-60">
                <Label className="mb-2">Buscar</Label>
                <Filter dataBase={payments} columns={paymentsColumns} setDataFilter={setPaymentsFilter} />
            </div>

            <DropDownFilter contentMenu={
                <FilterSelect
                    handleChangeMethods={handleChangeMethods}
                    handleChangeStatusAssociated={handleChangeStatusAssociated}
                    // handleChangeStatusPay={handleChangeStatusPay}
                    handleChangeCredit={handleChangeCredit}
                    methods={methods}
                />
            } />

            {/* <Button className="bg-green-700 hover:bg-green-600 text-white translate-y-3"><Download /> Exportar</Button> */}
        </div>
    )
}


const FilterSelect = ({
    // handleChangeStatusPay,
    handleChangeMethods,
    handleChangeCredit,
    methods,
    handleChangeStatusAssociated
}: PaymentSelectsProps) => {
    return (
        <div className='flex flex-col gap-2 p-1'>
            {/* <div className="flex items-center justify-between w-auto">
                <Label className="mb-2">Estado Pago</Label>
                <Select onValueChange={handleChangeStatusPay} >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Estado Pago" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            <SelectItem value='CONFIRMED'>Confirmado</SelectItem>
                            <SelectItem value='PENDING'>Pendiente</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div> */}

            <div className="flex items-center justify-between w-80">
                <Label className="mb-2">Métodos de pago</Label>
                <Select onValueChange={handleChangeMethods}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Métodos de pago" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            {methods && methods.map((met: Method, index: number) => (
                                <SelectItem key={index} value={met.id.toString()}>{met.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between w-80">
                <Label className="mb-2">Pagos asociados</Label>
                <Select onValueChange={handleChangeStatusAssociated}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Estado Pago" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            <SelectItem value='associated'>Asociados</SelectItem>
                            <SelectItem value='noAssociated'>Sin Asociar</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between w-80">
                <Label className="mb-2">Pagos con abonos</Label>
                <Select onValueChange={handleChangeCredit}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Estado Pago" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            <SelectItem value='credit'>Abonos</SelectItem>
                            <SelectItem value='noCredit'>Sin Abonos</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}