/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DateRangeFilter, InvoiceStatus, IInvoiceForm, InvoiceAPINew } from '@/interfaces/invoice.interface';
import { invalidateDashboardQueries } from '@/hooks/dashboard.hook';
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
    InvoiceFilterPaginate,
    checkInvoicesPayment,
    putLostInvoices,
} from '@/services/invoice.service';
import { formatDateOnly } from './formaters';
import { useOptimizedInventory } from './inventory.hook';
import { putInventory } from '@/services/inventory.service';
import { invoiceFilterStore } from '@/store/invoiceFilterStore';

interface UseInvoicesOptions {
    pageSize?: number;
    enableStatistics?: boolean;
}

export const useOptimizedInvoices = (options: UseInvoicesOptions = {}) => {
    const { pageSize = 50, enableStatistics = true } = options;
    const [dateFilter, setDateFilter] = useState<DateRangeFilter | null>(null);
    const [page, setPage] = useState(0);
    const [invoiceId, setInvoiceId] = useState<number | null>(null);
    const pageRef = useRef(page);
    const pageSizeRef = useRef(pageSize);
    const skipFirstRefetch = useRef(true);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const search = invoiceFilterStore((state) => state.search);
    const selectedZone = invoiceFilterStore((state) => state.selectedZone);
    const selectedBlock = invoiceFilterStore((state) => state.selectedBlock);
    const selectedTypeProduct = invoiceFilterStore((state) => state.selectedTypeProduct);
    const selectedStatus = invoiceFilterStore((state) => state.selectedStatus);

    const queryClient = useQueryClient();

    const { inventory: inventoryList, invalidateInventory } = useOptimizedInventory({ enableHistory: false });

    const invalidateInvoiceQueries = useCallback(async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['invoices'] }),
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] }),
            queryClient.invalidateQueries({ queryKey: ['invoices-unordered'] }),
            invalidateDashboardQueries(queryClient),
        ]);
    }, [queryClient]);

    // 1. Consulta paginada para facturas (paginación por servidor)
    const {
        data: invoicesData,
        isLoading: isLoadingInvoicesQuery,
        isFetching: isFetchingInvoices,
        error: invoicesError,
        refetch: refetchInvoices
    } = useQuery({
        queryKey: ['invoices', dateFilter, search, selectedZone, selectedBlock, selectedTypeProduct, selectedStatus],
        queryFn: async () => {
            const params: InvoiceFilterPaginate = {
                page: pageRef.current + 1,
                limit: pageSizeRef.current,
                ...(dateFilter && {
                    startDate: formatDateOnly(dateFilter.startDate),
                    endDate: formatDateOnly(dateFilter.endDate)
                }),
                search: search.trim(),
                type: selectedTypeProduct,
                ...(selectedZone !== 'all' && { zone: selectedZone }),
                ...(selectedBlock !== 'all' && { blockId: selectedBlock }),
                ...(selectedStatus !== 'all' && { status: selectedStatus })
            };

            return getInvoicesFilterPaginated(params) as unknown as InvoiceAPINew;
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
        queryKey: ['invoice-statistics', dateFilter, selectedTypeProduct, search, selectedZone, selectedBlock, selectedStatus],
        queryFn: () => getInvoiceStatistics({
            startDate: formatDateOnly(dateFilter?.startDate),
            endDate: formatDateOnly(dateFilter?.endDate),
            search: search.trim(),
            type: selectedTypeProduct,
            ...(selectedZone !== 'all' && { zone: selectedZone }),
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
        queryFn: () => getInvoiceDetails(Number(invoiceId)),
        enabled: invoiceId !== null,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    // 3. Mutaciones
    const createInvoiceMutation = useMutation({
        mutationFn: postInvoice,
        onSuccess: async (data: any) => {
            await invalidateInvoiceQueries();
            if (!data || data.success === false || !Array.isArray(data.details)) return;

            await Promise.all(
                data.details.map(async (detail: any) => {
                    const item = inventoryList.find((inv) => inv.productId === detail.productId);
                    if (!item) return;
                    await putInventory(item.id, {
                        productId: detail.productId,
                        quantity: item.quantity - detail.quantity,
                    });
                })
            );

            await invalidateInventory();
        },
    });

    const updateInvoiceMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: IInvoiceForm }) => putInvoice(id, data),
        onSuccess: invalidateInvoiceQueries,
    });

    const deleteInvoiceMutation = useMutation({
        mutationFn: deleteInvoice,
        onSuccess: invalidateInvoiceQueries,
    });

    const payInvoiceMutation = useMutation({
        mutationFn: putPayInvoice,
        onSuccess: invalidateInvoiceQueries,
    });

    const lostInvoicesMutation = useMutation({
        mutationFn: putLostInvoices,
        onSuccess: invalidateInvoiceQueries,
    });

    const pendingInvoiceMutation = useMutation({
        mutationFn: putPendingInvoice,
        onSuccess: invalidateInvoiceQueries,
    });

    const cleanInvoiceMutation = useMutation({
        mutationFn: putCleanInvoice,
        onSuccess: invalidateInvoiceQueries,
    });

    const checkInvoiceMutation = useMutation({
        mutationFn: checkInvoicesPayment,
        onSuccess: invalidateInvoiceQueries,
    });

    // 4. Memoizar datos procesados
    const processedData = useMemo(() => {
        if (!invoicesData) return null;

        return {
            invoices: invoicesData.invoices ?? [],
            totalCount: invoicesData.pagination?.totalCount ?? 0,
            totalPages: invoicesData.pagination?.totalPages ?? 0,
        };
    }, [invoicesData]);

    useEffect(() => {
        setPage(0);
    }, [dateFilter, search, selectedZone, selectedBlock, selectedTypeProduct, selectedStatus, pageSize]);

    // Refetch manual al cambiar página o tamaño (no están en el queryKey)
    useEffect(() => {
        if (skipFirstRefetch.current) {
            skipFirstRefetch.current = false;
            return;
        }
        pageRef.current = page;
        pageSizeRef.current = pageSize;
        setIsChangingPage(true);
        refetchInvoices();
    }, [page, pageSize, refetchInvoices]);

    useEffect(() => {
        if (isChangingPage && !isFetchingInvoices) {
            setIsChangingPage(false);
        }
    }, [isFetchingInvoices, isChangingPage]);

    // 5. Funciones de control
    const applyDateFilter = useCallback((filter: DateRangeFilter | null) => {
        setDateFilter(filter);
    }, []);

    const handleChangeSearch = useCallback((filter: string) => {
        invoiceFilterStore.getState().setSearch(filter);
    }, []);

    const handleChangeBlock = useCallback((option: string) => {
        invoiceFilterStore.getState().setSelectedBlock(option);
    }, []);

    const handleChangeZone = useCallback((option: string) => {
        invoiceFilterStore.getState().setSelectedZone(option);
    }, []);

    const handleChangeTypeProduct = useCallback((option: string) => {
        invoiceFilterStore.getState().setSelectedTypeProduct(option);
    }, []);

    const handleChangeStatusInvoice = useCallback((option: InvoiceStatus) => {
        invoiceFilterStore.getState().setSelectedStatus(option);
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
    
    const lostInvoices = useCallback(async (id: number) => {
        return lostInvoicesMutation.mutateAsync(id);
    }, [lostInvoicesMutation]);

    const setPendingInvoice = useCallback(async (id: number) => {
        return pendingInvoiceMutation.mutateAsync(id);
    }, [pendingInvoiceMutation]);

    const cleanInvoice = useCallback(async (id: number) => {
        return cleanInvoiceMutation.mutateAsync(id);
    }, [cleanInvoiceMutation]);

    const checkOneInvoice = useCallback(async (id: number) => {
        return checkInvoiceMutation.mutateAsync(id);
    }, [checkInvoiceMutation]);

    // 7. Estado de carga general
    const isLoading = isLoadingInvoicesQuery || isLoadingStatistics;
    const isLoadingInvoices = isLoadingInvoicesQuery || isChangingPage;
    const isMutating = createInvoiceMutation.isPending ||
        updateInvoiceMutation.isPending ||
        deleteInvoiceMutation.isPending ||
        payInvoiceMutation.isPending ||
        lostInvoicesMutation.isPending ||
        pendingInvoiceMutation.isPending ||
        cleanInvoiceMutation.isPending ||
        checkInvoiceMutation.isPending

    return {
        // Datos
        invoices: processedData?.invoices || [],
        statistics: statisticsData,
        invoicesDetails: invoicesDetails,
        totalCount: processedData?.totalCount || 0,
        totalPages: processedData?.totalPages || 0,

        // Estados de carga
        isLoading,
        isLoadingInvoices,
        isLoadingStatistics,
        isLoadingDetails,
        isMutating,

        // Control de paginación
        page,
        setPage,

        // Filtros
        applyDateFilter,
        handleChangeBlock,
        handleChangeTypeProduct,
        handleChangeZone,
        handleChangeSearch,
        handleChangeStatusInvoice,
        setInvoiceId,
        currentFilter: dateFilter,
        selectedZone,
        selectedBlock,
        selectedTypeProduct,
        selectedStatus,

        // Mutaciones
        createInvoice,
        updateInvoice,
        removeInvoice,
        payInvoice,
        lostInvoices,
        setPendingInvoice,
        cleanInvoice,
        checkOneInvoice,

        // Control manual
        refetch: refetchInvoices,
        refetchStatistics,
        refetchDetails,

        // Errores
        error: invoicesError
    };
};