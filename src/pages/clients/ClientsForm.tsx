import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { clientsZones, defaultValues, IClientsForm, phoneOptions, rifOptions, TypesClientsForm } from './client.data'
import { FC, useEffect, useState } from 'react'
import { Block } from '@/interfaces/clients.interface'
import { getBlocks } from '@/services/clients.service'
import { InputSelect } from '@/components/form/InputSelect'
import { Form } from '@/components/ui/form'
import { FormSelect } from '@/components/form/FormSelect'
import { IOptions } from '@/interfaces/form.interface'
import { Button } from '@/components/ui/button'

interface ClientFromProps {
    data: IClientsForm;
    onSubmit: (data: IClientsForm) => void;
}

export const ClientsForm: FC<ClientFromProps> = ({ data, onSubmit }) => {
    const [blocks, setBlocks] = useState<IOptions[]>([]);

    useEffect(() => {
        getBlocksApi()
    }, [])

    const getBlocksApi = async () => {
        const response: Block[] = await getBlocks();
        const blockOptions = response.map(blo => {
            return {
                label: blo.name,
                value: blo.id.toString()
            }
        })
        setBlocks(blockOptions);
    }

    const form = useForm<IClientsForm>({
        defaultValues
    })

    useEffect(() => {
        if (data) {
            const findZone = data.zone !== '' ? clientsZones.find(zone => zone.label.toLowerCase().includes(data.zone.toLowerCase())) : ''
            const parseBodyData: IClientsForm = {
                name: data.name,
                rif: data.rif,
                address: data.address,
                phone: data.phone,
                zone: findZone ? findZone.value.toString() : '',
                blockId: data.blockId.toString(),
            }
            form.reset(parseBodyData)
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
                        Name
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
