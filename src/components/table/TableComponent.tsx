/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react";
import { IColumns, IOptionActions, OrderBy } from "./table.interface";
import { Paginator } from "./Paginator";
import { ArrowUp, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { formatNumberWithDots } from "@/hooks/formaters";
import { ToolTip } from "../tooltip/ToolTip";

interface TableProps<T> {
    dataBase: T[];
    columns: IColumns<T>[];
    action?: (type: string, data: T) => void;
    includeFooter?: boolean;
    total?: string;
    hidePaginator?: boolean;
    renderRow?: (item: T, index: number) => React.ReactNode;
    colSpanColumns?: boolean
}

export const TableComponent = <T,>({
    dataBase,
    columns,
    action,
    includeFooter,
    total,
    hidePaginator,
    renderRow,
    colSpanColumns,
}: TableProps<T>) => {
    const [dataFilter, setDataFilter] = useState<T[]>(dataBase);
    const [columnData, setColumnData] = useState<IColumns<T>[]>(columns);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        setDataFilter(dataBase)
        setPage(0)
        setRowsPerPage(5)
    }, [dataBase])

    useEffect(() => {
        setColumnData(columns)
    }, [columns])

    const handleChangePage = (page: number, newPage: number) => {
        setPage(page);
        setRowsPerPage(newPage);
    };

    const handleChangeOrder = (col: IColumns<T>) => {
        if (!col.icon && !renderRow) {
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
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="shadow-md">
                        <TableRow>
                            {columnData.map((col: IColumns<T>, index: number) => (
                                <TableHead
                                    key={index}
                                    onClick={() => handleChangeOrder(col)}
                                    className="cursor-pointer bg-white z-50"
                                >
                                    <div className="flex items-center gap-2">
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataFilter.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            dataFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index: number) => (
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

    return (
        <>
            {column.type === 'string' &&
                <span className={`${column.className ? column.className(data) : ''}`}>{column.element(data)}</span>
            }
            {column.type === 'editable' &&
                <Input type="number" value={value} onChange={onChangeValue} />
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