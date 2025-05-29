import { useForm } from "react-hook-form"
import { AccountForm } from "./accounts.data"
import { getBanks, getPaymentMethod } from "@/services/payment.service"
import { FC, useEffect, useState } from "react"
import { IBank, Method } from "@/interfaces/payment.interface"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormSelect } from "@/components/form/FormSelect"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FromProps, IOptions } from "@/interfaces/form.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const validationSchema = z.object({
    name: z.string(),
    bank: z.string(),
    methodId: z.coerce.number().positive().min(0),
})

export const AccountsForm: FC<FromProps> = ({ onSubmit, data }) => {
    const [methods, setMethods] = useState<IOptions[]>([]);
    const [banks, setBanks] = useState<IOptions[]>([]);

    useEffect(() => {
        if (data) {
            const parseData = {
                name: data.name,
                bank: data.bank,
                methodId: data.methodId
            }
            form.reset(parseData)
        }
    }, [data, methods, banks])

    const form = useForm<AccountForm>({
        defaultValues: {
            name: '',
            bank: '',
            methodId: 0
        },
        resolver: zodResolver(validationSchema)
    })

    useEffect(() => {
        getBanksApi();
        getMethodsApi();
    }, [])

    const getBanksApi = async () => {
        const response: IBank[] = await getBanks()
        setBanks(response.map(item => {
            return {
                label: item.bank,
                value: item.bank
            }
        }))
    }
    const getMethodsApi = async () => {
        const response: Method[] = await getPaymentMethod()
        setMethods(response.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        }))
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap justify-start items-start gap-4 w-full  py-4">
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Nombre
                    </Label>
                    <Input type='text' {...form.register('name')} />
                </div>

                <FormSelect form={form} name='bank' label='Banco' placeholder='Seleccione un banco' options={banks}></FormSelect>
                <FormSelect form={form} name='methodId' label='Metodo de pago' placeholder='Seleccione un metodo de pago' options={methods}></FormSelect>
                <div className='w-full flex items-center justify-center'>
                    <Button type='submit' className='w-40' >Enviar</Button>
                </div>
            </form>

        </Form>
    )
}
