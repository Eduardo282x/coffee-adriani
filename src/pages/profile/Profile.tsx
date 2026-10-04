import { ToolTip } from '@/components/tooltip/ToolTip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarTrigger } from '@/components/ui/sidebar'
import { decodeToken } from '@/hooks/authtenticate';
import { ITokenExp } from '@/interfaces/user.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, User2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CiLock } from "react-icons/ci";
import { FaRegSave } from "react-icons/fa";
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Snackbar } from '@/components/snackbar/Snackbar';
import { extractAuthError, recoverPassword } from '@/services/auth.service';

interface InfoUser {
    username: string;
    name: string;
    lastName: string;
}

interface PasswordUser {
    currentPassword: string;
    password: string;
    confirmPassword: string;
}

const ADMIN_ROLE = 'Administrador';

const validationSchemaPassword = z.object({
    currentPassword: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
    password: z.string().min(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' }),
    confirmPassword: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
});


export const Profile = () => {
    const [edit, setEdit] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false);
    const [savingPassword, setSavingPassword] = useState<boolean>(false);

    const formUser = useForm<InfoUser>({
        defaultValues: {
            username: '',
            name: '',
            lastName: ''
        }
    });
    const { reset } = formUser

    const formPassword = useForm<PasswordUser>({
        defaultValues: {
            currentPassword: '',
            password: '',
            confirmPassword: '',
        },
        resolver: zodResolver(validationSchemaPassword)
    });

    const tokenData = decodeToken();
    const canRecoverPassword = tokenData?.rol === ADMIN_ROLE;

    const onSubmitInfo = () => { }

    const onSubmitPassword = async (data: PasswordUser) => {
        if (savingPassword || !tokenData) return;
        setSavingPassword(true);

        try {
            const response = await recoverPassword({
                username: tokenData.username,
                password: data.password,
                currentPassword: data.currentPassword,
            });

            toast.custom(<Snackbar success={response.success} message={response.message} />, {
                duration: 3000,
                position: 'bottom-center'
            });

            if (response.success) {
                formPassword.reset();
                setChangePassword(false);
            }
        } catch (error) {
            toast.custom(<Snackbar success={false} message={extractAuthError(error)} />, {
                duration: 3000,
                position: 'bottom-center'
            });
        } finally {
            setSavingPassword(false);
        }
    }

    useEffect(() => {
        if (edit) return;

        const decoded: ITokenExp | null = decodeToken();
        if (!decoded) return;
        reset({
            username: decoded.username,
            name: decoded.name,
            lastName: decoded.lastName,
        })
    }, [edit, reset]);

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
                            <Button size='icon' type='button' onClick={() => setEdit(!edit)} ><Edit /></Button>
                        </ToolTip>
                        <User2 size={60} className='mx-auto bg-gray-100 rounded-full p-1' />
                        <Label>Nombre</Label>
                        <Input {...formUser.register('name')} autoComplete='off' disabled={!edit} />
                        <Label>Apellido</Label>
                        <Input {...formUser.register('lastName')} autoComplete='off' disabled={!edit} />
                        <Label>Usuario</Label>
                        <Input {...formUser.register('username')} autoComplete='off' disabled={!edit} />
                    </form>
                    {canRecoverPassword && (
                        <div className="flex items-center justify-between my-2">
                            <Button type='button' onClick={() => setChangePassword(!changePassword)}>
                                <CiLock />Cambiar contraseña
                            </Button>
                            <Button type='submit' variant='primary' form='info-form' onClick={() => setChangePassword(!changePassword)}>
                                <FaRegSave />Guardar
                            </Button>
                        </div>
                    )}

                    {changePassword && (
                        <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className='space-y-2'>
                            <Label>Contraseña actual</Label>
                            <Input type='password' {...formPassword.register('currentPassword')} autoComplete='off' />
                            <Label>Nueva Contraseña</Label>
                            <Input type='password' {...formPassword.register('password')} autoComplete='off' />
                            <Label>Confirmar Contraseña</Label>
                            <Input type='password' {...formPassword.register('confirmPassword')} autoComplete='off' />
                            <div className='flex justify-end'>
                                <Button type='submit' variant='primary' disabled={savingPassword} className='disabled:opacity-60'>
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
