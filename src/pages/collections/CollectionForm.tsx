import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CollectionMessageBody } from '@/interfaces/collection.interface'
import { FromProps } from '@/interfaces/form.interface'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form';


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export const CollectionForm: FC<FromProps> = ({ data, onSubmit }) => {
    const { register, handleSubmit, reset } = useForm<CollectionMessageBody>({
        defaultValues: {
            title: '',
            content: ''
        },
    })

    useEffect(() => {
        if (data) {
            reset({
                title: data.title,
                content: data.content
            })
        }
    }, [data])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap justify-start items-start gap-4 w-full  py-4">
            <div className="flex flex-col items-start justify-start gap-4 w-full">
                <Label className="text-right">
                    Titulo
                </Label>
                <Input
                    type='text'
                    {...register('title')}
                    placeholder="Título del mensaje"
                />
            </div>
            <div className="flex flex-col items-start justify-start gap-4 w-full">
                <Label className="text-right">
                    Mensaje
                </Label>
                <textarea
                    className="whitespace-pre-wrap break-words w-full h-40 border px-3 py-2 rounded resize-y"
                    {...register('content')}
                    placeholder="Escribe el mensaje aquí..."
                />
            </div>
            <div className='w-full flex items-center justify-center'>
                <Button type='submit' className='w-40' >Enviar</Button>
            </div>
        </form>
    )
}

interface DeleteMessageFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onDelete: (action: boolean) => void;
}

export const DeleteMessageForm = ({ open, setOpen, onDelete }: DeleteMessageFormProps) => {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent >
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Mensaje</AlertDialogTitle>
                    <AlertDialogDescription>
                        Estas seguro que desea eliminar este mensaje?. Esta acción no se podrá deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-200 hover:bg-gray-100 text-black" onClick={() => onDelete(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-800 hover:bg-red-700 text-white" onClick={() => onDelete(true)} >Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}