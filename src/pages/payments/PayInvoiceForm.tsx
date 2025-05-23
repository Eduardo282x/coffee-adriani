import { FromProps } from '@/interfaces/form.interface'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AssociatePayInvoice, IPayments } from '@/interfaces/payment.interface';
import { formatNumberWithDots } from '@/hooks/formaters';

export const PayInvoiceForm: FC<FromProps> = ({ onSubmit, data }) => {
    const [infoPayment, setInforPayment] = useState<IPayments>(data)

    const { register, handleSubmit } = useForm<AssociatePayInvoice>({
        defaultValues: {
            invoice: ''
        }
    })

    const setPayment = (payment: IPayments, remaining: boolean): string => {
        if (payment.currency === 'USD') {
            return formatNumberWithDots(remaining ? data.remaining :  data.amountUSD, '', ' $');
        } else {
            return formatNumberWithDots(remaining ? data.remaining : data.amountBs, '', ' Bs');
        }
    }

    useEffect(() => {
        console.log(data);
    }, [])

    return (
        <div>
            <p>Información del pago</p>
            <p>Total: {setPayment(infoPayment, false)}</p>
            <p>Restante: {setPayment(infoPayment, true)}</p>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-wrap justify-start items-start gap-4 w-full py-4"
            >
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label className="text-right">Numero de factura</Label>
                    <Input {...register('invoice')} />
                </div>
                <div className='w-full flex items-center justify-center'>
                    <Button type='submit' className='w-40'>Pagar factura</Button>
                </div>
            </form>
        </div>
    )
}
