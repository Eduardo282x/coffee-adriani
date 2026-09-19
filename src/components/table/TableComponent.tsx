/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useRef, useState } from "react";
import { IColumns, IOptionActions, OrderBy } from "./table.interface";
import { Paginator } from "./Paginator";
import { ArrowUp, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ToolTip } from "../tooltip/ToolTip";
import { IoIosArrowDown } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";

interface TableProps<T> {
    className?: string;
    dataBase: T[];
    columns: IColumns<T>[];
    action?: (type: string, data: T) => void;
    includeFooter?: boolean;
    total?: string;
    hidePaginator?: boolean;
    renderRow?: (item: T, index: number) => React.ReactNode;
    colSpanColumns?: boolean;
    hideColumns?: boolean;
    isExpansible?: boolean;
    shortSpaces?: boolean;
    totalElements?: number;
    loading?: boolean;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    page?: number;
    onPageChange?: (page: number) => void;
    totalPages?: number;
}

export const TableComponent = <T,>({
    className,
    dataBase,
    columns,
    action,
    includeFooter,
    total,
    hidePaginator,
    renderRow,
    colSpanColumns,
    hideColumns,
    isExpansible,
    shortSpaces,
    totalElements,
    loading = false,
    pageSize,
    onPageSizeChange,
    page,
    onPageChange,
    totalPages
}: TableProps<T>) => {
    const [dataFilter, setDataFilter] = useState<T[]>(dataBase || []);
    const [columnData, setColumnData] = useState<IColumns<T>[]>(columns);

    const [internalPage, setInternalPage] = useState(0);
    const [localRowsPerPage, setLocalRowsPerPage] = useState(50);

    const rowsPerPage = pageSize ?? localRowsPerPage;
    const currentPage = onPageChange ? (page ?? 0) : internalPage;

    const maxPage = Math.max(1, totalPages
        ?? (totalElements ? Math.ceil(totalElements / rowsPerPage) : Math.ceil(dataBase.length / rowsPerPage)));

    const displayedData = onPageChange
        ? dataFilter
        : dataFilter.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

    useEffect(() => {
        setDataFilter(dataBase)
        setInternalPage(0)
    }, [dataBase])

    useEffect(() => {
        setColumnData(columns)
    }, [columns])

    const handleChangePage = (newPage: number, newRowsPerPage: number) => {
        if (onPageSizeChange && newRowsPerPage !== rowsPerPage) {
            onPageSizeChange(newRowsPerPage);
            onPageChange?.(0);
            setInternalPage(0);
            return;
        }
        if (onPageChange) {
            onPageChange(newPage);
        } else {
            setInternalPage(newPage);
        }
        setLocalRowsPerPage(newRowsPerPage);
    };

    const handleChangeOrder = (col: IColumns<T>) => {
        if (col.icon) return;

        const current = columnData.find((co) => co.column === col.column);
        const newOrderBy: OrderBy = current?.orderBy === 'asc'
            ? 'desc'
            : current?.orderBy === 'desc'
                ? ''
                : 'asc';

        setColumnData((prev) =>
            prev.map((co) =>
                co.column === col.column ? { ...co, orderBy: newOrderBy } : { ...co, orderBy: '' }
            )
        );

        if (newOrderBy === '') {
            setDataFilter(dataBase);
            return;
        }

        const orderedData = [...dataBase].sort((a, b) =>
            compareValues(
                getNestedRawValue(a, col.column),
                getNestedRawValue(b, col.column),
            ) * (newOrderBy === 'asc' ? 1 : -1)
        );

        setDataFilter(orderedData);
    }


    return (
        <>
            <div className={`rounded-md border hidden lg:block ${className}`}>
                <Table>
                    <TableHeader className={`shadow-md ${hideColumns && 'hidden'}`}>
                        <TableRow>
                            {columnData.map((col: IColumns<T>, index: number) => (
                                <TableHead
                                    key={index}
                                    onClick={() => handleChangeOrder(col)}
                                    className="cursor-pointer bg-white z-50"
                                >
                                    <div className={`flex items-center ${!shortSpaces && 'gap-2'}`}>
                                        {col.label}
                                        {!col.icon && (
                                            <span
                                                className={` transition-all duration-300 ease-in-out ${col.orderBy === 'asc' ? 'rotate-0' : col.orderBy === 'desc' ? 'rotate-180' : 'opacity-0'
                                                    }`}
                                            >
                                                <ArrowUp className=" scale-75" />
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                            {isExpansible && (
                                <TableHead className="cursor-pointer bg-white z-50">
                                    Abrir
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 50 }).map((_, i) => (
                                <TableRowSkeleton key={i} columns={columns.length} />
                            ))
                        ) : dataFilter && dataFilter.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedData.map((data, index: number) => (
                                isExpansible ?
                                    <TableRowExpansible key={index} index={index} data={data} columns={columns} action={action} renderRow={renderRow} colSpanColumns={colSpanColumns} columnData={columnData} />
                                    :
                                    <TableRowNormal key={index} index={index} data={data} columns={columns} action={action} renderRow={renderRow} colSpanColumns={colSpanColumns} columnData={columnData} />
                            ))
                        )}
                    </TableBody>
                    {includeFooter && (
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={columns.length - 2}>Total</TableCell>
                                <TableCell className="text-left">{total} $</TableCell>
                                <TableCell className="text-left"></TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>

            <div className="block lg:hidden space-y-2">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeletonMobile key={i} columns={columns.length} />
                    ))
                ) : (
                    displayedData.map((item, index) => (
                        <CardDynamicMobile key={index} data={item} columns={columnData} isExpansible={isExpansible as boolean} renderRow={renderRow} />
                    ))
                )}
            </div>

            {(!hidePaginator && (totalElements ? totalElements > 0 : (dataBase && dataBase.length >= 50))) && (
                <Paginator
                    page={currentPage}
                    rowsPerPage={rowsPerPage}
                    changePage={handleChangePage}
                    maxPage={maxPage}
                    totalElements={totalElements ? totalElements : dataBase.length}
                >
                </Paginator>
            )}
        </>
    )
}

const TableRowSkeleton = ({ columns }: { columns: number }) => (
    <TableRow>
        {Array.from({ length: columns }).map((_, i) => (
            <TableCell key={i}>
                <Skeleton className="h-7 w-full" />
            </TableCell>
        ))}
    </TableRow>
)

const CardSkeletonMobile = ({ columns }: { columns: number }) => (
    <div className="bg-white rounded-md p-4 shadow-md w-full space-y-3">
        {Array.from({ length: Math.min(columns, 4) }).map((_, i) => (
            <div key={i} className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
            </div>
        ))}
    </div>
)

interface CardDynamicMobileProps<T> {
    data: T;
    columns: IColumns<T>[];
    isExpansible: boolean;
    renderRow?: (item: T, index: number) => React.ReactNode;
}

const CardDynamicMobile = <T,>({ data, columns, isExpansible, renderRow }: CardDynamicMobileProps<T>) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setOpen(!open);
    }

    return (
        <div className="bg-white rounded-md p-4 shadow-md w-full relative" onClick={handleOpen}>
            {isExpansible && (
                <div className="cursor-pointer absolute top-6 right-4">
                    <IoIosArrowDown
                        className={`transition-transform text-xl ${open ? 'rotate-180' : 'rotate-0'}`}
                    />
                </div>
            )}

            {columns.filter(item => !item.optionActions).map((col: IColumns<T>, index: number) => (
                <div key={index} className="flex gap-2">
                    <span className="font-semibold">{col.label}:</span>
                    <span>{col.element(data)}</span>
                </div>
            ))}

            {open && (
                <div className="shadow-xl border border-gray-400 rounded-xl overflow-hidden mt-2">
                    {renderRow && renderRow(data, 0)}
                </div>
            )}
        </div>
    )
}

interface TableRowNormalProps<T> {
    index: number;
    columns: IColumns<T>[];
    columnData: IColumns<T>[];
    data: T;
    colSpanColumns?: boolean;
    action?: (type: string, data: T) => void;
    renderRow?: (item: T, index: number) => React.ReactNode;
}

const TableRowNormal = <T,>({ index, columns, data, colSpanColumns, columnData, action, renderRow }: TableRowNormalProps<T>) => {
    return (
        <TableRow key={index}>
            {renderRow ?
                <TableCell key={index} colSpan={colSpanColumns ? columnData.length : 1} className="p-0">
                    {renderRow(data, index)}
                </TableCell>
                :
                (columns && columns.map((column: IColumns<T>, index: number) => (
                    <TableCell key={index}>
                        {(!column.icon
                            ? <ColumnType column={column} data={data} action={action} />
                            : <ColumnIcon column={column} data={data} action={action} />
                        )}
                    </TableCell>
                )))
            }
        </TableRow>
    )
}

const TableRowExpansible = <T,>({ index, columns, data, action, renderRow }: TableRowNormalProps<T>) => {
    const [open, setOpen] = useState<boolean>(false);
    const rowRef = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
                // setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <TableRow
                key={`main-${index}`}
                ref={rowRef}
                onClick={() => setOpen(!open)}
                className="cursor-pointer transition-all"
            >
                {columns.map((column: IColumns<T>, idx: number) => (
                    <TableCell key={idx}>
                        {!column.icon
                            ? <ColumnType column={column} data={data} action={action} />
                            : <ColumnIcon column={column} data={data} action={action} />}
                    </TableCell>
                ))}
                <TableCell>
                    <IoIosArrowDown
                        className={`transition-transform text-xl ${open ? 'rotate-180' : 'rotate-0'}`}
                    />
                </TableCell>
            </TableRow>

            {/* Fila expandida */}
            <TableRow key={`expand-${index}`} className="bg-muted">
                <TableCell colSpan={columns.length + 1} className="p-0">
                    <div
                        className={`transition-all duration-300 ease-in-out w-full ${open ? 'h-auto px-4 py-2' : '!h-0'} interpolate overflow-hidden`}
                    >
                        <div>{renderRow && renderRow(data, index)}</div>
                    </div>
                </TableCell>
            </TableRow>
        </>
    )
}

interface ColumnProps<T> {
    column: IColumns<T>;
    data: T;
    action?: (type: string, data: T) => void;
}

const ColumnType = <T,>({ column, data, action }: ColumnProps<T>) => {
    // const [value, setValue] = useState<string | number>(data[column.column] as string);
    const [value, setValue] = useState<string | number>(getNestedValue(data, column.column));

    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (column.type === 'editable' && action) {
            // action('editable', { ...data, [column.column]: newValue });
            // Crear nuevo objeto con la propiedad anidada actualizada
            const updatedData = setNestedValueInObject(data, column.column, newValue);
            action('editable', updatedData);
        }
    }

    const sendAction = () => {
        if (column.type === 'custom' && action) {
            action(column.column, data);
        }
    }

    return (
        <>
            {column.type === 'string' &&
                <span className={`${column.className ? column.className(data) : ''}`}>{column.element(data)}</span>
            }
            {column.type === 'editable' &&
                <Input type="number" value={value} onChange={onChangeValue} />
            }
            {column.type === 'custom' &&
                <div onClick={sendAction}>
                    {column.element(data)}
                </div>
            }
        </>
    )
}

const ColumnIcon = <T,>({ column, data, action }: ColumnProps<T>) => {
    const actions = (column.optionActions ?? []).filter(
        (optionAction) => !optionAction.visible || optionAction.visible(data),
    );

    if (actions.length === 0) {
        return null;
    }

    return (
        <>
            {actions.length == 1 ?
                <div className="flex justify-center gap-2">
                    {actions.map((icon: IOptionActions<T>, index: number) => (
                        <div key={index} onClick={() => action && action(icon.label, data)} className={`flex justify-center ${icon.className}`}>
                            <ToolTip tooltip={icon.label}>
                                <div className="p-1 hover:bg-gray-300 rounded-md cursor-pointer">
                                    <icon.icon className={`h-4 w-4 ${icon.className}`} />
                                </div>
                            </ToolTip>
                        </div>
                    ))}
                </div>
                :
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {actions.map((icon: IOptionActions<T>, index: number) => (
                            <DropdownMenuItem key={index} onClick={() => action && action(icon.label, data)} className={`${icon.className}`}>
                                <icon.icon className={`mr-2 h-4 w-4 ${icon.className}`} />
                                <span className={`${icon.className}`}>{icon.label}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </>
    )
}

// Función helper para obtener valores anidados
const getNestedValue = (obj: any, path: string): string => {
    try {
        return path.split('.').reduce((acc, key) => acc?.[key], obj)?.toString().toLowerCase() || '';
    } catch {
        return '';
    }
}

// Obtener el valor crudo (sin coercionar a string) para ordenar correctamente
const getNestedRawValue = (obj: any, path: string): unknown => {
    try {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    } catch {
        return undefined;
    }
}

const compareValues = (a: unknown, b: unknown): number => {
    if (a === undefined || a === null) return b === undefined || b === null ? 0 : 1;
    if (b === undefined || b === null) return -1;

    if (a instanceof Date || b instanceof Date) {
        const ta = a instanceof Date ? a.getTime() : new Date(a as string).getTime();
        const tb = b instanceof Date ? b.getTime() : new Date(b as string).getTime();
        if (!Number.isNaN(ta) && !Number.isNaN(tb)) return ta - tb;
    }

    const na = typeof a === 'number' ? a : Number(a);
    const nb = typeof b === 'number' ? b : Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb) &&
        ((typeof a === 'number' && typeof b === 'number') ||
            (typeof a === 'string' && (a as string).trim() !== '' && typeof b === 'string' && (b as string).trim() !== ''))) {
        return na - nb;
    }

    return String(a).localeCompare(String(b));
}

// Función helper para establecer valores anidados dinámicamente
const setNestedValueInObject = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const result = { ...obj };

    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    return result;
};