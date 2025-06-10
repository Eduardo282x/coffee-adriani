/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { IColumns } from "./table.interface";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { debounce } from "@/lib/debounce";
import { InvoiceApi } from "@/interfaces/invoice.interface";

interface IFilter {
    dataBase: any[];
    setDataFilter: (value: any) => void;
    columns: IColumns<any>[];
    filterInvoices?: boolean;
}

export const Filter: FC<IFilter> = ({ dataBase, setDataFilter, columns, filterInvoices }) => {
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        setDataFilter(dataBase)
    }, [dataBase])

    const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

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
            keys.some((key) =>
                normalize(getNestedValue(item, key)).includes(normalize(value))
            )
        )

        setDataFilter(filtered);

        if (filterInvoices) {
            const normalizedValue = normalize(value);

            const filtered = dataBase.filter((item: InvoiceApi) => {
                // 1. Filtro por columnas (cliente)
                const matchesClient = keys.some((key) =>
                    normalize(getNestedValue(item, key)).includes(normalizedValue)
                );

                // 2. Filtro por facturas (controlNumber)
                const matchesControlNumber = item.invoices.some(inv =>
                    normalize(inv.controlNumber).includes(normalizedValue)
                );

                return matchesClient || matchesControlNumber;
            });

            setDataFilter(filtered);
        }
    }

    const debouncedFilter = debounce(handleFilter, 200)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFilter(value)
        debouncedFilter(value)
    }

    return (
        <div className="relative flex-1 bg-white rounded-md w-full">
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
