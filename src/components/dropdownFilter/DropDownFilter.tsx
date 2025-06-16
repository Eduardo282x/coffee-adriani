import { FC, useState } from "react";
import { Button } from "../ui/button";
import { FaFilter } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface DropDownFilterProps {
    contentMenu: React.ReactNode;
}

export const DropDownFilter: FC<DropDownFilterProps> = ({ contentMenu }) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <DropdownMenu modal={true} open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger className="cursor-pointer">
                    <Button
                        className='bg-[#6f4e37] hover:bg-[#7c5a43] text-white mt-6'
                    >
                        <FaFilter />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" className="mr-6" onSelect={(e) => e.preventDefault()}>
                    {open && (
                        contentMenu
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
