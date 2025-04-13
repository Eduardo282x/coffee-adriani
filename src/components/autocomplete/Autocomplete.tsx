import { Check, ChevronsUpDown } from "lucide-react"
import { IOptions } from "@/interfaces/form.interface";
import { FC, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface AutoCompleteProps {
    data: IOptions[];
    placeholder: string;
    onChange?: (value: string) => void;
}

export const Autocomplete: FC<AutoCompleteProps> = ({ data, placeholder, onChange }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string | number>("")

    const handleSelect = (currentValue: string) => {
        const selectedValue = currentValue === value ? "" : currentValue;
        setValue(selectedValue);
        onChange?.(selectedValue);
        setOpen(false);
    };

    return (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? data.find((option) => option.value.toString() === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full p-0"
                onInteractOutside={(e) => e.preventDefault()} // Evita que se cierre el Dialog
            >
                <Command>
                    <CommandInput placeholder={placeholder} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                            {data.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label} // habilita búsqueda
                                    onSelect={() => handleSelect(option.value.toString())}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === option.value.toString() ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}