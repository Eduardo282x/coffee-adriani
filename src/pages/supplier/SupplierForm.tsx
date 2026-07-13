import { Input } from '@/components/ui/input';
import { FromProps } from '@/interfaces/form.interface';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BodySupplier } from '@/interfaces/supplier.interface';
import { Form } from '@/components/ui/form';

export const SupplierForm: FC<FromProps> = ({ onSubmit, data }) => {
    const form = useForm<BodySupplier>({
        defaultValues: {
            name: '',
            rif: '',
            phone: '',
            address: '',
            email: '',
            rubro: '',
        },
    });

    useEffect(() => {
        if (data) {
            setTimeout(() => {
                form.reset({
                    name: data.name ?? '',
                    rif: data.rif ?? '',
                    phone: data.phone ?? '',
                    address: data.address ?? '',
                    email: data.email ?? '',
                    rubro: data.rubro ?? '',
                });
            }, 0);
        }
    }, [data, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 w-full py-4">
                <div className="space-y-4 w-full">
                    <Label className="text-right">Nombre</Label>
                    <Input className="w-full" {...form.register('name', { required: 'El nombre es requerido' })} />
                </div>

                <div className="space-y-4 w-full">
                    <Label className="text-right">RIF</Label>
                    <Input className="w-full" {...form.register('rif', { required: 'El RIF es requerido' })} />
                </div>

                <div className="space-y-4 w-full">
                    <Label className="text-right">Teléfono</Label>
                    <Input className="w-full" {...form.register('phone', { required: 'El teléfono es requerido' })} />
                </div>

                {/* <div className="space-y-4 w-full">
                    <Label className="text-right">Email</Label>
                    <Input type="email" className="w-full" {...form.register('email', { required: 'El email es requerido' })} />
                </div> */}

                <div className="space-y-4 w-full">
                    <Label className="text-right">Rubro</Label>
                    <Input className="w-full" {...form.register('rubro', { required: 'El rubro es requerido' })} />
                </div>

                <div className="col-span-2 space-y-4 w-full">
                    <Label className="text-right">Dirección</Label>
                    <Input className="w-full" {...form.register('address', { required: 'La dirección es requerida' })} />
                </div>

                <div className="col-span-2">
                    <div className="w-full flex items-center justify-center">
                        <Button type="submit" variant="primary" className="w-40">Enviar</Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
