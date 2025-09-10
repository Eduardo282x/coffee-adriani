import { Input } from '@/components/ui/input'
import { FromProps, IOptions } from '@/interfaces/form.interface'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BodyInventory } from '@/interfaces/inventory.interface'
import { FormSelect } from '@/components/form/FormSelect'
import { Form } from '@/components/ui/form'
import { DatePicker } from '@/components/datepicker/DatePicker'

const validationSchema = z.object({
    productId: z.coerce.number().positive().min(0),
    quantity: z.coerce.number().positive().min(0),
    date: z.any(),
})

interface InventoryFormProps extends FromProps {
    products: IOptions[]
}

export const InventoryForm: FC<InventoryFormProps> = ({ onSubmit, data, products }) => {
    const isEdit = data.productId !== 0 ? true : false;
    const [entryDate, setEntryDate] = useState<Date | undefined>(new Date());

    const form = useForm<BodyInventory>({
        defaultValues: {
            productId: 0,
            quantity: 0,
            date: new Date()
        },
        resolver: zodResolver(validationSchema)
    })

    useEffect(() => {
        if (data) {
            setTimeout(() => {
                form.reset({
                    productId: data.productId,
                    quantity: data.quantity
                })
            }, 0);
        }
    }, [data, products])

    useEffect(() => {
        form.setValue('date', entryDate);
    }, [entryDate])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap justify-start items-start gap-4 w-full  py-4">
                <FormSelect form={form} name='productId' label='Producto' placeholder='Seleccione un producto' options={products}></FormSelect>
                <div className="space-y-4 w-full">
                    <Label className="text-right">
                        Cantidad
                    </Label>
                    <Input type='number' min={0} {...form.register('quantity', { valueAsNumber: true })} />
                </div>

                
                {!isEdit && (
                    <DatePicker
                        label='Fecha de ingreso'
                        date={entryDate}
                        setDate={setEntryDate}
                        maxDate={undefined}
                        minDate={undefined}
                    />
                )}

                <div className='w-full flex items-center justify-center'>
                    <Button type='submit' variant='primary' className='w-40' >Enviar</Button>
                </div>
            </form>
        </Form>
    )
}
