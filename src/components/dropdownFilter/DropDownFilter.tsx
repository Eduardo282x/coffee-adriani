import { FC, useRef, useState } from "react";
import { Button } from "../ui/button";
import { FaFilter } from "react-icons/fa";

interface DropDownFilterProps {
    contentMenu: React.ReactNode;
}

export const DropDownFilter: FC<DropDownFilterProps> = ({ contentMenu }) => {
    const [open, setOpen] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (
    //             contentRef.current && !contentRef.current.contains(event.target as Node) && 
    //             triggerRef.current && !triggerRef.current.contains(event.target as Node)
    //         ) {
    //             setOpen(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);

    return (
        <div className="relative">
            <div ref={triggerRef}>
                <Button
                    onClick={() => setOpen(!open)}
                    className='bg-[#6f4e37] hover:bg-[#7c5a43] text-white mt-6'
                >
                    <FaFilter />
                </Button>
            </div>
            {open && (
                <div ref={contentRef} className="absolute bg-white rounded-md shadow-xl top-16 p-2 right-0 z-50">
                    {contentMenu}
                </div>
            )}
        </div>
    )
}
