import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { clientsZones, defaultValues, IClientsForm, phoneOptions, rifOptions, TypesClientsForm } from './client.data'
import { FC, useEffect } from 'react'
import { InputSelect } from '@/components/form/InputSelect'
import { Form } from '@/components/ui/form'
import { FormSelect } from '@/components/form/FormSelect'
import { FromProps, IOptions } from '@/interfaces/form.interface'
import { Button } from '@/components/ui/button';

interface ClientFormProps extends FromProps {
    blocks: IOptions[]
}

export const ClientsForm: FC<ClientFormProps> = ({ data, onSubmit, blocks }) => {
    const form = useForm<IClientsForm>({
        defaultValues
    })

    useEffect(() => {
        if (data) {
            const findZone = data.zone !== '' ? clientsZones.find(zone => zone.label.toLowerCase().trim().includes(data.zone.toLowerCase().trim())) : ''
            const parseBodyData: IClientsForm = {
                name: data.name,
                rif: data.rif,
                address: data.address,
                phone: data.phone,
                zone: findZone ? findZone.value.toString() : '',
                blockId: data.blockId.toString(),
            }
            setTimeout(() => {
                form.reset(parseBodyData)
            }, 0);
        }
    }, [data, blocks])

    const setValueInput = (name: string, value: string) => {
        form.setValue(name as TypesClientsForm, value)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4 w-full  py-4">

                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Nombre
                    </Label>
                    <Input {...form.register('name')} />
                </div>

                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Rif
                    </Label>
                    {/* <Input {...form.register('rif')} /> */}
                    <InputSelect value={form.getValues().rif} onChange={setValueInput} name='rif' label='' options={rifOptions} max={11} type='number'></InputSelect>
                </div>
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Dirección
                    </Label>
                    <Input {...form.register('address')} />
                </div>

                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label className="text-right">
                        Teléfono
                    </Label>
                    <InputSelect value={form.getValues().phone} onChange={setValueInput} name='phone' label='' options={phoneOptions} max={7} type='number'></InputSelect>
                </div>

                <FormSelect form={form} name='zone' label='Zona' placeholder='Seleccione una zona' options={clientsZones}></FormSelect>
                <FormSelect form={form} name='blockId' label='Bloque' placeholder='Seleccione un bloque' options={blocks}></FormSelect>

                <Button type='submit'>Enviar</Button>
            </form>
        </Form>
    )
}
