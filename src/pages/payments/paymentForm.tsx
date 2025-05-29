import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FromProps, IOptions } from '@/interfaces/form.interface'
import { AccountPay, IPaymentForm } from '@/interfaces/payment.interface'
import { getPaymentAccounts } from '@/services/payment.service'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


export const PaymentForm: FC<FromProps> = ({ onSubmit, data }) => {
    const [accountsOptions, setAccountsOptions] = useState<IOptions[]>([]);

    useEffect(() => {
        if (data) {
            const formData = {
                reference: data.reference,
                amount: data.amount,
                accountId: data.accountId.toString(),
            }
            form.reset(formData)
        }
    }, [data, accountsOptions])

    useEffect(() => {
        getAccountsApi()
    },[])

    const getAccountsApi = async () => {
        const response: AccountPay[] = await getPaymentAccounts()
        setAccountsOptions(response.map(data => {
            return {
                label: `${data.bank} - ${data.name}`,
                value: data.id
            }
        }))
    }

    const form = useForm<IPaymentForm>({
        defaultValues: {
            reference: '',
            amount: 0,
            accountId: 0,
        }
    })

    const onSubmitForm = (data: IPaymentForm) => {
        const parseData = {
            ...data,
            amount: Number(data.amount),
            accountId: Number(data.accountId),
        }
        onSubmit(parseData)
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

                <div className='w-full flex justify-center'>
                    <Button className="bg-green-700 hover:bg-green-600 text-white w-32" type='submit'>Registrar Pago</Button>
                </div>
            </form>
        </Form>
    )
}
