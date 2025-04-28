import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IOptions } from '@/interfaces/form.interface'
import { IInvoice } from '@/interfaces/invoice.interface'
import { IPaymentForm, IPaymentMethods } from '@/interfaces/payment.interface'
import { getPaymentMethod } from '@/services/payment.service'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface IInvoicePay {
    invoice: IInvoice | null;
    onSubmitForm: (payment: IPaymentForm) => void;
}

export const InvoicePay: FC<IInvoicePay> = ({ invoice, onSubmitForm }) => {
    const [methods, setMethods] = useState<IOptions[]>([])

    const form = useForm<IPaymentForm>({
        defaultValues: {
            invoiceId: Number(invoice?.controlNumber),
            amount: Number(invoice?.totalAmount),
            methodId: 0,
        }
    })

    useEffect(() => {
        getMethodsApi();
    }, [])

    const getMethodsApi = async () => {
        const response = await getPaymentMethod()
        const parseMethods = response.map((met: IPaymentMethods) => {
            return {
                label: met.name,
                value: met.id
            }
        })
        setMethods(parseMethods)
    }

    const onSubmit = (data: IPaymentForm) => {
        onSubmitForm({
            ...data,
            invoiceId: Number(invoice?.id),
            methodId: Number(data.methodId),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start justify-start gap-5 w-full py-4">

                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Factura
                    </Label>
                    <Input readOnly {...form.register('invoiceId')} />
                </div>

                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Cantidad
                    </Label>
                    <Input {...form.register('amount')} />
                </div>

                <FormSelect form={form} name='methodId' label='Método de pago' placeholder='Seleccione método' options={methods}></FormSelect>

                <div className='w-full flex justify-center'>
                    <Button className="bg-green-700 hover:bg-green-600 text-white w-32" type='submit'>Pagar</Button>
                </div>
            </form>
        </Form>
    )
}
