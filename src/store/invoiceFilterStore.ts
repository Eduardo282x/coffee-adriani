import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DateRange } from 'react-day-picker'
import { InvoiceStatus } from '@/interfaces/invoice.interface'

interface InvoiceFilterState {
    search: string;
    selectedZone: string;
    selectedBlock: string;
    selectedTypeProduct: string;
    selectedStatus: InvoiceStatus;
    dateStart: DateRange | undefined;
    setSearch: (value: string) => void;
    setSelectedZone: (value: string) => void;
    setSelectedBlock: (value: string) => void;
    setSelectedTypeProduct: (value: string) => void;
    setSelectedStatus: (value: InvoiceStatus) => void;
    setDateStart: (value: DateRange | undefined) => void;
    resetFilters: () => void;
}

const defaultFilters = {
    search: '',
    selectedZone: 'all',
    selectedBlock: 'all',
    selectedTypeProduct: 'Cafe',
    selectedStatus: 'all' as InvoiceStatus,
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
            setSelectedTypeProduct: (selectedTypeProduct) => set({ selectedTypeProduct }),
            setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
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
                selectedStatus: state.selectedStatus,
                dateStart: serializeDateRange(state.dateStart),
            }),
            merge: (persisted, current) => {
                const data = (persisted ?? {}) as Partial<InvoiceFilterState>;
                return {
                    ...current,
                    ...data,
                    dateStart: deserializeDateRange(data.dateStart as { from?: string; to?: string } | undefined),
                };
            },
        }
    )
);