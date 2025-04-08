/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { IColumns } from "./table.interface";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { debounce } from "@/lib/debounce";

interface IFilter {
    dataBase: any[];
    setDataFilter: (value: any) => void;
    columns: IColumns<any>[];
}

export const Filter: FC<IFilter> = ({ dataBase, setDataFilter, columns }) => {
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        setDataFilter(dataBase)
    }, [dataBase])

    const getNestedValue = (obj: any, path: string): string => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj)?.toString().toLowerCase() || ''
    }

    const handleFilter = (value: string) => {
        if (!value) {
            setDataFilter(dataBase)
            return
        }

        const keys = columns
            .filter((col: IColumns<unknown>) => col.icon === false)
            .map((col: IColumns<unknown>) => col.column)

        const filtered = dataBase.filter((item) =>
            keys.some((key) => getNestedValue(item, key).includes(value.toLowerCase()))
        )

        setDataFilter(filtered)
    }

    const debouncedFilter = debounce(handleFilter, 200)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFilter(value)
        debouncedFilter(value)
    }

    return (
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Buscar..."
                className="pl-8"
                value={filter}
                onChange={onChange}
            />
        </div>
    )
}
