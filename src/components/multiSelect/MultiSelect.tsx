import { FC, useMemo, useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
    label: string
    value: string
}

interface MultiSelectProps {
    options: MultiSelectOption[]
    selected: string[]
    onChange: (values: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    className?: string
    disabled?: boolean
}

export const MultiSelect: FC<MultiSelectProps> = ({
    options,
    selected,
    onChange,
    placeholder = 'Seleccione una opción',
    searchPlaceholder = 'Buscar...',
    emptyMessage = 'Sin opciones',
    className,
    disabled = false,
}) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const selectedSet = useMemo(() => new Set(selected), [selected])

    const filteredOptions = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()
        if (!normalizedSearch) return options

        return options.filter((option) =>
            option.label.toLowerCase().includes(normalizedSearch)
        )
    }, [options, search])

    const selectedLabels = useMemo(
        () => options.filter((option) => selectedSet.has(option.value)).map((option) => option.label),
        [options, selectedSet]
    )

    const triggerLabel = selectedLabels.length === 0
        ? placeholder
        : selectedLabels.length === 1
            ? selectedLabels[0]
            : `${selectedLabels.length} seleccionados`

    const toggleOption = (value: string) => {
        if (selectedSet.has(value)) {
            onChange(selected.filter((selectedValue) => selectedValue !== value))
            return
        }

        onChange([...selected, value])
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn('w-full justify-between font-normal', className)}
                >
                    <span className="truncate">{triggerLabel}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2" align="start">
                <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={searchPlaceholder}
                        className="pl-8"
                    />
                </div>

                <div className="max-h-64 overflow-y-auto">
                    {filteredOptions.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">{emptyMessage}</p>
                    )}

                    {filteredOptions.map((option) => {
                        const isSelected = selectedSet.has(option.value)
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => toggleOption(option.value)}
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                            >
                                <span
                                    className={cn(
                                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border',
                                        isSelected
                                            ? 'border-[#6f4e37] bg-[#6f4e37] text-white'
                                            : 'border-gray-300'
                                    )}
                                >
                                    {isSelected && <Check className="h-3 w-3" />}
                                </span>
                                <span className="truncate">{option.label}</span>
                            </button>
                        )
                    })}
                </div>

                {selected.length > 0 && (
                    <div className="mt-2 border-t pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => onChange([])}
                        >
                            Limpiar selección
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
