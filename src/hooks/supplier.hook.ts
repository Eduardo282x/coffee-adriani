import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuppliersPaginated, postSupplier, putSupplier, deleteSupplier, SupplierFilterPaginate } from '@/services/supplier.service';
import { BodySupplier, ISupplier, SupplierResponse } from '@/interfaces/supplier.interface';

const EMPTY_SUPPLIERS: ISupplier[] = [];

interface UseSuppliersOptions {
    pageSize?: number;
}

export const useSuppliers = (options: UseSuppliersOptions = {}) => {
    const { pageSize = 50 } = options;
    const [search, setSearch] = useState<string>('');
    const queryClient = useQueryClient();

    const invalidateSuppliers = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    }, [queryClient]);

    const searchTrimmed = search.trim();
    const validSearch = searchTrimmed.length >= 3 ? searchTrimmed : undefined;

    const {
        data: suppliersPages,
        isLoading,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['suppliers', validSearch],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params: SupplierFilterPaginate = {
                page: Number(pageParam),
                limit: pageSize,
                ...(validSearch && { search: validSearch }),
                active: true
            };

            return getSuppliersPaginated(params);
        },
        getNextPageParam: (lastPage: SupplierResponse) => {
            return lastPage.pagination?.hasNext ? lastPage.pagination.page + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
    });

    const suppliers = useMemo<ISupplier[]>(() => {
        if (!suppliersPages?.pages?.length) return EMPTY_SUPPLIERS;
        return suppliersPages.pages.flatMap((page) => (page as SupplierResponse).suppliers);
    }, [suppliersPages]);

    const pagination = suppliersPages?.pages?.[suppliersPages.pages.length - 1]?.pagination ?? {
        page: 1,
        limit: pageSize,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    };

    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleChangeSearch = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const createMutation = useMutation({
        mutationFn: (data: BodySupplier) => postSupplier(data),
        onSuccess: invalidateSuppliers,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: BodySupplier }) => putSupplier(id, data),
        onSuccess: invalidateSuppliers,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteSupplier(id),
        onSuccess: invalidateSuppliers,
    });

    return {
        suppliers,
        pagination,
        isLoading,
        isLoadingMore: isFetchingNextPage,
        hasMore: !!hasNextPage,
        loadMore,
        search,
        handleChangeSearch,
        refetch,
        createSupplier: createMutation.mutateAsync,
        updateSupplier: updateMutation.mutateAsync,
        deleteSupplier: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
