import { Input } from '@/components/ui/input'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Form } from '@/components/ui/form'
import { BodyInventoryLoss, IInventory } from '@/interfaces/inventory.interface'

interface InventoryLossFormProps {
    onSubmit: (data: BodyInventoryLoss) => void;
    data?: IInventory | null;
}

export const InventoryLossForm: FC<InventoryLossFormProps> = ({ onSubmit, data }) => {
    const formInventoryLoss = useForm<BodyInventoryLoss>({
        defaultValues: {
            productId: 0,
            quantity: 0,
            reason: '',
        },
    });

    useEffect(() => {
        if (data) {
            setTimeout(() => {
                formInventoryLoss.reset({
                    productId: data.productId,
                    quantity: 0,
                    reason: '',
                })
            }, 0);
        }
    }, [data])

    const onSubmitLoss = (formData: BodyInventoryLoss) => {
        onSubmit({
            ...formData,
            productId: data?.productId ?? formData.productId,
            quantity: Number(formData.quantity),
        });
    }

    return (
        <Form {...formInventoryLoss}>
            <form onSubmit={formInventoryLoss.handleSubmit(onSubmitLoss)} className="flex flex-wrap justify-start items-start gap-4 w-full py-4">
                <div className="space-y-2 w-full">
                    <Label className="text-right w-full">
                        Producto
                    </Label>
                    <Input
                        className="w-full"
                        value={data ? `${data.product.name} - ${data.product.presentation}` : ''}
                        readOnly
                        disabled
                    />
                </div>

                <div className="space-y-2 w-full">
                    <Label className="text-right w-full">
                        Cantidad de merma (disponible: {data ? data.quantity : 0})
                    </Label>
                    <Input
                        type='number'
                        min={0}
                        step='0.001'
                        max={data ? data.quantity : undefined}
                        {...formInventoryLoss.register('quantity', { valueAsNumber: true })}
                    />
                </div>

                <div className="space-y-2 w-full">
                    <Label className="text-right w-full">
                        Motivo (opcional)
                    </Label>
                    <Input
                        className="w-full"
                        placeholder="Ej: desmoronamiento del corte"
                        {...formInventoryLoss.register('reason')}
                    />
                </div>

                <div className='w-full flex items-center justify-center'>
                    <Button type='submit' variant='primary' className='w-40'>Guardar merma</Button>
                </div>
            </form>
        </Form>
    )
}
