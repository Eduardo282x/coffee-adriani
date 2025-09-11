/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPaymentsPaginated,
    getPaymentStatistics,
    updatePayment,
    registerPayment,
    deletePayment,
    putDisassociatePayment,
    putConfirmPayment,
    postPaymentAccounts,
    deletePaymentAccounts,
    FilterPaymentsPaginated,
    postAssociatePayment,
    putPaymentAccounts
} from '@/services/payment.service';

interface PaymentDateRangeFilter {
    startDate?: Date;
    endDate?: Date;
}

interface UsePaymentsOptions {
    pageSize?: number;
    enableStatistics?: boolean;
}

export const useOptimizedPayments = (options: UsePaymentsOptions = {}) => {
    const { pageSize = 50, enableStatistics = true } = options;
    const [dateFilter, setDateFilter] = useState<PaymentDateRangeFilter | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<number | undefined>(undefined);
    const [search, setSearch] = useState<string>('');
    const [typeProduct, setTypeProduct] = useState<string>('');
    const [typeDescription, setTypeDescription] = useState<string>('');
    const [selectCredits, setSelectCredits] = useState<'credit' | 'noCredit' | 'all'>('all');
    const [selectedAccount, setSelectedAccount] = useState<number | undefined>(undefined);
    // const [selectedStatus, setSelectedStatus] = useState<'CONFIRMED' | 'PENDING' | 'all'>('all');
    const [selectedAssociation, setSelectedAssociation] = useState<'associated' | 'unassociated' | 'all'>('all');

    const queryClient = useQueryClient();

    // 1. Consulta infinita para pagos (paginación)
    const {
        data: paymentsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingPayments,
        error: paymentsError,
        refetch: refetchPayments
    } = useInfiniteQuery({
        queryKey: ['payments', dateFilter, search, typeDescription, typeProduct, selectedMethod, selectedAccount, selectCredits, selectedAssociation],
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }) => {
            const params: FilterPaymentsPaginated = {
                page: pageParam,
                limit: pageSize,
                ...(dateFilter && {
                    startDate: dateFilter.startDate,
                    endDate: dateFilter.endDate
                }),
                search: search,
                ...(selectedAccount && { accountId: selectedAccount }),
                ...(selectedMethod && { methodId: selectedMethod }),
                ...(typeDescription !== 'all' && { typeDescription: typeDescription }),
                ...(typeProduct !== 'all' && { type: typeProduct }),
                ...(selectCredits !== 'all' && { credit: selectCredits }),
                ...(selectedAssociation !== 'all' && {
                    associated: selectedAssociation == 'associated'
                })
            };

            return getPaymentsPaginated(params);
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
        queryKey: ['payment-statistics', dateFilter, search, typeDescription, typeProduct, selectedMethod, selectedAccount, selectCredits, selectedAssociation],
        queryFn: () => getPaymentStatistics({
            startDate: dateFilter?.startDate,
            endDate: dateFilter?.endDate,
            search: search,
            ...(selectedAccount && { accountId: selectedAccount }),
            ...(selectedMethod && { methodId: selectedMethod }),
            ...(typeProduct !== 'all' && { type: typeProduct }),
            ...(typeDescription !== 'all' && { typeDescription: typeDescription }),
            ...(selectCredits !== 'all' && { credit: selectCredits }),
            ...(selectedAssociation !== 'all' && {
                associated: selectedAssociation == 'associated'
            })
        }),
        enabled: enableStatistics,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    // 3. Mutaciones para pagos
    const createPaymentMutation = useMutation({
        mutationFn: registerPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
        },
    });

    const updatePaymentMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => updatePayment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
        },
    });

    const deletePaymentMutation = useMutation({
        mutationFn: deletePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] }); // Puede afectar facturas
        },
    });

    const associatePaymentMutation = useMutation({
        mutationFn: postAssociatePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const disassociatePaymentMutation = useMutation({
        mutationFn: putDisassociatePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
        },
    });

    const confirmZelleMutation = useMutation({
        mutationFn: putConfirmPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
        },
    });

    // const validatePaymentsMutation = useMutation({
    //     mutationFn: validateAssociatedPaymentsInvoices,
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ['payments'] });
    //         queryClient.invalidateQueries({ queryKey: ['payment-statistics'] });
    //         queryClient.invalidateQueries({ queryKey: ['invoices'] });
    //         queryClient.invalidateQueries({ queryKey: ['invoice-statistics'] });
    //     },
    // });

    // 4. Mutaciones para cuentas
    const createAccountMutation = useMutation({
        mutationFn: postPaymentAccounts,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-accounts'] });
        },
    });

    const updateAccountMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => putPaymentAccounts(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-accounts'] });
        },
    });

    const deleteAccountMutation = useMutation({
        mutationFn: deletePaymentAccounts,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-accounts'] });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
        },
    });

    // 5. Memoizar datos procesados
    const processedData = useMemo(() => {
        if (!paymentsData) return null;

        const allPayments = paymentsData.pages.flatMap(page => page.payments);

        return {
            payments: allPayments,
            totalCount: paymentsData.pages[0]?.pagination?.totalCount || 0,
            hasMore: hasNextPage
        };
    }, [paymentsData, hasNextPage]);

    // 6. Funciones de control
    const loadMorePayments = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const applyDateFilter = useCallback((filter: PaymentDateRangeFilter | null) => {
        setDateFilter(filter);
    }, []);

    const handleChangeMethod = useCallback((methodId: number | undefined) => {
        setSelectedMethod(methodId);
    }, []);

    const handleChangeTypeProduct = useCallback((search: string) => {
        setTypeProduct(search);
    }, []);

    const handleChangeTypeDescription = useCallback((search: string) => {
        setTypeDescription(search);
    }, []);

    const handleChangeSearch = useCallback((search: string) => {
        setSearch(search);
    }, []);

    const handleChangeAccount = useCallback((accountId: number | undefined) => {
        setSelectedAccount(accountId);
    }, []);

    // const handleChangeStatus = useCallback((status: 'CONFIRMED' | 'PENDING' | 'all') => {
    //     setSelectedStatus(status);
    // }, []);
    const handleChangeCredit = useCallback((credit: 'credit' | 'noCredit' | 'all') => {
        setSelectCredits(credit);
    }, []);

    const handleChangeAssociation = useCallback((association: 'associated' | 'unassociated' | 'all') => {
        setSelectedAssociation(association);
    }, []);

    // 7. Funciones de mutación wrapper
    const createPayment = useCallback(async (data: any) => {
        return createPaymentMutation.mutateAsync(data);
    }, [createPaymentMutation]);

    const updatePaymentData = useCallback(async (id: number, data: any) => {
        return updatePaymentMutation.mutateAsync({ id, data });
    }, [updatePaymentMutation]);

    const removePayment = useCallback(async (id: number) => {
        return deletePaymentMutation.mutateAsync(id);
    }, [deletePaymentMutation]);

    const associatePayment = useCallback(async (data: any) => {
        return associatePaymentMutation.mutateAsync(data);
    }, [associatePaymentMutation]);

    const disassociatePayment = useCallback(async (data: any) => {
        return disassociatePaymentMutation.mutateAsync(data);
    }, [disassociatePaymentMutation]);

    const confirmZellePayment = useCallback(async (id: number) => {
        return confirmZelleMutation.mutateAsync(id);
    }, [confirmZelleMutation]);

    // const validatePayments = useCallback(async () => {
    //     return validatePaymentsMutation.mutateAsync();
    // }, [validatePaymentsMutation]);

    // 8. Funciones para cuentas
    const createAccount = useCallback(async (data: any) => {
        return createAccountMutation.mutateAsync(data);
    }, [createAccountMutation]);

    const updateAccount = useCallback(async (id: number, data: any) => {
        return updateAccountMutation.mutateAsync({ id, data });
    }, [updateAccountMutation]);

    const removeAccount = useCallback(async (id: number) => {
        return deleteAccountMutation.mutateAsync(id);
    }, [deleteAccountMutation]);

    // 9. Estado de carga general
    const isLoading = isLoadingPayments || isLoadingStatistics;
    const isMutating = createPaymentMutation.isPending ||
        updatePaymentMutation.isPending ||
        deletePaymentMutation.isPending ||
        associatePaymentMutation.isPending ||
        disassociatePaymentMutation.isPending ||
        confirmZelleMutation.isPending ||
        // validatePaymentsMutation.isPending ||
        createAccountMutation.isPending ||
        updateAccountMutation.isPending ||
        deleteAccountMutation.isPending;

    return {
        // Datos
        payments: processedData?.payments || [],
        statistics: statisticsData,
        totalCount: processedData?.totalCount || 0,

        // Estados de carga
        isLoading,
        isLoadingStatistics,
        isLoadingMore: isFetchingNextPage,
        isMutating,

        // Control de paginación
        hasMore: processedData?.hasMore || false,
        loadMore: loadMorePayments,

        // Filtros
        applyDateFilter,
        handleChangeAccount,
        handleChangeMethod,
        handleChangeCredit,
        // handleChangeStatus,
        handleChangeAssociation,
        handleChangeTypeProduct,
        handleChangeTypeDescription,
        handleChangeSearch,
        currentFilter: dateFilter,
        selectedAccount,
        // selectedStatus,
        selectedAssociation,

        // Mutaciones de pagos
        createPayment,
        updatePayment: updatePaymentData,
        removePayment,
        associatePayment,
        disassociatePayment,
        confirmZellePayment,
        // validatePayments,

        // Mutaciones de cuentas
        createAccount,
        updateAccount,
        removeAccount,

        // Control manual
        refetch: refetchPayments,
        refetchStatistics,

        // Errores
        error: paymentsError
    };
};