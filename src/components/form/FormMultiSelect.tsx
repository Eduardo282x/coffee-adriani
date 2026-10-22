/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react"
import { FormField, FormItem, FormLabel } from "../ui/form"
import { MultiSelect } from "../multiSelect/MultiSelect"

interface FormMultiSelectProps {
    form: any;
    label: string;
    placeholder: string;
    name: string;
    options: Array<{ label: string; value: string | number }>;
    emptyMessage?: string;
}

export const FormMultiSelect: FC<FormMultiSelectProps> = ({
    form,
    label,
    placeholder,
    name,
    options,
    emptyMessage,
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className='w-full'>
                    <FormLabel>{label}</FormLabel>
                    <MultiSelect
                        options={options.map((option) => ({ label: option.label, value: String(option.value) }))}
                        selected={Array.isArray(field.value) ? field.value.map(String) : []}
                        onChange={(values) => form.setValue(name, values, { shouldDirty: true, shouldValidate: true })}
                        placeholder={placeholder}
                        emptyMessage={emptyMessage}
                    />
                </FormItem>
            )}
        />
    )
}
