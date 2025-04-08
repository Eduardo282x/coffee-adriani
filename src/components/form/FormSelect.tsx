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
}

export const FormSelect: FC<FormSelectProps> = ({ form, label, placeholder, name, options }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel>{label}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()} defaultValue={field.value.toString()}>
                        <FormControl className='w-full'>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className='w-full'>
                            {options && options.map((opt: IOptions, index: number) => (
                                <SelectItem key={index} value={opt.value.toString()}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    )
}
