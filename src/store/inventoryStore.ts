import { create } from 'zustand'
import { IInventory } from '@/interfaces/inventory.interface';
import { getInventory } from '@/services/inventory.service';

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
        // finally (y no un set suelto al final): si la petición falla, el loading se
        // restauraba solo en el camino feliz y quedaba en true para siempre.
        try {
            const response: IInventory[] = await getInventory();
            if (response && response.length > 0) {
                set(() => ({
                    inventory: response,
                    inventoryHistory: []
                }))
            }
        } finally {
            set(() => ({ loading: false }))
        }
    }
}))