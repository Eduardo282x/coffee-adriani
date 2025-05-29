import { Check, ChevronsUpDown } from "lucide-react"
import { IOptions } from "@/interfaces/form.interface";
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface AutoCompleteProps {
    data: IOptions[];
    placeholder: string;
    onChange: (value: string) => void;
    valueDefault?: string | number;
    resetValues?: boolean
}

export const Autocomplete: FC<AutoCompleteProps> = ({ data, placeholder, onChange, valueDefault, resetValues }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string | number>(valueDefault ? valueDefault : "");
    const [inputValue, setInputValue] = useState<string>("");
    const [dataFiltered, setDataFiltered] = useState<IOptions[]>(data);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setValue(valueDefault ? valueDefault.toString() : "");
    }, [valueDefault])

    const handleSelect = (currentValue: string) => {
        setValue(currentValue);
        onChange(currentValue);

        if(resetValues){
            setValue('')
        }
        setOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        setInputValue('')
        setDataFiltered(data);
    }, [open])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        const filteredData = data.filter((option) =>
            normalize(option.label).includes(normalize(e.target.value))
        );
        setDataFiltered(filteredData);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const selectedOption = dataFiltered[0];
            if (selectedOption) {
                handleSelect(selectedOption.value.toString());
            }
        }
    }

    return (
        <div className="relative w-80 max-w-80 " ref={ref}>
            <Button
                variant="outline"
                className="w-full justify-between overflow-hidden"
                onClick={() => setOpen(!open)}
            >
                {value
                    ? data.find((option) => option.value.toString() === value)?.label
                    : placeholder}
                <ChevronsUpDown className="absolute top-3 right-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="border rounded-lg overflow-hidden absolute animationOpacity z-20 mt-1 bg-white">
                    <input
                        autoFocus
                        placeholder={placeholder}
                        className="px-2 py-1 rounded-none border-b-2 outline-none w-full"
                        value={inputValue}
                        onChange={onChangeInput}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="max-h-60 overflow-y-auto px-2 w-80 max-w-80">
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