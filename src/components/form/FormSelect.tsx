/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormLabel, FormControl } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FC } from "react";
import { IOptions } from "@/interfaces/form.interface";

interface FormSelectProps {
    form: any;
    label: string;
    placeholder: string;
    name: string;
    options: IOptions[];
    // El backend tiene enableImplicitConversion: false, así que un campo numérico
    // enviado como string ("5") falla la validación. Con `coerce="number"` se envía 5.
    coerce?: 'number';
}

export const FormSelect: FC<FormSelectProps> = ({ form, label, placeholder, name, options, coerce }) => {
    const handleValueChange = (value: string) => {
        form.setValue(name, coerce === 'number' ? Number(value) : value, { shouldDirty: true, shouldValidate: true });
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={handleValueChange}
                        value={field.value?.toString() ?? ''}
                        defaultValue={field.value?.toString() ?? ''}
                    >
                        <FormControl className='w-full'>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className='w-full'>
                            {options && options.map((opt: IOptions, index: number) => (
                                <SelectItem 
                                key={`${opt.value}-${index}`} 
                                value={opt.value.toString()}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    )
}
