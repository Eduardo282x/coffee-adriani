import { Input } from '@/components/ui/input'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Form } from '@/components/ui/form'
import { BodyInventoryLoss, IInventory } from '@/interfaces/inventory.interface'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface InventoryLossFormProps {
    onSubmit: (data: BodyInventoryLoss) => void;
    data?: IInventory | null;
}

// El backend exige quantity > 0 para la merma y la razón es obligatoria.
const inventoryLossSchema = z.object({
    productId: z.number(),
    quantity: z.number({ required_error: 'Este campo es requerido.' }).positive('La cantidad de merma debe ser mayor a 0.'),
    reason: z.string().trim().min(1, { message: 'Indique el motivo de la merma.' }),
});

export const InventoryLossForm: FC<InventoryLossFormProps> = ({ onSubmit, data }) => {
    const formInventoryLoss = useForm<BodyInventoryLoss>({
        defaultValues: {
            productId: 0,
            quantity: 0,
            reason: '',
        },
        resolver: zodResolver(inventoryLossSchema),
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
            productId: data?.productId ?? formData.productId,
            quantity: Number(formData.quantity),
            reason: formData.reason.trim(),
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
                        min={0.001}
                        step='0.001'
                        max={data ? data.quantity : undefined}
                        {...formInventoryLoss.register('quantity', { valueAsNumber: true })}
                    />
                </div>

                <div className="space-y-2 w-full">
                    <Label className="text-right w-full">
                        Motivo
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
