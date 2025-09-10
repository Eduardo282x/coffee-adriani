import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FromProps } from '@/interfaces/form.interface'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

export const DolarForm: FC<FromProps> = ({ onSubmit }) => {

    const { register, handleSubmit } = useForm({
        defaultValues: {
            dolar: 0
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full gap-5 items-start'>
            <div className="flex flex-col items-start justify-start gap-4 w-full">
                <Label className="text-right">
                    Nueva Tasa
                </Label>
                <Input type='number' step="0.01" min={0} {...register('dolar')} />
            </div>

            <div className='w-full flex items-center justify-center'>
                <Button type='submit' variant='primary' className='w-40' >Actualizar</Button>
            </div>
        </form>
    )
}
