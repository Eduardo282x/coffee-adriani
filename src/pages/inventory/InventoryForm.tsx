import { Input } from '@/components/ui/input'
import { FromProps, IOptions } from '@/interfaces/form.interface'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BodyInventory } from '@/interfaces/inventory.interface'
import { FormSelect } from '@/components/form/FormSelect'
import { Form } from '@/components/ui/form'

const validationSchema = z.object({
    productId: z.coerce.number().positive().min(0),
    quantity: z.coerce.number().positive().min(0),
})

interface InventoryFormProps extends FromProps {
    products: IOptions[]
}

export const InventoryForm: FC<InventoryFormProps> = ({ onSubmit, data, products }) => {
    const form = useForm<BodyInventory>({
        defaultValues: {
            productId: 0,
            quantity: 0
        },
        resolver: zodResolver(validationSchema)
    })

    useEffect(() => {
        if(data){
            setTimeout(() => {
                form.reset({
                    productId: data.productId,
                    quantity: data.quantity
                })
            }, 0);
        }
    },[data, products])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap justify-start items-start gap-4 w-full  py-4">
                <FormSelect form={form} name='productId' label='Producto' placeholder='Seleccione un producto' options={products}></FormSelect>
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Cantidad
                    </Label>
                    <Input type='number' min={0} {...form.register('quantity')} />
                </div>
                <div className='w-full flex items-center justify-center'>
                    <Button type='submit' className='w-40' >Enviar</Button>
                </div>
            </form>
        </Form>
    )
}
