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
import { IProducts } from '@/interfaces/product.interface'
import { getProduct } from '@/services/products.service'
import { Form } from '@/components/ui/form'

const validationSchema = z.object({
    productId: z.coerce.number().positive().min(0),
    quantity: z.coerce.number().positive().min(0),
})

export const InventoryForm: FC<FromProps> = ({ onSubmit }) => {
    const [products, setProducts] = useState<IOptions[]>([]);

    const form = useForm<BodyInventory>({
        defaultValues: {
            productId: 0,
            quantity: 0
        },
        resolver: zodResolver(validationSchema)
    })

    useEffect(() => {
        getProductsApi();
    }, [])

    const getProductsApi = async () => {
        const response: IProducts[] = await getProduct();
        const parseProducts = response.map(pro => {
            return {
                label: pro.name,
                value: pro.id
            }
        })
        setProducts(parseProducts);
    }

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
