import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from "@/components/ui/calendar"
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
// import { addDays, format } from 'date-fns';
import { Label } from '../ui/label';
import { FC, useState } from 'react';
// import { es } from 'date-fns/locale';
import { es } from "react-day-picker/locale";
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface DateRangePickerProps {
    datePicker: DateRange | undefined;
    setDatePicker: (date: DateRange | undefined) => void;
    label: string;
    btnWidth?: string;
    toDate?: Date;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({ datePicker, setDatePicker, label, btnWidth, toDate }) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            {label !== '' && (
                <Label className="mb-2">
                {label}
            </Label>
            )}
            <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-48 overflow-hidden justify-start text-left font-normal",
                            !datePicker && "text-muted-foreground",
                            btnWidth
                        )}
                    >
                        <CalendarIcon />
                        {datePicker?.from ? (
                            datePicker.to ? (
                                <>
                                    {format(datePicker.from, "LLL dd, y", { locale: es })} -{" "}
                                    {format(datePicker.to, "LLL dd, y", { locale: es })}
                                </>
                            ) : (
                                format(datePicker.from, "LLL dd, y", { locale: es })
                            )
                        ) : (
                            <span>Selecciona una fecha</span>
                        )}
                        {/* {datePicker ? format(datePicker, "PPP", { locale: es }) : <span>Selecciona una fecha</span>} */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        locale={es}
                        selected={datePicker}
                        onSelect={setDatePicker}
                        defaultMonth={datePicker?.from}
                        captionLayout="dropdown"
                        toDate={toDate}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
