import { create } from 'zustand'
import { IInventory } from '@/interfaces/inventory.interface';
import { getInventory, getInventoryHistory } from '@/services/inventory.service';

interface InventoryState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    inventory: IInventory[];
    inventoryHistory: IInventory[];
    setInventory: (inventory: IInventory[]) => void;
    getInventoryApi: () => Promise<void>;
}

export const inventoryStore = create<InventoryState>((set) => ({
    inventory: [],
    inventoryHistory: [],
    loading: false,
    setLoading: (loading: boolean) => { (set(() => ({ loading }))) },
    setInventory: (inventory: IInventory[]) => set(() => ({ inventory })),
    getInventoryApi: async () => {
        set(() => ({ loading: true }))
        const response: IInventory[] = await getInventory();
        const responseHistory: IInventory[] = await getInventoryHistory();
        if (response && response.length > 0) {
            set(() => ({
                inventory: response,
                inventoryHistory: responseHistory
            }))
        }
        set(() => ({ loading: false }))
    }
}))