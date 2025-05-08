import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FromProps, IOptions } from '@/interfaces/form.interface'
import { IBank, IPaymentForm, Method } from '@/interfaces/payment.interface'
import { getBanks, getPaymentMethod } from '@/services/payment.service'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


export const PaymentForm: FC<FromProps> = ({ onSubmit, data }) => {
    const [methods, setMethods] = useState<Method[]>([]);
    const [methodOptions, setMethodOptions] = useState<IOptions[]>([]);
    const [bank, setBanks] = useState<IOptions[]>([]);

    useEffect(() => {
        if(data){
            console.log(data);
        }
    },[])

    const form = useForm<IPaymentForm>({
        defaultValues: {
            amount: 0,
            currency: '',
            reference: '',
            bank: '',
            methodId: 0,
        }
    })

    useEffect(() => {
        getMethodsApi();
        getBanksApi();
    }, [])

    const getBanksApi = async () => {
        const response = await getBanks();
        if(response){
            const parseBank = response.map((bank: IBank) => {
                return {
                    label: bank.bank,
                    value: bank.bank
                }
            })
            setBanks(parseBank)
        }
    }

    const getMethodsApi = async () => {
        const response = await getPaymentMethod();
        if(response){
            const parseMethods = response.map((met: Method) => {
                return {
                    label: met.name,
                    value: met.id
                }
            })
            setMethodOptions(parseMethods)
            setMethods(response)
        }
    }

    useEffect(() => {
        const changeMethod = form.watch('methodId')
        const findMethod = methods.find(me => me.id === Number(changeMethod));
        if (findMethod) {
            form.setValue('bank', findMethod.name === 'Efectivo' ? '' : form.getValues().bank)
            form.setValue('currency', findMethod.currency)
        }
    }, [form.watch('methodId')])

    const onSubmitForm = (data: IPaymentForm) => {
        const parseData = {
            ...data,
            amount: Number(data.amount),
            methodId: Number(data.methodId),
        }
        onSubmit(parseData)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="flex flex-col items-start justify-start gap-5 w-full py-4">

                <FormSelect form={form} name='bank' label='Banco' placeholder='Seleccione un banco' options={bank}></FormSelect>

                <FormSelect
                    form={form}
                    name='methodId'
                    label='Método de pago'
                    placeholder='Seleccione método'
                    options={methodOptions}></FormSelect>

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
