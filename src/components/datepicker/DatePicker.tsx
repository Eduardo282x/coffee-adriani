import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Label } from '../ui/label';
import { FC, useEffect, useState } from 'react';
import { es } from 'date-fns/locale';

interface DatePickerProps {
    setDatePicker: (date: Date) => void;
    label: string;
}

export const DatePicker: FC<DatePickerProps> = ({ setDatePicker, label }) => {
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        setDatePicker(date as Date)
    }, [date])

    return (
        <div>
            <Label className="mb-2">
                {label}
            </Label>
            <Popover modal={true}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP", {locale: es}) : <span>Selecciona una fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        locale={es}
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        fromDate={new Date()}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
