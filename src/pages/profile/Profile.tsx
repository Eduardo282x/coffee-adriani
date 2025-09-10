import { ToolTip } from '@/components/tooltip/ToolTip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarTrigger } from '@/components/ui/sidebar'
import { validateToken } from '@/hooks/authtenticate';
import { ITokenExp } from '@/interfaces/user.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, User2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CiLock } from "react-icons/ci";
import { FaRegSave } from 'react-icons/fa';
import { z } from 'zod';

interface InfoUser {
    username: string;
    name: string;
    lastName: string;
}

interface PasswordUser {
    password: string;
    confirmPassword: string;
}

const validationSchemaPassword = z.object({
    password: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
    confirmPassword: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
});


export const Profile = () => {
    const [edit, setEdit] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false);

    const formUser = useForm<InfoUser>({
        defaultValues: {
            username: '',
            name: '',
            lastName: ''
        }
    });

    const formPassword = useForm<PasswordUser>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        resolver: zodResolver(validationSchemaPassword)
    });

    const onSubmitInfo = (data: InfoUser) => {
        console.log(data);
    }

    const onSubmitPassword = (data: PasswordUser) => {
        console.log(data);
    }

    useEffect(() => {
        if (!edit) {
            resetValues();
        }
    }, [edit]);

    const resetValues = () => {
        const getTokenDecode: ITokenExp = validateToken() as ITokenExp;
        formUser.reset({
            username: getTokenDecode.username,
            name: getTokenDecode.name,
            lastName: getTokenDecode.lastName,
        })
    }

    return (
        <div>
            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Mi Perfil</h1>
                </div>
            </header>


            <main className='w-full p-4'>
                <div className={`bg-white mt-4 shadow-xl rounded-2xl mx-auto w-1/2 p-4 ${changePassword ? 'h-[35rem]' : 'h-92'} interpolate duration-300 ease-in-out transition-all`}>
                    <p className='text-xl font-semibold text-[#6f4e37]'>Mi perfil</p>
                    <form id='info-form' onSubmit={formUser.handleSubmit(onSubmitInfo)} className=" space-y-2 relative">
                        <ToolTip tooltip='Editar perfil' position='left' className='absolute top-2 right-2'>
                            <Button size='icon' onClick={() => setEdit(!edit)} ><Edit /></Button>
                        </ToolTip>
                        <User2 size={60} className='mx-auto bg-gray-100 rounded-full p-1' />
                        <Label>Nombre</Label>
                        <Input {...formUser.register('name')} autoComplete='off' disabled={!edit} />
                        <Label>Apellido</Label>
                        <Input {...formUser.register('lastName')} autoComplete='off' disabled={!edit} />
                        <Label>Usuario</Label>
                        <Input {...formUser.register('username')} autoComplete='off' disabled={!edit} />
                    </form>
                    <div className="flex items-center justify-between my-2">
                        <Button type='button' onClick={() => setChangePassword(!changePassword)}>
                            <CiLock />Cambiar contraseña
                        </Button>
                        <Button type='submit' variant='primary' form='info-form' onClick={() => setChangePassword(!changePassword)}>
                            <FaRegSave />Guardar
                        </Button>
                    </div>

                    {changePassword && (
                        <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className='space-y-2'>
                            <Label>Nueva Contraseña</Label>
                            <Input {...formPassword.register('password')} autoComplete='off' />
                            <Label>Confirmar Contraseña</Label>
                            <Input {...formPassword.register('confirmPassword')} autoComplete='off' />
                            <div className='flex justify-end'>
                                <Button type='submit' variant='primary'>
                                    <CiLock />Actualizar contraseña
                                </Button>
                            </div>
                        </form>
                    )}

                </div>

            </main>
        </div>
    )
}
