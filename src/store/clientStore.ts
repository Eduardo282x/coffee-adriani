import { create } from 'zustand'
import { GroupClients, IClients, GroupBlock, Block, BodyBlock } from '@/interfaces/clients.interface';
import { IOptions } from '@/interfaces/form.interface';
import { getBlocks, getClients, deleteClients, deleteBlocks, putBlocks, postBlocks } from '@/services/clients.service';

interface ClientState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    clients: GroupClients;
    clientOptions: IOptions[];
    setClients: (clients: GroupClients) => void;

    getClientsApi: () => Promise<void>;
    // addUsers: () => void;
    // editUser: () => void;
    deleteClient: (id: number) => void;
}

export const clientStore = create<ClientState>((set) => ({
    clients: { allClients: [], clients: [], clientsFilter: [] },
    loading: false,
    setLoading: (loading: boolean) => { (set(() => ({ loading }))) },
    setClients: (clients: GroupClients) => set(() => ({ clients })),
    clientOptions: [],

    getClientsApi: async () => {
        const response: IClients[] = await getClients();
        if (response && response.length > 0) {
            set(() => ({
                clients: { allClients: response, clients: response, clientsFilter: response }
            }))
            set(() => ({
                clientOptions: response.map((cli: IClients) => {
                    return {
                        label: `${cli.name} - ${cli.address}`,
                        value: cli.id
                    }
                })
            }))
        }
    },

    deleteClient: async (id: number) => {
        await deleteClients(id);
        set((state) => {
            const clientDeleted = state.clients.allClients.filter((cli: IClients) => cli.id != id);
            const clientFilter = state.clients.clientsFilter.filter((cli: IClients) => cli.id != id);
            return {
                clients: { allClients: clientDeleted, clients: clientDeleted, clientsFilter: clientFilter }
            };
        });
    },
}));

interface BlockState {
    blocks: GroupBlock,
    setBlocks: (blocks: GroupBlock) => void;
    blockOptions: IOptions[],
    getBlocksApi: () => Promise<void>;

    manipulateBlock: (data: BodyBlock, edit: boolean, id?: number) => Promise<void>
    // addUsers: () => void;
    // editUser: () => void;
    deleteBlock: (id: number) => Promise<void>;
}

export const blockStore = create<BlockState>((set) => ({
    blocks: { allBlocks: [], blocks: [] },
    setBlocks: (blocks: GroupBlock) => { set(() => ({ blocks })) },
    blockOptions: [],

    getBlocksApi: async () => {
        const response: Block[] = await getBlocks();
        if (response && response.length > 0) {
            set(() => ({
                blocks: { allBlocks: response, blocks: response },
                blockOptions: response.map(blo => {
                    return {
                        label: blo.name,
                        value: blo.id.toString()
                    }
                })
            }))
        }
    },

    manipulateBlock: async (data: BodyBlock, edit: boolean, id?: number) => {
        if (edit) {
            await putBlocks(Number(id), data)
        } else {
            await postBlocks(data)
        }

        set((state) => {
            if (edit) {
                const editBlock = state.blocks.allBlocks.map(blo => {
                    if (blo.id == id) {
                        return {
                            id,
                            name: data.name,
                            address: data.address,
                        }
                    } else {
                        return blo
                    }
                });

                return {
                    blocks: { allBlocks: editBlock, blocks: editBlock }
                }
            } else {
                // You may want to fetch the new block from the API instead of generating an id like this
                const newBlock = {
                    ...data,
                    id: state.blocks.allBlocks.length + 1
                }
                const updatedBlocks = [...state.blocks.allBlocks, newBlock];
                return {
                    blocks: { allBlocks: updatedBlocks, blocks: updatedBlocks }
                }
            }
        })
    },

    deleteBlock: async (id: number) => {
        await deleteBlocks(id);
        set((state) => {
            const blockDeleted = state.blocks.allBlocks.filter((blo: Block) => blo.id != id);
            return {
                blocks: { allBlocks: blockDeleted, blocks: blockDeleted }
            };
        });
    }
}))