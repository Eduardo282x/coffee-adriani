/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useRef, useState } from "react";
import { IColumns, IOptionActions, OrderBy } from "./table.interface";
import { Paginator } from "./Paginator";
import { ArrowUp, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { formatNumberWithDots } from "@/hooks/formaters";
import { ToolTip } from "../tooltip/ToolTip";
import { IoIosArrowDown } from "react-icons/io";

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
    shortSpaces
}: TableProps<T>) => {
    const [dataFilter, setDataFilter] = useState<T[]>(dataBase || []);
    const [columnData, setColumnData] = useState<IColumns<T>[]>(columns);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    useEffect(() => {
        setDataFilter(dataBase)
        setPage(0)
        setRowsPerPage(50)
    }, [dataBase])

    useEffect(() => {
        setColumnData(columns)
    }, [columns])

    const handleChangePage = (page: number, newPage: number) => {
        setPage(page);
        setRowsPerPage(newPage);
    };

    const handleChangeOrder = (col: IColumns<T>) => {
        if (!col.icon) {
            let newOrderBy: OrderBy = "";

            setColumnData((prev) =>
                prev.map((co) => {
                    if (co.column === col.column) {
                        newOrderBy = co.orderBy === 'asc' ? 'desc' : (co.orderBy === 'desc' ? '' : 'asc');
                        return { ...co, orderBy: newOrderBy };
                    } else {
                        return { ...co, orderBy: '' };
                    }
                })
            );

            let orderedData;

            if (newOrderBy === "") {
                orderedData = dataBase;
            } else {
                orderedData = [...dataBase].sort((a, b) => {
                    const valA = getNestedValue(a, col.column);
                    const valB = getNestedValue(b, col.column);

                    return newOrderBy === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
                });
            }

            setDataFilter(orderedData);
        }
    }


    return (
        <>
            <div className={`rounded-md border ${className}`}>
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
                        {dataFilter && dataFilter.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            dataFilter && dataFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index: number) => (
                                <>
                                    {isExpansible ?
                                        <TableRowExpansible index={index} data={data} columns={columns} action={action} renderRow={renderRow} colSpanColumns={colSpanColumns} columnData={columnData} />
                                        :
                                        <TableRowNormal index={index} data={data} columns={columns} action={action} renderRow={renderRow} colSpanColumns={colSpanColumns} columnData={columnData} />
                                    }
                                </>
                            ))
                        )}
                    </TableBody>
                    {includeFooter && (
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={columns.length - 2}>Total</TableCell>
                                <TableCell className="text-left">{formatNumberWithDots(Number(total), '', ' $')}</TableCell>
                                <TableCell className="text-left"></TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>

            {(!hidePaginator && dataBase.length >= 5) && (
                <Paginator
                    page={page}
                    rowsPerPage={rowsPerPage}
                    changePage={handleChangePage}
                    maxPage={Math.ceil(dataBase.length / rowsPerPage)}
                    totalElements={dataBase.length}
                >
                </Paginator>
            )}
        </>
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
                        <p>{renderRow && renderRow(data, index)}</p>
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
            action('editable', { ...data, [column.column]: newValue });
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
    return (
        <>
            {column.optionActions && column.optionActions?.length == 1 ?
                <div>
                    {column.optionActions && column.optionActions.map((icon: IOptionActions, index: number) => (
                        <div key={index} onClick={() => action && action(icon.label, data)} className={`flex justify-center ${icon.className}`}>
                            <ToolTip tooltip={column.label}>
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
                        {column.optionActions && column.optionActions.map((icon: IOptionActions, index: number) => (
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

const getNestedValue = (obj: any, path: string): string => {
    try {
        return path.split('.').reduce((acc, key) => acc?.[key], obj)?.toString().toLowerCase() || '';
    } catch {
        return '';
    }
}