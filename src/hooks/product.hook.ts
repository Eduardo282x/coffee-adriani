import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductDolar, updateDolarAutomatic, updateDolar } from '@/services/products.service';
import { DolarBody, IDolar } from '@/interfaces/product.interface';

export const useProductDolar = () => {
    const queryClient = useQueryClient();

    const {
        data: dolarData,
        isLoading: isLoadingDolar,
        refetch: refetchDolar,
    } = useQuery({
        queryKey: ['product-dolar'],
        queryFn: () => getProductDolar() as Promise<IDolar>,
        staleTime: Infinity,
        gcTime: 30 * 60 * 1000,
    });

    const updateAutomaticMutation = useMutation({
        mutationFn: updateDolarAutomatic,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-dolar'] });
        },
    });

    const updateManualMutation = useMutation({
        mutationFn: (data: DolarBody) => updateDolar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-dolar'] });
        },
    });

    return {
        dolar: dolarData,
        isLoadingDolar,
        refetchDolar,
        updateDolarAutomatic: updateAutomaticMutation.mutateAsync,
        updateDolarManual: updateManualMutation.mutateAsync,
        isUpdatingDolar: updateAutomaticMutation.isPending || updateManualMutation.isPending,
    };
};
