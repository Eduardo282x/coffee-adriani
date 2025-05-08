import { Input } from '@/components/ui/input'
import { FromProps } from '@/interfaces/form.interface'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { defaultValues, FormDataProduct, formDataProduct, IProductsForm } from './products.data'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const validationSchema = z.object({
  name: z.string(),
  presentation: z.string(),
  price: z.coerce.number().positive().min(0),
  amount: z.coerce.number().positive().min(0),
  priceUSD: z.coerce.number().positive().min(0),
  purchasePrice: z.coerce.number().positive().min(0),
})

export const ProductForm: FC<FromProps> = ({ data, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm<IProductsForm>({
    defaultValues,
    resolver: zodResolver(validationSchema)
  })

  useEffect(() => {
    if (data) {
      const parseBodyData: IProductsForm = {
        name: data.name,
        presentation: data.presentation,
        price: data.price,
        priceUSD: data.priceUSD,
        amount: data.amount,
        purchasePrice: data.purchasePrice,
      }
      reset(parseBodyData)
    }
  }, [data])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap justify-start items-start gap-4 w-full  py-4">
        {formDataProduct && formDataProduct.map((data: FormDataProduct, index: number) => (
          <div key={index} className="flex flex-col items-start justify-start gap-4 w-full">
            <Label className="text-right">
              {data.label}
            </Label>
            {data.type === 'text'
              ? <Input {...register(data.name)} />
              : <Input type='number' step="0.01" min={0} {...register(data.name)} />
            }
          </div>
        ))}

        <div className='w-full flex items-center justify-center'>
          <Button type='submit' className='w-40' >Enviar</Button>
        </div>
      </form>

    </div>
  )
}
