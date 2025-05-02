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

interface ILogin {
    username: string;
    password: string;
}

const validationSchema = z.object({
    username: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
    password: z.string().refine(text => text !== '', { message: 'Este campo es requerido.' }),
})

export const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { register, handleSubmit } = useForm<ILogin>({
        defaultValues: {
            username: '',
            password: ''
        },
        resolver: zodResolver(validationSchema)
    })

    const onSubmit = async (login: ILogin) => {
        setLoading(true);
        await postDataApi('/auth', login).then((res: BaseResponseLogin | BaseResponse) => {
            if (res.success) {
                const parseResponse = res as BaseResponseLogin;
                setLoading(false);
                setTimeout(() => {
                    localStorage.setItem('token', parseResponse.token)
                    navigate('/')
                }, 1500);
            }
        })
    }

    return (
        <div className='h-full w-full bg-[#d2b082] flex items-center justify-center'>

            {loading && (
                <ScreenLoader/>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex flex-wrap justify-start items-start gap-4 w-1/4 border rounded-lg p-4">
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Usuario
                    </Label>
                    <Input {...register('username')} />
                </div>
                <div className="flex flex-col items-start justify-start gap-4 w-full">
                    <Label className="text-right">
                        Contraseña
                    </Label>
                    <div className='w-full border border-input file:border-0 rounded-md flex items-center justify-between p-2'>
                        <input type={showPassword ? 'text' : 'password'} className='outline-none' {...register('password')} />
                        <span className='text-xs cursor-pointer ' onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Eye /> : <EyeOff />}</span>
                    </div>
                </div>

                <div className='w-full flex items-center justify-center'>
                    <Button type='submit' className='w-40' >Iniciar sesión</Button>
                </div>
            </form>

        </div>
    )
}
