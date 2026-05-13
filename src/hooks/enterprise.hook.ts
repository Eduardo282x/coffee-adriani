/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPaymentsEnterprise,
    createPaymentsEnterprise,
    updatePaymentsEnterprise,
    deletePaymentsEnterprise,
    FilterPaymentEnterprise
} from '@/services/payment.service';
import { PaymentEnterpriseForm, PaginatedPaymentEnterpriseResponse } from '@/interfaces/payment.interface';

interface UseEnterpriseOptions {
    pageSize?: number;
}

export const useEnterprisePayments = (options: UseEnterpriseOptions = {}) => {
    const { pageSize = 50 } = options;
    const [dateFilter, setDateFilter] = useState<{ startDate?: string; endDate?: string } | null>(null);
    const [selectedType, setSelectedType] = useState<string>('Cafe');
    const [search, setSearch] = useState<string>('');

    const queryClient = useQueryClient();

    const formatDateOnly = (value: Date | string | null | undefined): string => {
        if (!value) return '';
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 10);
    };

    const {
        data: paymentsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingPayments,
        error: paymentsError,
        refetch: refetchPayments
    } = useInfiniteQuery({
        queryKey: ['enterprise-payments', dateFilter, selectedType, search],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params: FilterPaymentEnterprise = {
                page: pageParam,
                limit: pageSize,
                ...(dateFilter?.startDate && { startDate: formatDateOnly(dateFilter.startDate) }),
                ...(dateFilter?.endDate && { endDate: formatDateOnly(dateFilter.endDate) }),
                ...(selectedType !== 'all' && { type: selectedType }),
                ...(search && { controlNumber: search })
            };

            return getPaymentsEnterprise(params) as Promise<PaginatedPaymentEnterpriseResponse>;
        },
        getNextPageParam: (lastPage: any) => {
            return lastPage?.pagination?.hasNext ? lastPage.pagination.page + 1 : undefined;
        },
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    const createPaymentMutation = useMutation({
        mutationFn: (data: PaymentEnterpriseForm) => createPaymentsEnterprise(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-payments'] });
        },
    });

    const updatePaymentMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: PaymentEnterpriseForm }) => 
            updatePaymentsEnterprise(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-payments'] });
        },
    });

    const deletePaymentMutation = useMutation({
        mutationFn: deletePaymentsEnterprise,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enterprise-payments'] });
        },
    });

    const processedData = useMemo(() => {
        if (!paymentsData) return null;

        const allPayments = paymentsData.pages.flatMap(page => page.paymentEnterprise || []);

        return {
            payments: allPayments,
            totalCount: paymentsData.pages[0]?.pagination?.totalCount || 0,
            hasMore: hasNextPage
        };
    }, [paymentsData, hasNextPage]);

    const loadMorePayments = useCallback(() => {
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

    const handleChangeType = useCallback((type: string) => {
        setSelectedType(type);
    }, []);

    const handleChangeSearch = useCallback((search: string) => {
        setSearch(search);
    }, []);

    const createPayment = useCallback(async (data: PaymentEnterpriseForm) => {
        return createPaymentMutation.mutateAsync(data);
    }, [createPaymentMutation]);

    const updatePayment = useCallback(async (id: number, data: PaymentEnterpriseForm) => {
        return updatePaymentMutation.mutateAsync({ id, data });
    }, [updatePaymentMutation]);

    const deletePayment = useCallback(async (id: number) => {
        return deletePaymentMutation.mutateAsync(id);
    }, [deletePaymentMutation]);

    const isLoading = isLoadingPayments;
    const isMutating = createPaymentMutation.isPending || 
        updatePaymentMutation.isPending || 
        deletePaymentMutation.isPending;

    return {
        payments: processedData?.payments || [],
        pagination: paymentsData?.pages[0]?.pagination || null,
        totalCount: processedData?.totalCount || 0,
        typeProduct: selectedType,
        isLoading,
        isLoadingMore: isFetchingNextPage,
        isMutating,
        
        hasMore: processedData?.hasMore || false,
        loadMore: loadMorePayments,
        
        applyDateFilter,
        handleChangeType,
        handleChangeSearch,
        handleChangeSearchValue: search,
        
        createPayment,
        updatePayment,
        removePayment: deletePayment,
        
        refetch: refetchPayments,
        
        error: paymentsError
    };
};