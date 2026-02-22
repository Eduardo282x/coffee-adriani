import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getInventory, getInventoryHistory } from '@/services/inventory.service';
import { IInventory } from '@/interfaces/inventory.interface';

export const useOptimizedInventory = () => {
    const queryClient = useQueryClient();

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
        data: inventoryHistoryData,
        isLoading: isLoadingInventoryHistory,
        refetch: refetchInventoryHistory,
    } = useQuery({
        queryKey: ['inventory-history'],
        queryFn: () => getInventoryHistory() as Promise<IInventory[]>,
        staleTime: Infinity,
        gcTime: 30 * 60 * 1000,
    });

    const invalidateInventory = async () => {
        await queryClient.invalidateQueries({ queryKey: ['inventory'] });
        await queryClient.invalidateQueries({ queryKey: ['inventory-history'] });
    };

    return {
        inventory: inventoryData || [],
        inventoryHistory: inventoryHistoryData || [],
        isLoading: isLoadingInventory || isLoadingInventoryHistory,
        isLoadingInventory,
        isLoadingInventoryHistory,
        refetchInventory,
        refetchInventoryHistory,
        invalidateInventory,
    };
};
