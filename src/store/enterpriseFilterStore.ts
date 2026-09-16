import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DateRange } from 'react-day-picker'

interface EnterpriseFilterState {
    search: string;
    supplierId: string;
    dateStart: DateRange | undefined;
    setSearch: (value: string) => void;
    setSupplierId: (value: string) => void;
    setDateStart: (value: DateRange | undefined) => void;
    resetFilters: () => void;
}

const defaultFilters = {
    search: '',
    supplierId: '',
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

export const enterpriseFilterStore = create<EnterpriseFilterState>()(
    persist(
        (set) => ({
            ...defaultFilters,
            setSearch: (search) => set({ search }),
            setSupplierId: (supplierId) => set({ supplierId }),
            setDateStart: (dateStart) => set({ dateStart }),
            resetFilters: () => set({ ...defaultFilters }),
        }),
        {
            name: 'enterprise-filters',
            partialize: (state) => ({
                search: state.search,
                supplierId: state.supplierId,
                dateStart: serializeDateRange(state.dateStart),
            }),
            merge: (persisted, current) => {
                const data = (persisted ?? {}) as Partial<EnterpriseFilterState>;
                return {
                    ...current,
                    ...data,
                    dateStart: deserializeDateRange(data.dateStart as { from?: string; to?: string } | undefined),
                };
            },
        }
    )
);
