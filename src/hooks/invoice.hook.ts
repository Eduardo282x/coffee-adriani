/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DateRangeFilter, InvoiceStatus, IInvoiceForm, InvoiceAPINew } from '@/interfaces/invoice.interface';
import {
    getInvoicesFilterPaginated,
    getInvoiceStatistics,
    getInvoiceDetails,
    postInvoice,
    putInvoice,
    deleteInvoice,
    putPayInvoice,
    putPendingInvoice,
    putCleanInvoice,
    checkInvoices,
    InvoiceFilterPaginate,
    checkInvoicesPayment,
} from '@/services/invoice.service';

interface UseInvoicesOptions {
    pageSize?: number;
    enableStatistics?: boolean;
}

export const useOptimizedInvoices = (options: UseInvoicesOptions = {}) => {
    const { pageSize = 50, enableStatistics = true } = options;
    const [dateFilter, setDateFilter] = useState<DateRangeFilter | null>(null);
    const [invoiceId, setInvoiceId] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [selectedBlock, setSelectedBlock] = useState<string>('all');
    const [selectedTypeProduct, setSelectedTypeProduct] = useState<string>('Cafe');
    const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus>('all');

    const queryClient = useQueryClient();

    // 1. Consulta infinita para facturas (paginación)
    const {
        data: invoicesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingInvoices,
        error: invoicesError,
        refetch: refetchInvoices
    } = useInfiniteQuery({
        queryKey: ['invoices', dateFilter, search, selectedBlock, selectedTypeProduct, selectedStatus],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params: InvoiceFilterPaginate = {
                page: Number(pageParam),
                limit: pageSize,
                ...(dateFilter && {
                    startDate: dateFilter.startDate,
                    endDate: dateFilter.endDate
                }),
                search: search.trim(),
                type: selectedTypeProduct,
                ...(selectedBlock !== 'all' && { blockId: selectedBlock }),
                ...(selectedStatus !== 'all' && { status: selectedStatus })
            };

            return getInvoicesFilterPaginated(params) as Promise<InvoiceAPINew[]>;
        },
        getNextPageParam: (lastPage: any) => {
            return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined;
        },
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    // 2. Consulta separada para estadísticas
    const {
        data: statisticsData,
        isLoading: isLoadingStatistics,
        refetch: refetchStatistics
    } = useQuery({
        queryKey: ['invoice-statistics', dateFilter, selectedTypeProduct, search, selectedBlock, selectedStatus],
        queryFn: () => getInvoiceStatistics({
            startDate: dateFilter?.startDate,
            endDate: dateFilter?.endDate,
            search: search.trim(),
            type: selectedTypeProduct,
            ...(selectedBlock !== 'all' && { blockId: selectedBlock }),
            ...(selectedStatus !== 'all' && { status: selectedStatus })
        }),
        enabled: enableStatistics,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    // 2. Consulta separada para estadísticas
    const {
        data: invoicesDetails,
        isLoading: isLoadingDetails,
        refetch: refetchDetails
    } = useQuery({
        queryKey: ['invoice-details', invoiceId],
        queryFn: () => getInvoiceDetails(invoiceId),
        enabled: true,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    // 3. Mutaciones
    const createInvoiceMutation = useMutation({
        mutationFn: postInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const updateInvoiceMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: IInvoiceForm }) => putInvoice(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const deleteInvoiceMutation = useMutation({
        mutationFn: deleteInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const payInvoiceMutation = useMutation({
        mutationFn: putPayInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const pendingInvoiceMutation = useMutation({
        mutationFn: putPendingInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const cleanInvoiceMutation = useMutation({
        mutationFn: putCleanInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const checkInvoiceMutation = useMutation({
        mutationFn: checkInvoicesPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const checkInvoicesMutation = useMutation({
        mutationFn: checkInvoices,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    // 4. Memoizar datos procesados
    const processedData = useMemo(() => {
        if (!invoicesData) return null;

        const allInvoices = invoicesData.pages.flatMap((page: any) => page.invoices);

        return {
            invoices: allInvoices,
            totalCount: (invoicesData.pages[0] as any).pagination?.totalCount ?? 0,
            hasMore: hasNextPage
        };
    }, [invoicesData, hasNextPage]);

    // 5. Funciones de control
    const loadMoreInvoices = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const applyDateFilter = useCallback((filter: DateRangeFilter | null) => {
        setDateFilter(filter);
    }, []);

    const handleChangeSearch = useCallback((filter: string) => {
        setSearch(filter);
    }, []);

    const handleChangeBlock = useCallback((option: string) => {
        setSelectedBlock(option);
    }, []);

    const handleChangeTypeProduct = useCallback((option: string) => {
        setSelectedTypeProduct(option);
    }, []);

    const handleChangeStatusInvoice = useCallback((option: InvoiceStatus) => {
        setSelectedStatus(option);
    }, []);

    // 6. Funciones de mutación wrapper
    const createInvoice = useCallback(async (data: IInvoiceForm) => {
        return createInvoiceMutation.mutateAsync(data);
    }, [createInvoiceMutation]);

    const updateInvoice = useCallback(async (id: number, data: IInvoiceForm) => {
        return updateInvoiceMutation.mutateAsync({ id, data });
    }, [updateInvoiceMutation]);

    const removeInvoice = useCallback(async (id: number) => {
        return deleteInvoiceMutation.mutateAsync(id);
    }, [deleteInvoiceMutation]);

    const payInvoice = useCallback(async (id: number) => {
        return payInvoiceMutation.mutateAsync(id);
    }, [payInvoiceMutation]);

    const setPendingInvoice = useCallback(async (id: number) => {
        return pendingInvoiceMutation.mutateAsync(id);
    }, [pendingInvoiceMutation]);

    const cleanInvoice = useCallback(async (id: number) => {
        return cleanInvoiceMutation.mutateAsync(id);
    }, [cleanInvoiceMutation]);

    const checkOneInvoice = useCallback(async (id: number) => {
        return checkInvoiceMutation.mutateAsync(id);
    }, [checkInvoiceMutation]);

    const validateInvoices = useCallback(async () => {
        return checkInvoicesMutation.mutateAsync();
    }, [checkInvoicesMutation]);

    // 7. Estado de carga general
    const isLoading = isLoadingInvoices || isLoadingStatistics;
    const isMutating = createInvoiceMutation.isPending ||
        updateInvoiceMutation.isPending ||
        deleteInvoiceMutation.isPending ||
        payInvoiceMutation.isPending ||
        pendingInvoiceMutation.isPending ||
        cleanInvoiceMutation.isPending ||
        checkInvoiceMutation.isPending ||
        checkInvoicesMutation.isPending;

    return {
        // Datos
        invoices: processedData?.invoices || [],
        statistics: statisticsData,
        invoicesDetails: invoicesDetails,
        totalCount: processedData?.totalCount || 0,

        // Estados de carga
        isLoading,
        isLoadingStatistics,
        isLoadingDetails,
        isLoadingMore: isFetchingNextPage,
        isMutating,

        // Control de paginación
        hasMore: processedData?.hasMore || false,
        loadMore: loadMoreInvoices,

        // Filtros
        applyDateFilter,
        handleChangeBlock,
        handleChangeTypeProduct,
        handleChangeSearch,
        handleChangeStatusInvoice,
        setInvoiceId,
        currentFilter: dateFilter,
        selectedBlock,
        selectedTypeProduct,
        selectedStatus,

        // Mutaciones
        createInvoice,
        updateInvoice,
        removeInvoice,
        payInvoice,
        setPendingInvoice,
        cleanInvoice,
        checkOneInvoice,
        validateInvoices,

        // Control manual
        refetch: refetchInvoices,
        refetchStatistics,
        refetchDetails,

        // Errores
        error: invoicesError
    };
};