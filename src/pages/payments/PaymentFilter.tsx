import { DateRangePicker } from '@/components/datepicker/DateRangePicker';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { FC, useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from '@/components/table/Filter';
import { getPaymentMethod } from '@/services/payment.service';
import { IPaymentMethods, IPayments } from '@/interfaces/payment.interface';
import { DateRange } from 'react-day-picker';
import { IColumns } from '@/components/table/table.interface';
import { Download } from 'lucide-react';


interface PaymentsFilterProps {
    handleChangeStatusPay: (value: string) => void;
    handleChangeMethods: (value: string) => void;
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    payments: IPayments[];
    setPaymentsFilter: (value: IPayments[]) => void;
    paymentsColumns: IColumns<IPayments>[];
}

export const PaymentFilter: FC<PaymentsFilterProps> = ({
    date,
    setDate,
    handleChangeMethods,
    handleChangeStatusPay,
    payments,
    setPaymentsFilter,
    paymentsColumns
}) => {

    const [methods, setMethods] = useState<IPaymentMethods[]>([]);

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

            <div className="min-w-32">
                <Label className="mb-2">Estado Pago</Label>
                <Select onValueChange={handleChangeStatusPay}>
                    <SelectTrigger className="w-full">
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
            </div>

            <div className="min-w-32">
                <Label className="mb-2">Métodos de pago</Label>
                <Select onValueChange={handleChangeMethods}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Métodos de pago" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='all'>Todos</SelectItem>
                            {methods && methods.map((met: IPaymentMethods, index: number) => (
                                <SelectItem key={index} value={met.id.toString()}>{met.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-60">
                <Label className="mb-2">Buscar</Label>
                <Filter dataBase={payments} columns={paymentsColumns} setDataFilter={setPaymentsFilter} />
            </div>

            <Button className="bg-green-700 hover:bg-green-600 text-white translate-y-3"><Download /> Exportar</Button>
        </div>
    )
}
