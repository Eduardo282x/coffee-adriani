import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from "@/components/ui/calendar"
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
// import { addDays, format } from 'date-fns';
import { Label } from '../ui/label';
import { FC, useEffect, useState } from 'react';
// import { es } from 'date-fns/locale';
import { es } from "react-day-picker/locale";
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface DateRangePickerProps {
    datePicker: DateRange | undefined;
    setDatePicker: (date: DateRange | undefined) => void;
    label: string;
    btnWidth?: string;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({ datePicker, setDatePicker, label, btnWidth }) => {
    const [date, setDate] = useState<DateRange | undefined>(datePicker)
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setDatePicker(date as DateRange | undefined)
    }, [date])

    return (
        <div>
            <Label className="mb-2">
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-48 overflow-hidden justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            btnWidth
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                                    {format(date.to, "LLL dd, y", { locale: es })}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y", { locale: es })
                            )
                        ) : (
                            <span>Selecciona una fecha</span>
                        )}
                        {/* {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>} */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        locale={es}
                        selected={date}
                        onSelect={setDate}
                        defaultMonth={date?.from}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
