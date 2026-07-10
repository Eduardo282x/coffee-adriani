import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { getInventory, getInventoryEntries, InventoryHistoryFilter } from '@/services/inventory.service';
import { IInventory, IInventoryEntry, PaginatedEntryResponse } from '@/interfaces/inventory.interface';
import { useCallback, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';

const EMPTY_INVENTORY: IInventory[] = [];

const EMPTY_ENTRIES: PaginatedEntryResponse = {
    entries: [],
    pagination: {
        page: 1,
        limit: 50,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
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
        data: inventoryEntriesPages,
        isLoading: isLoadingInventoryHistory,
        refetch: refetchInventoryHistory,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['inventory-entries', typeProduct, movementType, dateRange, controlNumber, historyFilter.limit],
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

            return getInventoryEntries(params) as Promise<PaginatedEntryResponse>;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
        },
        enabled: enableHistory,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    const inventoryEntries = useMemo<IInventoryEntry[]>(() => {
        if (!inventoryEntriesPages?.pages?.length) return [];

        return inventoryEntriesPages.pages.flatMap((page) => page.entries);
    }, [inventoryEntriesPages]);

    const inventoryHistoryPagination = inventoryEntriesPages?.pages?.[inventoryEntriesPages.pages.length - 1]?.pagination ?? EMPTY_ENTRIES.pagination;

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
        await queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
    };

    return {
        inventory: inventoryData ?? EMPTY_INVENTORY,
        inventoryEntries,
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
