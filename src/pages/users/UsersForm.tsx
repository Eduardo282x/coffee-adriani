import { Input } from '@/components/ui/input'
import { FromProps, IOptions } from '@/interfaces/form.interface'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSelect } from '@/components/form/FormSelect'
import { Form } from '@/components/ui/form'
import { getRoles } from '@/services/user.service'
import { BodyUsers, Roles } from '@/interfaces/user.interface'

const validationSchema = z.object({
    username: z.string(),
    name: z.string(),
    lastName: z.string(),
    rolId: z.coerce.number().positive().min(0),
})

export const UsersForm: FC<FromProps> = ({ data, onSubmit }) => {
    const [roles, setRoles] = useState<IOptions[]>([]);

    const form = useForm<BodyUsers>({
        defaultValues: {
            username: '',
            name: '',
            lastName: '',
            rolId: 0
        },
        resolver: zodResolver(validationSchema)
    })

    useEffect(() => {
        getRolesApi();
    }, [])

    useEffect(() => {
        if (data) {
            const parseBodyData: BodyUsers = {
                name: data.name,
                lastName: data.lastName,
                username: data.username,
                rolId: data.rolId,
            }
            form.reset(parseBodyData)
        }
    }, [data, roles])

    const getRolesApi = async () => {
        const response: Roles[] = await getRoles();
        if(response){
            const parseRoles = response.map(rol => {
                return {
                    label: rol.rol,
                    value: rol.id
                }
            })
            setRoles(parseRoles);
        }
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
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Apellido
                    </Label>
                    <Input type='text' {...form.register('lastName')} />
                </div>
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Usuario
                    </Label>
                    <Input type='text' {...form.register('username')} />
                </div>

                <FormSelect form={form} name='rolId' label='Rol' placeholder='Seleccione un rol' options={roles}></FormSelect>
                <div className='w-full flex items-center justify-center'>
                    <Button type='submit' variant='primary' className='w-40' >Enviar</Button>
                </div>
            </form>

        </Form>
    )
}
