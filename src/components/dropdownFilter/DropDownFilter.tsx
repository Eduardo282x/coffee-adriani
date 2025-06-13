import { FC} from "react";
import { Button } from "../ui/button";
import { FaFilter } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface DropDownFilterProps {
    contentMenu: React.ReactNode;
}

export const DropDownFilter: FC<DropDownFilterProps> = ({ contentMenu }) => {
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                    <Button
                        className='bg-[#6f4e37] hover:bg-[#7c5a43] text-white mt-6'
                    >
                        <FaFilter />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" className="mr-6" onSelect={(e) => e.preventDefault()}>
                        {contentMenu}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
