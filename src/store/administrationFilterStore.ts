import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DateRange } from 'react-day-picker'

export type OptionAdministration = 'pay' | 'invoices' | 'earns' | 'paymentsNoAssociated';
export type OptionInvoice = 'invoicesAll' | 'invoicesGift' | 'invoicesRate' | 'invoicesExpense';

interface AdministrationFilterState {
    productTypeSelected: string;
    dateRange: DateRange | undefined;
    option: OptionAdministration;
    optionInvoice: OptionInvoice;
    setProductTypeSelected: (value: string) => void;
    setDateRange: (value: DateRange | undefined) => void;
    setOption: (value: OptionAdministration) => void;
    setOptionInvoice: (value: OptionInvoice) => void;
    resetFilters: () => void;
}

const getDefaultDateRange = (): DateRange => {
    const now = new Date();
    return {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
    };
};

const defaultFilters = {
    productTypeSelected: '',
    dateRange: getDefaultDateRange() as DateRange | undefined,
    option: 'earns' as OptionAdministration,
    optionInvoice: 'invoicesAll' as OptionInvoice,
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

export const administrationFilterStore = create<AdministrationFilterState>()(
    persist(
        (set) => ({
            ...defaultFilters,
            setProductTypeSelected: (productTypeSelected) => set({ productTypeSelected }),
            setDateRange: (dateRange) => set({ dateRange: dateRange ?? getDefaultDateRange() }),
            setOption: (option) => set({ option }),
            setOptionInvoice: (optionInvoice) => set({ optionInvoice }),
            resetFilters: () => set({ ...defaultFilters }),
        }),
        {
            name: 'administration-filters',
            partialize: (state) => ({
                productTypeSelected: state.productTypeSelected,
                dateRange: serializeDateRange(state.dateRange),
                option: state.option,
                optionInvoice: state.optionInvoice,
            }),
            merge: (persisted, current) => {
                const data = (persisted ?? {}) as Partial<AdministrationFilterState>;
                return {
                    ...current,
                    ...data,
                    dateRange: deserializeDateRange(data.dateRange as { from?: string; to?: string } | undefined),
                };
            },
        }
    )
);
