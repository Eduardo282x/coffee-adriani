import { ScreenLoader } from '@/components/loaders/ScreenLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { extractAuthError, login } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router';
import { z } from 'zod';
import logo from '@/assets/images/logo.jpg'
import { Snackbar } from '@/components/snackbar/Snackbar';
import toast from 'react-hot-toast';

interface ILogin {
    username: string;
    password: string;
}

const validationSchemaLogin = z.object({
    username: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
    password: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
})

export const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const formLogin = useForm<ILogin>({
        defaultValues: {
            username: '',
            password: ''
        },
        resolver: zodResolver(validationSchemaLogin)
    })

    const onSubmit = async (credentials: ILogin) => {
        if (loading) return;
        setLoading(true);

        try {
            await login({
                username: credentials.username.trim(),
                password: credentials.password,
            });
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            // El login está limitado a 5/min por IP: se muestra el error en lugar de reintentar.
            toast.custom(<Snackbar success={false} message={extractAuthError(error)} />, {
                duration: 3000,
                position: 'bottom-center'
            });
            setLoading(false);
        }
    }

    return (
        <div className='h-full w-full bg-[#d2b082] flex items-center justify-center'>

            {loading && (
                <ScreenLoader />
            )}

            <div className='bg-white border rounded-lg p-4 w-[90%] lg:w-1/4'>
                <div className='w-full flex items-center justify-center mb-2'>
                    <img src={logo} alt="" className='w-20 h-20 rounded-full' />
                </div>
                <p className='text-center text-2xl font-semibold  text-[#6f4e37]'>Iniciar sesión</p>
                <p className='text-sm text-gray-400 text-center mb-2'>Ingresa tus credenciales para acceder</p>

                <form onSubmit={formLogin.handleSubmit(onSubmit)} className=" flex flex-wrap justify-start items-start gap-4 w-full ">
                    <div className="flex flex-col items-start justify-start gap-4 w-full">
                        <Label className="text-right">
                            Usuario
                        </Label>
                        <Input {...formLogin.register('username')} />
                    </div>
                    <div className="flex flex-col items-start justify-start gap-4 w-full">
                        <Label className="text-right">
                            Contraseña
                        </Label>
                        <div className='w-full border border-input file:border-0 rounded-md flex items-center justify-between p-2'>
                            <input type={showPassword ? 'text' : 'password'} className='outline-none' {...formLogin.register('password')} />
                            <span className='text-xs cursor-pointer ' onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye /> : <EyeOff />}</span>
                        </div>
                    </div>

                    <div className="w-full space-y-3" >
                        <Button
                            type='submit'
                            variant='primary'
                            disabled={loading}
                            className='w-full bg-[#6f4e37] hover:bg-[#6f4e37]/80 text-white disabled:opacity-60'
                        >
                            Iniciar sesión
                        </Button>
                    </div>
                </form>

                <p className='text-xs text-gray-400 text-center mt-4'>
                    Si olvidaste tu contraseña, un Administrador debe restablecerla desde su perfil.
                </p>
            </div>

        </div>
    )
}
