import { FC, useEffect, useState } from "react";
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IOptions } from "@/interfaces/form.interface";

type InputType = 'text' | 'number';

interface InputSelectProps {
    placeholder?: string;
    label: string;
    name: string;
    options: IOptions[];
    max: number;
    type: InputType;
    onChange: (name: string, value: string) => void;

    value: string;
}

export const InputSelect: FC<InputSelectProps> = ({ label, options, max, type, name, value, onChange }) => {
    const [optionSelected, setOptionSelected] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');

    const changeInput = (input: string) => {
        if (type === 'number') {
            const regex = /^[0-9]*$/;
            if (!regex.test(input)) return;
        } else if (type === 'text') {
            const regex = /^[a-zA-Z0-9\s]*$/;
            if (!regex.test(input)) return;
        }

        // Solo asigna si cumple regex
        if (input.length <= (max || 999)) {
            setInputValue(input);
        }
    };

    useEffect(() => {
        onChange(name, `${optionSelected}${inputValue}`);
    }, [optionSelected, inputValue]);

    useEffect(() => {
        if (value) {
            const split = name === 'phone' ? 4 : 1;
            const prefix = value.slice(0, split).toString();
            const input = value.slice(split).toString();
            setTimeout(() => {
                setOptionSelected(prefix);
                setInputValue(input);
            }, 0);
        }
    }, [value]);

    return (
        <div className="flex items-center justify-center gap-2 w-full">
            <Select onValueChange={setOptionSelected} value={optionSelected}>
                <SelectTrigger className="w-[40%]">
                    <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {options.map((option: IOptions, index: number) => (
                            <SelectItem key={index} value={option.value.toString()}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Input
                type="text"
                inputMode={type === 'number' ? 'numeric' : 'text'}
                pattern={type === 'number' ? '[0-9]*' : undefined}
                value={inputValue}
                onChange={(e) => changeInput(e.target.value)}
                className="w-full"
                maxLength={max}
            />
        </div>
    )
}
