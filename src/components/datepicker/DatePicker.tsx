import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Label } from '../ui/label';
import { FC } from 'react';
// import { es } from 'date-fns/locale';
import { es } from "react-day-picker/locale";

interface DatePickerProps {
    setDate: (date: Date | undefined) => void;
    label: string;
    maxDate: Date | undefined;
    minDate: Date | undefined;
    date: Date | undefined
}

export const DatePicker: FC<DatePickerProps> = ({ date, setDate, label, maxDate, minDate }) => {
    return (
        <div className='w-full'>
            <Label className="mb-2">
                {label}
            </Label>
            <Popover modal={true}>
                <PopoverTrigger asChild className='w-full'>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                        className='w-full'
                        locale={es}
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        captionLayout="dropdown"
                        startMonth={minDate}
                        endMonth={maxDate}
                        hidden={[{ before: new Date(minDate as Date), after: new Date(maxDate as Date) }]}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
