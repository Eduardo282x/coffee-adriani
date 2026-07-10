/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getEnterpriseEntries,
    createInventoryEntry,
    updateInventoryEntry,
    deleteInventoryEntry,
    InventoryHistoryFilter
} from '@/services/inventory.service';
import { PaginatedEntryResponse, CreateInventoryEntryForm } from '@/interfaces/inventory.interface';

interface UseEnterpriseEntriesOptions {
    pageSize?: number;
}

export const useEnterpriseEntries = (options: UseEnterpriseEntriesOptions = {}) => {
    const { pageSize = 50 } = options;
    const [dateFilter, setDateFilter] = useState<{ startDate?: string; endDate?: string } | null>(null);
    const [search, setSearch] = useState<string>('');
    const [supplierId, setSupplierId] = useState<number | undefined>(undefined);

    const queryClient = useQueryClient();

    const formatDateOnly = (value: Date | string | null | undefined): string => {
        if (!value) return '';
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 10);
    };

    const {
        data: entriesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingEntries,
        error: entriesError,
        refetch: refetchEntries
    } = useInfiniteQuery({
        queryKey: ['enterprise-entries', dateFilter, search, supplierId],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params: InventoryHistoryFilter = {
                page: pageParam,
                limit: pageSize,
                ...(dateFilter?.startDate && { startDate: formatDateOnly(dateFilter.startDate) }),
                ...(dateFilter?.endDate && { endDate: formatDateOnly(dateFilter.endDate) }),
                ...(search && { controlNumber: search }),
                ...(supplierId && { supplierId: supplierId.toString() })
            };

            return getEnterpriseEntries(params) as Promise<PaginatedEntryResponse>;
        },
        getNextPageParam: (lastPage: any) => {
            return lastPage?.pagination?.hasNext ? lastPage.pagination.page + 1 : undefined;
        },
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    const createEntryMutation = useMutation({
        mutationFn: (data: CreateInventoryEntryForm) => createInventoryEntry(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
        },
    });

    const updateEntryMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateInventoryEntryForm }) => 
            updateInventoryEntry(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
        },
    });

    const deleteEntryMutation = useMutation({
        mutationFn: deleteInventoryEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
        },
    });

    const processedData = useMemo(() => {
        if (!entriesData) return null;

        const allEntries = entriesData.pages.flatMap(page => page.entries || []);

        return {
            entries: allEntries,
            totalCount: entriesData.pages[0]?.pagination?.totalCount || 0,
            hasMore: hasNextPage
        };
    }, [entriesData, hasNextPage]);

    const loadMoreEntries = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const applyDateFilter = useCallback((filter: { startDate?: Date; endDate?: Date } | null) => {
        if (filter) {
            setDateFilter({
                startDate: formatDateOnly(filter.startDate),
                endDate: formatDateOnly(filter.endDate)
            });
        } else {
            setDateFilter(null);
        }
    }, []);

    const handleChangeSearch = useCallback((search: string) => {
        setSearch(search);
    }, []);

    const handleChangeSupplier = useCallback((supplierId: number | undefined) => {
        setSupplierId(supplierId);
    }, []);

    const createEntry = useCallback(async (data: CreateInventoryEntryForm) => {
        return createEntryMutation.mutateAsync(data);
    }, [createEntryMutation]);

    const updateEntry = useCallback(async (id: number, data: CreateInventoryEntryForm) => {
        return updateEntryMutation.mutateAsync({ id, data });
    }, [updateEntryMutation]);

    const deleteEntry = useCallback(async (id: number) => {
        return deleteEntryMutation.mutateAsync(id);
    }, [deleteEntryMutation]);

    const isLoading = isLoadingEntries;
    const isMutating = createEntryMutation.isPending || 
        updateEntryMutation.isPending || 
        deleteEntryMutation.isPending;

    return {
        entries: processedData?.entries || [],
        pagination: entriesData?.pages[0]?.pagination || null,
        totalCount: processedData?.totalCount || 0,
        isLoading,
        isLoadingMore: isFetchingNextPage,
        isMutating,
        
        hasMore: processedData?.hasMore || false,
        loadMore: loadMoreEntries,
        
        applyDateFilter,
        handleChangeSearch,
        handleChangeSearchValue: search,
        handleChangeSupplier,
        supplierId,
        
        createEntry,
        updateEntry,
        removeEntry: deleteEntry,
        
        refetch: refetchEntries,
        
        error: entriesError
    };
};
