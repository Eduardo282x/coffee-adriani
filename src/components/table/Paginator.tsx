import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC } from 'react'
import { Button } from '../ui/button';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface IPaginator {
    page: number;
    rowsPerPage: number;
    changePage: (page: number, rowsPerPage: number) => void;
    maxPage: number;
    totalElements: number;
}

type TypeDirection = 'back' | 'next';

export const Paginator: FC<IPaginator> = ({ page, rowsPerPage, changePage, maxPage, totalElements }) => {

    const changeValueSelect = (value: string) => {
        changePage(page, Number(value));
    }

    const arrowBtns = (direction: TypeDirection) => {
        if (direction == 'back' && page <= 0) return;
        if (direction == 'next' && page >= maxPage - 1) return;
        changePage(direction == 'next' ? page + 1 : page - 1, rowsPerPage)
    }

    return (
        <div className='p-2 flex items-center justify-between w-full '>
            <div>
                <p className='text-gray-700'><span className='font-medium '>Total de Elementos:</span> {totalElements}</p>
            </div>

            <div className="flex items-center justify-center gap-8">
                <div className="flex items-center justify-center gap-2">
                    <span className=' text-gray-700 text-sm font-medium'>Elementos por pagina: </span>
                    <Select onValueChange={changeValueSelect} value={rowsPerPage.toString()}>
                        <SelectTrigger className="w-auto px-4 rounded-md cursor-pointer bg-gray-100">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                                <SelectItem value="200">200</SelectItem>
                                <SelectItem value="500">500</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="icon" disabled={page == 0} className=' cursor-pointer rounded-full' onClick={() => arrowBtns('back')}>
                        <ChevronLeft />
                    </Button>

                    <span className=' text-gray-700 text-sm'><span className='font-medium'>Pagina:</span>  {page + 1} - {maxPage.toFixed(0)}</span>

                    <Button variant="outline" size="icon" disabled={page >= (maxPage - 1)} className=' cursor-pointer rounded-full' onClick={() => arrowBtns('next')}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}