import { ScreenLoader } from '@/components/loaders/ScreenLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BaseResponse, BaseResponseLogin } from '@/services/base.interface';
import { postDataApi } from '@/services/base.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router';
import { z } from 'zod';
import logo from '@/assets/images/logo.jpg'

interface ILogin {
    username: string;
    password: string;
}
interface IRecover {
    username: string;
    password: string;
    confirmPassword: string;
}

const validationSchemaLogin = z.object({
    username: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
    password: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
})

const validationSchemaRecover = z.object({
    username: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
    password: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
    confirmPassword: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
});

export const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [recover, setRecover] = useState<boolean>(false);

    const formLogin = useForm<ILogin>({
        defaultValues: {
            username: '',
            password: ''
        },
        resolver: zodResolver(validationSchemaLogin)
    })

    const formRecover = useForm<IRecover>({
        defaultValues: {
            username: '',
            password: '',
            confirmPassword: ''
        },
        resolver: zodResolver(validationSchemaRecover)
    })

    const onSubmit = async (login: ILogin) => {
        setLoading(true);
        await postDataApi('/auth', login).then((res: BaseResponseLogin | BaseResponse) => {
            if (res.success) {
                const parseResponse = res as BaseResponseLogin;
                setTimeout(() => {
                    localStorage.setItem('token', parseResponse.token)
                    navigate('/')
                }, 1500);
            }
            setLoading(false);
        });
    }

    const onSubmitRecover = async (recover: IRecover) => {
        setLoading(true);
        const bodyRecovers = {
            username: recover.username,
            password: recover.password,
        }
        await postDataApi('/auth/recover', bodyRecovers).then((res: BaseResponse) => {
            if (res.success) {
                setRecover(false);
            }
            setLoading(false);
        });
        formRecover.reset();
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
                {!recover ?
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

                        <div className='w-full space-y-3' >
                            <Button type='submit' variant='primary' className='w-full bg-[#6f4e37] hover:bg-[#6f4e37]/80 text-white' >Iniciar sesión</Button>
                            <Button type='button' className='w-full' onClick={() => setRecover(true)}>Recuperar contraseña</Button>
                        </div>
                    </form>
                    :
                    <form onSubmit={formRecover.handleSubmit(onSubmitRecover)} className=" flex flex-wrap justify-start items-start gap-4 w-full ">
                        <div className="flex flex-col items-start justify-start gap-4 w-full">
                            <Label className="text-right">
                                Usuario
                            </Label>
                            <Input {...formRecover.register('username')} />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-4 w-full">
                            <Label className="text-right">
                                Contraseña
                            </Label>
                            <Input {...formRecover.register('password')} />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-4 w-full">
                            <Label className="text-right">
                                Confirmar Contraseña
                            </Label>
                            <Input {...formRecover.register('confirmPassword')} />
                        </div>

                        <div className='w-full space-y-3' >
                            <Button type='submit' variant='primary' className='w-full bg-[#6f4e37] hover:bg-[#6f4e37]/80 text-white'>Recuperar</Button>
                            <Button type='button' className='w-full' onClick={() => setRecover(false)}>Volver</Button>
                        </div>
                    </form>
                }
            </div>

        </div>
    )
}
