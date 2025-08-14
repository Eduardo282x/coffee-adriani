import { FC, useState } from "react";
import { Button } from "../ui/button";
import { FaFilter } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface DropDownFilterProps {
    children: React.ReactNode;
    customIcon?: React.ComponentType
}

export const DropDownFilter: FC<DropDownFilterProps> = ({ children, customIcon: CustomIcon }) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <DropdownMenu modal={true} open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger className="cursor-pointer">
                    <Button
                        className='bg-[#6f4e37] hover:bg-[#7c5a43] text-white mt-6'
                    >
                        {CustomIcon ? <CustomIcon/> : <FaFilter />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" className="mr-6" onSelect={(e) => e.preventDefault()}>
                    {open && (
                        children
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
