/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getEnterpriseEntries,
    getEntryStatistics,
    createInventoryEntry,
    updateInventoryEntry,
    deleteInventoryEntry,
    InventoryHistoryFilter,
    deleteEntryPayment as deleteEntryPaymentService,
    updateEntryPayment as updateEntryPaymentService
} from '@/services/inventory.service';
import { PaginatedEntryResponse, CreateInventoryEntryForm, EntryPaymentForm } from '@/interfaces/inventory.interface';
import { formatDateOnly } from './formaters';
import { enterpriseFilterStore } from '@/store/enterpriseFilterStore';

interface UseEnterpriseEntriesOptions {
    pageSize?: number;
    useGlobalFilters?: boolean;
}

export const useEnterpriseEntries = (options: UseEnterpriseEntriesOptions = {}) => {
    const { pageSize = 50, useGlobalFilters = false } = options;
    const [dateFilter, setDateFilter] = useState<{ startDate?: string; endDate?: string } | null>(null);
    const [localSearch, setLocalSearch] = useState<string>('');
    const [typeProduct, setTypeProduct] = useState<string>('');
    const [typeMovement, setTypeMovement] = useState<string>('');
    const [localSupplierId, setLocalSupplierId] = useState<number | undefined>(undefined);

    const globalSearch = enterpriseFilterStore((state) => state.search);
    const globalSupplierId = enterpriseFilterStore((state) => state.supplierId);

    const search = useGlobalFilters ? globalSearch : localSearch;
    const supplierId = useGlobalFilters ? globalSupplierId : (localSupplierId !== undefined ? localSupplierId.toString() : '');

    const queryClient = useQueryClient();

    const {
        data: entriesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingEntries,
        error: entriesError,
        refetch: refetchEntries
    } = useInfiniteQuery({
        queryKey: ['enterprise-entries', dateFilter, search, supplierId, pageSize],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params: InventoryHistoryFilter = {
                page: pageParam,
                limit: pageSize,
                ...(dateFilter?.startDate && { startDate: formatDateOnly(dateFilter.startDate) }),
                ...(dateFilter?.endDate && { endDate: formatDateOnly(dateFilter.endDate) }),
                ...(search && { controlNumber: search }),
                ...(supplierId && { supplierId })
            };

            return getEnterpriseEntries(params) as Promise<PaginatedEntryResponse>;
        },
        getNextPageParam: (lastPage: any) => {
            return lastPage?.pagination?.hasNext ? lastPage.pagination.page + 1 : undefined;
        },
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: statisticsData,
        isLoading: isLoadingStatistics,
        refetch: refetchStatistics
    } = useQuery({
        queryKey: ['enterprise-entries-statistics', dateFilter, search, supplierId, typeProduct, typeMovement],
        queryFn: () => getEntryStatistics({
            ...(dateFilter?.startDate && { startDate: dateFilter.startDate }),
            ...(dateFilter?.endDate && { endDate: dateFilter.endDate }),
            ...(search && { controlNumber: search }),
            ...(typeMovement !== 'ALL' && { typeMovement }),
            ...(typeProduct && { typeProduct }),
            ...(supplierId && { supplierId })
        }),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    const createEntryMutation = useMutation({
        mutationFn: (data: CreateInventoryEntryForm) => createInventoryEntry(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries'] });
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
        },
    });

    const updateEntryMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateInventoryEntryForm }) =>
            updateInventoryEntry(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries'] });
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
        },
    });

    const deleteEntryMutation = useMutation({
        mutationFn: deleteInventoryEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries'] });
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
        },
    });

    const deletePaymentMutation = useMutation({
        mutationFn: deleteEntryPaymentService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries'] });
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
        },
    })

    const updatePaymentMutation = useMutation({
        mutationFn: ({ paymentId, data }: { paymentId: number; data: EntryPaymentForm }) =>
            updateEntryPaymentService(paymentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries'] });
            queryClient.invalidateQueries({ queryKey: ['enterprise-entries-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-entries'] });
        },
    })

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

    const handleTypeProduct = useCallback((search: string) => {
        setTypeProduct(search);
    }, []);

    const handleTypeMovement = useCallback((search: string) => {
        setTypeMovement(search);
    }, []);

    const handleChangeSearch = useCallback((search: string) => {
        if (useGlobalFilters) {
            enterpriseFilterStore.getState().setSearch(search);
        } else {
            setLocalSearch(search);
        }
    }, [useGlobalFilters]);

    const handleChangeSupplier = useCallback((supplierId: string) => {
        if (useGlobalFilters) {
            enterpriseFilterStore.getState().setSupplierId(supplierId);
        } else {
            setLocalSupplierId(supplierId ? Number(supplierId) : undefined);
        }
    }, [useGlobalFilters]);

    const createEntry = useCallback(async (data: CreateInventoryEntryForm) => {
        return createEntryMutation.mutateAsync(data);
    }, [createEntryMutation]);

    const updateEntry = useCallback(async (id: number, data: CreateInventoryEntryForm) => {
        return updateEntryMutation.mutateAsync({ id, data });
    }, [updateEntryMutation]);

    const deleteEntry = useCallback(async (id: number) => {
        return deleteEntryMutation.mutateAsync(id);
    }, [deleteEntryMutation]);

    const deleteEntryPayment = useCallback(async (id: number) => {
        return deletePaymentMutation.mutateAsync(id);
    }, [deletePaymentMutation]);

    const updatePayment = useCallback(async (paymentId: number, data: EntryPaymentForm) => {
        return updatePaymentMutation.mutateAsync({ paymentId, data });
    }, [updatePaymentMutation]);

    const isLoading = isLoadingEntries;
    const isMutating = createEntryMutation.isPending ||
        updateEntryMutation.isPending ||
        deleteEntryMutation.isPending ||
        updatePaymentMutation.isPending;

    return {
        entries: processedData?.entries || [],
        pagination: entriesData?.pages[0]?.pagination || null,
        totalCount: processedData?.totalCount || 0,
        statistics: statisticsData,
        isLoading,
        isLoadingStatistics,
        isLoadingMore: isFetchingNextPage,
        isMutating,

        hasMore: processedData?.hasMore || false,
        loadMore: loadMoreEntries,

        applyDateFilter,
        handleChangeSearch,
        handleChangeSearchValue: search,
        handleChangeSupplier,
        handleTypeProduct,
        handleTypeMovement,
        supplierId,

        createEntry,
        updateEntry,
        removeEntry: deleteEntry,

        deletePayment: deleteEntryPayment,
        updatePayment,

        refetch: refetchEntries,
        refetchStatistics,

        error: entriesError
    };
};
