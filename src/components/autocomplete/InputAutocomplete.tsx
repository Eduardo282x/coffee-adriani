import { Check } from "lucide-react"
import { IOptions } from "@/interfaces/form.interface";
import { FC, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

interface InputAutocomplete {
    data: IOptions[];
    placeholder: string;
    onChange: (value: string) => void;
    valueDefault?: string | number;
    fullSize?: boolean;
}

export const InputAutocomplete: FC<InputAutocomplete> = ({ data, onChange, valueDefault, fullSize }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string | number>(valueDefault ? valueDefault : "");
    const [dataFiltered, setDataFiltered] = useState<IOptions[]>(data);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setValue(valueDefault ? valueDefault.toString() : "");
    }, [valueDefault])

    const handleSelect = (currentValue: string) => {
        setValue(currentValue);
        onChange(currentValue);
        setOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };
    useEffect(() => {
        setOpen(dataFiltered.length > 0)
    }, [dataFiltered])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const getInputValue = e.target.value
        onChange(getInputValue);
        setValue(getInputValue);
        const filteredData = data.filter((option) =>
            normalize(option.label).includes(normalize(getInputValue))
        );
        setDataFiltered(filteredData);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            const selectedOption = dataFiltered[0];
            if (selectedOption) {
                handleSelect(selectedOption.value.toString());
            }
        }
    }

    return (
        <div className={`relative ${fullSize ? 'w-full' : 'w-80 max-w-80'}`} ref={ref}>
            <Input
                onChange={onChangeInput}
                onKeyDown={handleKeyDown}
                value={value}
            />

            {open && (
                <div className="border rounded-lg overflow-hidden absolute w-full animationOpacity z-20 mt-1 bg-white">
                    <div className={`max-h-60 overflow-y-auto px-2 ${fullSize ? 'w-full' : 'w-80 max-w-80'}`}>
                        {dataFiltered && dataFiltered.map((option: IOptions, index: number) => (
                            <p
                                key={index}
                                onClick={() => handleSelect(option.value.toString())}
                                className="text-sm flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded-md transition-all cursor-pointer">
                                {option.label}
                                {option.value.toString() === value && (
                                    <Check className="ml-auto h-4 w-4" />
                                )}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}