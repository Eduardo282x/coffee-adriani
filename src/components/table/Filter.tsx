/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { IColumns } from "./table.interface";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { InvoiceApi } from "@/interfaces/invoice.interface";
import { IPayments } from "@/interfaces/payment.interface";

interface IFilter {
    dataBase: any[];
    setDataFilter: (value: any) => void;
    setSearch?: (filter: string) => void;
    columns: IColumns<any>[];
    disabledEffect?: boolean;
    filterInvoices?: boolean;
    filterInvoicesPayments?: boolean;
    initialValue?: string;
}

export const Filter: FC<IFilter> = ({
    dataBase,
    setDataFilter,
    setSearch,
    disabledEffect = false,
    columns,
    filterInvoices,
    filterInvoicesPayments,
    initialValue = ''
}) => {
    const [filter, setFilter] = useState<string>(initialValue);

    const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const getNestedValue = (obj: any, path: string): string => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj)?.toString().toLowerCase() || '';
    };

    // Función de filtrado local ejecutada directamente (sin efectos intermedios)
    const applyLocalFilter = (value: string) => {
        if (setSearch) return; // evitamos filtrar si solo estamos usando setSearch

        if (!value) {
            setDataFilter(dataBase);
            return;
        }

        const keys = columns
            .filter((col: IColumns<unknown>) => col.icon === false)
            .map((col: IColumns<unknown>) => col.column);

        const normalizedValue = normalize(value);

        if (filterInvoices) {
            const filtered = dataBase.filter((item: InvoiceApi | IPayments) => {
                const matchesClient = keys.some((key) =>
                    normalize(getNestedValue(item, key)).includes(normalizedValue)
                );

                if (filterInvoicesPayments) {
                    const parseData = item as IPayments;
                    const matchesControlNumber = parseData.InvoicePayment.some(inv =>
                        normalize(inv.invoice.controlNumber).includes(normalizedValue)
                    );
                    return matchesClient || matchesControlNumber;
                } else {
                    const parseData = item as InvoiceApi;
                    const matchesControlNumber = parseData.invoices.some(inv =>
                        normalize(inv.controlNumber).includes(normalizedValue)
                    );
                    return matchesClient || matchesControlNumber;
                }
            });

            setDataFilter(filtered);
        } else {
            const filtered = dataBase.filter((item) =>
                keys.some((key) =>
                    normalize(getNestedValue(item, key)).includes(normalizedValue)
                )
            );

            setDataFilter(filtered);
        }
    };

    // Inicialización de la data cuando cambia la base de datos o se habilita/deshabilita el efecto
    useEffect(() => {
        if (!disabledEffect) {
            setDataFilter(dataBase);
        }
    }, [dataBase, disabledEffect, setDataFilter]);

    // Manejo del debounce únicamente para setSearch (con su respectiva limpieza)
    useEffect(() => {
        if (!setSearch) return;

        const handler = setTimeout(() => {
            setSearch(filter);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [filter, setSearch]);

    // Manejador del input unificado (actualiza estado y aplica el filtro de forma síncrona)
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value);
        applyLocalFilter(value);
    };

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
    );
};