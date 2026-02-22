import { InputAutocomplete } from '@/components/autocomplete/InputAutocomplete'
import { DatePicker } from '@/components/datepicker/DatePicker'
import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    const [showFieldDescription, setShowFieldDescription] = useState<boolean>(false);
    const today = new Date();
    // const defaultDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const defaultTime = today.toTimeString().slice(0, 5); // "HH:mm"

    const accountsOptions = useMemo<IOptions[]>(() => {
        return accounts.map(item => ({
            label: `${item.bank} - ${item.name}`,
            value: item.id
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
                accountId: data.accountId.toString(),
                description: data.description,
            }
            setDateDispatch(data.paymentDate)
            form.reset(formData)
        }
    }, [data, accountsOptions, descriptionOptions])

    const form = useForm<IPaymentForm>({
        defaultValues: {
            reference: '',
            amount: 0,
            time: defaultTime,
            accountId: 0,
            description: '',
        }
    });

    useEffect(() => {
        const getValue = form.watch('accountId');
        const findAccount = accountsOptions.find(item => item.value == getValue);
        setShowFieldDescription(findAccount?.label.includes('Gastos') as boolean)
    }, [form.watch('accountId')])

    const onSubmitForm = (data: IPaymentForm) => {
        const dateObj = typeof paymentDate === 'string' ? new Date(paymentDate) : paymentDate;
        const parseDate = dateObj?.toISOString() as string;
        const newPaymentDate = `${parseDate.toString().split('T')[0]}T${data.time}:00.000Z`
        const parseData = {
            reference: data.reference,
            amount: Number(data.amount),
            accountId: Number(data.accountId),
            paymentDate: newPaymentDate,
            description: form.getValues('description'),
        }
        onSubmit(parseData)
    }

    const changeFiltersDescription = (value: string) => {
        form.setValue('description', value)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="flex flex-col items-start justify-start gap-5 w-full py-4">

                <FormSelect
                    form={form}
                    name='accountId'
                    label='Cuenta de pago'
                    placeholder='Seleccione cuenta'
                    options={accountsOptions}></FormSelect>

                <DatePicker date={paymentDate} setDate={setDateDispatch} label="Fecha de Pago" maxDate={new Date()} minDate={new Date(2000)} />


                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Hora
                    </Label>
                    <Input {...form.register('time')} type='time' />
                </div>

                {/* <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Hora
                    </Label>
                    <TimePicker
                        onChange={(value) => console.log(value)}
                        // value={form.watch('time')}
                        format="hh:mm a"
                        disableClock
                        clearIcon={null}
                    />
                </div> */}

                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Cantidad
                    </Label>
                    <Input {...form.register('amount')} />
                </div>

                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Referencia
                    </Label>
                    <Input autoComplete='off' {...form.register('reference')} />
                </div>

                {showFieldDescription && (
                    <div className="flex flex-col items-start justify-start gap-4 w-full">
                        <Label className="text-right">
                            Tipo de gasto
                        </Label>
                        <InputAutocomplete
                            data={descriptionOptions}
                            placeholder=''
                            fullSize={true}
                            valueDefault={form.getValues('description')}
                            onChange={changeFiltersDescription}
                        />
                    </div>
                )}

                <div className='w-full flex justify-center'>
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