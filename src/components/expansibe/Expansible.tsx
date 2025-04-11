import { FC, useState } from "react"
import { IoIosArrowDown } from "react-icons/io";

interface ExpansibleProps {
    text: string;
    text2: string;
}

export const Expansible: FC<ExpansibleProps> = ({ text, text2 }) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className={`w-full ${open ? 'h-20' : 'h-10'} overflow-hidden border rounded-lg px-4 py-2 ease-in-out delay-100 duration-150 transition-all`}>
            <div onClick={() => setOpen(!open)} className="w-full cursor-pointer flex items-center justify-between">
                <span>{text}</span>
                <span className="py-1"><IoIosArrowDown className={`ease-in-out delay-100 duration-150 transition-all text-xl ${!open ? ' rotate-0' : 'rotate-180'}`}/></span>
            </div>
            <div className="w-full">{text2}</div>
        </div>
    )
}
