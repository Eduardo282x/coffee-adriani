import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaFilter } from "react-icons/fa";
import { IColumns } from "./table.interface";

interface DropdownColumnFilterProps<T> {
    columns: IColumns<T>[];
    setColumns: (columns: IColumns<T>[]) => void
}

export const DropdownColumnFilter = <T,>({ columns, setColumns }: DropdownColumnFilterProps<T>) => {

    const changeChecked = (column: IColumns<T>, checked: boolean) => {
        const newColumns = columns.map(item => {
            return {
                ...item,
                visible: column.column === item.column ? checked : item.visible
            }
        })
        setColumns(newColumns)
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="outline"
                        className="bg-white text-[#6f4e37] border border-[#6f4e37] hover:bg-[#e6fafd] hover:text-[#6f4e37]"
                    >
                        <FaFilter />
                        Columnas
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {columns.filter(item => item.icon == false).map((column: IColumns<T>, index: number) => (
                        <DropdownMenuCheckboxItem
                            key={index}
                            className='capitalize hover:bg-gray-200'
                            checked={column.visible}
                            onCheckedChange={(checked) => changeChecked(column, checked)}
                            onSelect={(e) => e.preventDefault()}
                        >
                            {column.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}
