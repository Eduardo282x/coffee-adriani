import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { getInventory, getInventoryEntries, getInventoryCut, InventoryHistoryFilter, InventoryCutFilter } from '@/services/inventory.service';
import { IInventory, IInventoryEntry, PaginatedEntryResponse, InventoryCut, PaginatedCutResponse } from '@/interfaces/inventory.interface';
import { useCallback, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { formatDateOnly } from './formaters';

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

interface UseInventoryCutOptions {
    pageSize?: number;
}

export const useInventoryCut = (options: UseInventoryCutOptions = {}) => {
    const { pageSize = 50 } = options;
    const [cutType, setCutType] = useState<string>('ALL');
    const [cutDateRange, setCutDateRange] = useState<DateRange | undefined>(undefined);

    const {
        data: cutPages,
        isLoading,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['inventory-cuts', cutType, cutDateRange],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params: InventoryCutFilter = {
                page: Number(pageParam),
                limit: pageSize,
                ...(cutType && cutType !== 'ALL' && { type: cutType }),
                ...(cutDateRange && {
                    startDate: formatDateOnly(cutDateRange?.from),
                    endDate: formatDateOnly(cutDateRange?.to),
                }),
            };

            return getInventoryCut(params) as Promise<PaginatedCutResponse>;
        },
        getNextPageParam: (lastPage) => {
            return lastPage?.pagination?.hasNextPage ? lastPage.pagination.page + 1 : undefined;
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    const cuts = useMemo<InventoryCut[]>(() => {
        if (!cutPages?.pages?.length) return [];

        return cutPages.pages.flatMap((page) => page.cuts);
    }, [cutPages]);

    const cutPagination = cutPages?.pages?.[cutPages.pages.length - 1]?.pagination;

    const applyCutFilter = useCallback((next: Partial<InventoryCutFilter>) => {
        if (next.type !== undefined) setCutType(next.type);
        if (next.startDate || next.endDate) {
            setCutDateRange({
                from: next.startDate ? new Date(next.startDate) : undefined,
                to: next.endDate ? new Date(next.endDate) : undefined,
            });
        }
    }, []);

    const setCutDateRangeFilter = useCallback((range: DateRange | undefined) => {
        setCutDateRange(range);
    }, []);

    const loadMoreCuts = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return {
        cuts,
        cutPagination,
        cutType,
        setCutType,
        cutDateRange,
        setCutDateRangeFilter,
        applyCutFilter,
        isLoadingCuts: isLoading,
        isLoadingMoreCuts: isFetchingNextPage,
        hasMoreCuts: !!hasNextPage,
        loadMoreCuts,
        refetchCuts: refetch,
    };
};
