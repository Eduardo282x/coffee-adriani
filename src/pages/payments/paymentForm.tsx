import { InputAutocomplete } from '@/components/autocomplete/InputAutocomplete'
import { DatePicker } from '@/components/datepicker/DatePicker'
import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProductDolar } from '@/hooks/product.hook'
import { FromProps, IOptions } from '@/interfaces/form.interface'
import { AccountPay, DescriptionPayment, IPaymentForm } from '@/interfaces/payment.interface'
import { FC, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';

// import TimePicker from 'react-time-picker';

interface PaymentFormProps extends FromProps {
    accounts: AccountPay[];
    descriptions: DescriptionPayment[];
}

export const PaymentForm: FC<PaymentFormProps> = ({ onSubmit, data, accounts, descriptions }) => {
    const [paymentDate, setDateDispatch] = useState<Date | undefined>(new Date());
    const today = new Date();
    const { dolar } = useProductDolar();
    // const defaultDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const defaultTime = today.toTimeString().slice(0, 5); // "HH:mm"

    const form = useForm<IPaymentForm>({
        defaultValues: {
            reference: '',
            amount: 0,
            dolar: Number(dolar?.dolar),
            time: defaultTime,
            accountId: 0,
            description: '',
            type: 'INCOME',
        }
    });

    const paymentTypeOptions = useMemo<IOptions[]>(() => [
        { label: 'Entrada', value: 'INCOME' },
        { label: 'Gasto de empresa', value: 'EXPENSE' },
        { label: 'Gasto personal', value: 'PERSONAL_EXPENSES' },
    ], []);

    const accountsOptions = useMemo<IOptions[]>(() => {
        return accounts.map(item => ({
            label: `${item.bank} - ${item.name}`,
            value: item.id.toString()
        }));
    }, [accounts]);

    const descriptionOptions = useMemo<IOptions[]>(() => {
        return descriptions.map(item => ({
            label: item.description,
            value: item.description
        }));
    }, [descriptions]);

    useEffect(() => {
        if (data) {
            const formData = {
                reference: data.reference,
                amount: data.amount,
                time: new Date(data.paymentDate).toISOString().split('T')[1].slice(0, 5),
                accountId: Number(data.accountId),
                description: data.description,
                type: data.type || 'INCOME',
            }
            setDateDispatch(data.paymentDate);

            setTimeout(() => {
                form.reset(formData)
            }, 100);
        }
    }, [data, form])

    const selectedAccountId = form.watch('accountId');

    useEffect(() => {
        const findAccount = accountsOptions.find(item => item.value == selectedAccountId?.toString());
        const isGastos = findAccount?.label.includes('Gastos') as boolean;
        form.setValue('type', isGastos ? 'EXPENSE' : 'INCOME');
    }, [accountsOptions, selectedAccountId, form])

    const onSubmitForm = (data: IPaymentForm) => {
        const dateObj = typeof paymentDate === 'string' ? new Date(paymentDate) : paymentDate;
        const parseDate = dateObj?.toISOString() as string;
        const newPaymentDate = `${parseDate.toString().split('T')[0]}T${data.time}:00.000Z`
        const parseData = {
            reference: data.reference,
            amount: Number(data.amount),
            dolar: Number(data.dolar),
            accountId: Number(data.accountId),
            paymentDate: newPaymentDate,
            description: form.getValues('description'),
            type: form.getValues('type'),
        }
        onSubmit(parseData)
    }

    const changeFiltersDescription = (value: string) => {
        form.setValue('description', value)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4 w-full">

                <Card>
                    <CardHeader className="text-[#6f4e37]">
                        <CardTitle className='font-semibold'>Información del Pago</CardTitle>
                        {/* <CardDescription>Datos generales del movimiento a registrar</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-3">
                                <FormSelect
                                    form={form}
                                    name='accountId'
                                    label='Cuenta de pago'
                                    placeholder='Seleccione cuenta'
                                    options={accountsOptions}></FormSelect>
                            </div>

                            <div className="flex flex-col items-start justify-start gap-2 w-full">
                                <Label>Cantidad</Label>
                                <Input type="number" step="0.01" min={0} placeholder="Monto en $ o Bs" {...form.register('amount')} />
                            </div>

                            <div className="flex flex-col items-start justify-start gap-2 w-full">
                                <Label>Tasa Dolar</Label>
                                <Input type="number" step="0.01" min={0} placeholder="" {...form.register('dolar')} />
                            </div>

                            <FormSelect
                                form={form}
                                name='type'
                                label='Tipo de pago'
                                placeholder='Seleccione tipo'
                                options={paymentTypeOptions}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="text-[#6f4e37]">
                        <CardTitle>Fecha y Referencia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <DatePicker date={paymentDate} setDate={setDateDispatch} label="Fecha de Pago" maxDate={new Date()} minDate={new Date(2000)} />

                            <div className="flex flex-col items-start justify-start gap-2 w-full">
                                <Label>Hora</Label>
                                <Input type='time' {...form.register('time')} />
                            </div>

                            <div className="flex flex-col items-start justify-start gap-2 w-full">
                                <Label>Referencia</Label>
                                <Input autoComplete='off' placeholder="Número de referencia" {...form.register('reference')} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Tipo de gasto</Label>
                                <InputAutocomplete
                                    data={descriptionOptions}
                                    placeholder='Seleccione o escriba un gasto'
                                    fullSize={true}
                                    valueDefault={form.getValues('description')}
                                    onChange={changeFiltersDescription}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className='w-full flex justify-center pt-2'>
                    <Button
                        className="bg-green-700 hover:bg-green-600 text-white w-32"
                        type='submit'
                        variant='primary'
                    >
                        Registrar Pago
                    </Button>
                </div>
            </form>
        </Form>
    )
}


export const AlertDialogPayment: FC<FromProps> = ({ onSubmit }) => {

    const handleClose = () => {
        onSubmit(false);
    }

    const handleSubmit = () => {
        onSubmit(true);
    }

    return (
        <div>
            <p>Estas seguro que deseas desasociar este pago?</p>
            <div className="flex items-center justify-end gap-4 mt-4">
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSubmit} className='bg-[#6f4e37] text-white hover:bg-[#a3795b] hover:text-white'>Desasociar</Button>
            </div>
        </div>
    )
}