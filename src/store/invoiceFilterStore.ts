import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DateRange } from 'react-day-picker'

interface InvoiceFilterState {
    search: string;
    selectedZone: string;
    selectedBlock: string;
    selectedTypeProduct: string;
    selectedProductIds: number[];
    selectedStatuses: string[];
    dateStart: DateRange | undefined;
    setSearch: (value: string) => void;
    setSelectedZone: (value: string) => void;
    setSelectedBlock: (value: string) => void;
    setSelectedTypeProduct: (value: string) => void;
    setSelectedProductIds: (value: number[]) => void;
    setSelectedStatuses: (value: string[]) => void;
    setDateStart: (value: DateRange | undefined) => void;
    resetFilters: () => void;
}

const defaultFilters = {
    search: '',
    selectedZone: 'all',
    selectedBlock: 'all',
    selectedTypeProduct: 'Cafe',
    selectedProductIds: [] as number[],
    selectedStatuses: [] as string[],
    dateStart: undefined,
};

const serializeDateRange = (range: DateRange | undefined) => {
    if (!range) return undefined;
    return {
        from: range.from ? range.from.toISOString() : undefined,
        to: range.to ? range.to.toISOString() : undefined,
    };
};

const deserializeDateRange = (data: { from?: string; to?: string } | undefined): DateRange | undefined => {
    if (!data) return undefined;
    return {
        from: data.from ? new Date(data.from) : undefined,
        to: data.to ? new Date(data.to) : undefined,
    };
};

export const invoiceFilterStore = create<InvoiceFilterState>()(
    persist(
        (set) => ({
            ...defaultFilters,
            setSearch: (search) => set({ search }),
            setSelectedZone: (selectedZone) => set({ selectedZone }),
            setSelectedBlock: (selectedBlock) => set({ selectedBlock }),
            setSelectedTypeProduct: (selectedTypeProduct) => set((state) => ({
                selectedTypeProduct,
                ...(state.selectedTypeProduct !== selectedTypeProduct && { selectedProductIds: [] }),
            })),
            setSelectedProductIds: (selectedProductIds) => set({ selectedProductIds }),
            setSelectedStatuses: (selectedStatuses) => set({ selectedStatuses }),
            setDateStart: (dateStart) => set({ dateStart }),
            resetFilters: () => set({ ...defaultFilters }),
        }),
        {
            name: 'invoice-filters',
            partialize: (state) => ({
                search: state.search,
                selectedZone: state.selectedZone,
                selectedBlock: state.selectedBlock,
                selectedTypeProduct: state.selectedTypeProduct,
                selectedProductIds: state.selectedProductIds,
                selectedStatuses: state.selectedStatuses,
                dateStart: serializeDateRange(state.dateStart),
            }),
            merge: (persisted, current) => {
                const data = (persisted ?? {}) as Partial<InvoiceFilterState> & { selectedStatus?: string };
                const legacyStatus = data.selectedStatus;
                const persistedStatuses = Array.isArray(data.selectedStatuses)
                    ? data.selectedStatuses
                    : legacyStatus && legacyStatus !== 'all'
                        ? [legacyStatus]
                        : current.selectedStatuses;
                return {
                    ...current,
                    ...data,
                    selectedProductIds: Array.isArray(data.selectedProductIds) ? data.selectedProductIds : current.selectedProductIds,
                    selectedStatuses: persistedStatuses,
                    dateStart: deserializeDateRange(data.dateStart as { from?: string; to?: string } | undefined),
                };
            },
        }
    )
);