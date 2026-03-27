import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { getInventory, getInventoryHistory, InventoryHistoryFilter } from '@/services/inventory.service';
import { History, IInventory, InventoryHistory } from '@/interfaces/inventory.interface';
import { useCallback, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';

const EMPTY_INVENTORY: IInventory[] = [];

const EMPTY_HISTORY: InventoryHistory = {
    history: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    },
};

const DEFAULT_HISTORY_FILTER: InventoryHistoryFilter = {
    page: 1,
    limit: 50,
};

interface UseInventoryOptions {
    pageSize?: number;
    enableHistory?: boolean;
}

export const useOptimizedInventory = (options: UseInventoryOptions = {}) => {
    const queryClient = useQueryClient();
    const [historyFilter, setHistoryFilter] = useState<InventoryHistoryFilter>(DEFAULT_HISTORY_FILTER);
    const [typeProduct, setTypeProduct] = useState<string>('Cafe');
    const [controlNumber, setControlNumber] = useState<string>('');
    const [movementType, setMovementType] = useState<string>('IN');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const { pageSize = 50, enableHistory = true } = options;

    const formatDateOnly = (value: Date | string | null | undefined): string => {
        if (!value) return '';
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 10);
    };

    const {
        data: inventoryData,
        isLoading: isLoadingInventory,
        refetch: refetchInventory,
    } = useQuery({
        queryKey: ['inventory'],
        queryFn: () => getInventory() as Promise<IInventory[]>,
        staleTime: Infinity,
        gcTime: 30 * 60 * 1000,
    });

    const {
        data: inventoryHistoryPages,
        isLoading: isLoadingInventoryHistory,
        refetch: refetchInventoryHistory,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['inventory-history', typeProduct, movementType, dateRange, controlNumber, historyFilter.limit],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params: InventoryHistoryFilter = {
                page: Number(pageParam),
                limit: historyFilter.limit ?? pageSize,
                ...(dateRange && {
                    startDate: formatDateOnly(dateRange?.from),
                    endDate: formatDateOnly(dateRange?.to),
                }),
                ...(controlNumber && controlNumber !== '' && { controlNumber }),
                ...(typeProduct && typeProduct !== 'ALL' && { typeProduct }),
                ...(movementType && movementType !== 'ALL' && { typeMovement: movementType }),
            };

            return getInventoryHistory(params) as Promise<InventoryHistory>;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined;
        },
        enabled: enableHistory,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    const inventoryHistory = useMemo<History[]>(() => {
        if (!inventoryHistoryPages?.pages?.length) return [];

        return inventoryHistoryPages.pages.flatMap((page) => page.history);
    }, [inventoryHistoryPages]);

    const inventoryHistoryPagination = inventoryHistoryPages?.pages?.[inventoryHistoryPages.pages.length - 1]?.pagination ?? EMPTY_HISTORY.pagination;

    const applyHistoryFilter = useCallback((next: Partial<InventoryHistoryFilter>) => {
        setHistoryFilter((prev) => ({ ...prev, ...next, page: 1 }));
    }, []);

    const loadMoreHistory = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const invalidateInventory = async () => {
        await queryClient.invalidateQueries({ queryKey: ['inventory'] });
        await queryClient.invalidateQueries({ queryKey: ['inventory-history'] });
    };

    return {
        inventory: inventoryData ?? EMPTY_INVENTORY,
        inventoryHistory,
        inventoryHistoryPagination,
        historyFilter,
        applyHistoryFilter,
        isLoading: isLoadingInventory || isLoadingInventoryHistory,
        isLoadingInventory,
        isLoadingInventoryHistory,
        isLoadingMoreHistory: isFetchingNextPage,
        hasMoreHistory: !!hasNextPage,
        refetchInventory,
        refetchInventoryHistory,
        invalidateInventory,
        loadMoreHistory,

        typeProduct,
        setTypeProduct,
        movementType,
        setMovementType,
        dateRange,
        setDateRange,
        controlNumber,
        setControlNumber
    };
};
