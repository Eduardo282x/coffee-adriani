import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DateRange } from 'react-day-picker'

interface ItemsFilterState {
    productTypeSelected: string;
    dateRange: DateRange | undefined;
    setProductTypeSelected: (value: string) => void;
    setDateRange: (value: DateRange | undefined) => void;
    resetFilters: () => void;
}

const getDefaultDateRange = (): DateRange => {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() + (day === 0 ? -6 : 1 - day));
    monday.setHours(0, 0, 0, 0);
    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);
    saturday.setHours(23, 59, 59, 999);
    return {
        from: monday,
        to: saturday,
    };
};

const defaultFilters = {
    productTypeSelected: 'Cafe',
    dateRange: getDefaultDateRange() as DateRange | undefined,
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

export const itemsFilterStore = create<ItemsFilterState>()(
    persist(
        (set) => ({
            ...defaultFilters,
            setProductTypeSelected: (productTypeSelected) => set({ productTypeSelected }),
            setDateRange: (dateRange) => set({ dateRange: dateRange ?? getDefaultDateRange() }),
            resetFilters: () => set({ ...defaultFilters }),
        }),
        {
            name: 'items-filters',
            partialize: (state) => ({
                productTypeSelected: state.productTypeSelected,
                dateRange: serializeDateRange(state.dateRange),
            }),
            merge: (persisted, current) => {
                const data = (persisted ?? {}) as Partial<ItemsFilterState>;
                return {
                    ...current,
                    ...data,
                    dateRange: deserializeDateRange(data.dateRange as { from?: string; to?: string } | undefined),
                };
            },
        }
    )
);
