import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DateRange } from 'react-day-picker'

export type CreditFilter = 'credit' | 'noCredit' | 'all';
export type AssociationFilter = 'associated' | 'unassociated' | 'all';

interface PaymentFilterState {
    search: string;
    selectedAccount: string;
    selectedMethod: string;
    selectCredits: CreditFilter;
    typeProduct: string;
    typeDescription: string;
    selectedAssociation: AssociationFilter;
    accountType: string;
    dateStart: DateRange | undefined;
    setSearch: (value: string) => void;
    setSelectedAccount: (value: string) => void;
    setSelectedMethod: (value: string) => void;
    setSelectCredits: (value: CreditFilter) => void;
    setTypeProduct: (value: string) => void;
    setTypeDescription: (value: string) => void;
    setSelectedAssociation: (value: AssociationFilter) => void;
    setAccountType: (value: string) => void;
    setDateStart: (value: DateRange | undefined) => void;
    resetFilters: () => void;
}

const defaultFilters = {
    search: '',
    selectedAccount: 'all',
    selectedMethod: 'all',
    selectCredits: 'all' as CreditFilter,
    typeProduct: 'all',
    typeDescription: 'all',
    selectedAssociation: 'all' as AssociationFilter,
    accountType: 'INCOME',
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

export const paymentFilterStore = create<PaymentFilterState>()(
    persist(
        (set) => ({
            ...defaultFilters,
            setSearch: (search) => set({ search }),
            setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
            setSelectedMethod: (selectedMethod) => set({ selectedMethod }),
            setSelectCredits: (selectCredits) => set({ selectCredits }),
            setTypeProduct: (typeProduct) => set({ typeProduct }),
            setTypeDescription: (typeDescription) => set({ typeDescription }),
            setSelectedAssociation: (selectedAssociation) => set({ selectedAssociation }),
            setAccountType: (accountType) => set({ accountType }),
            setDateStart: (dateStart) => set({ dateStart }),
            resetFilters: () => set({ ...defaultFilters }),
        }),
        {
            name: 'payment-filters',
            partialize: (state) => ({
                search: state.search,
                selectedAccount: state.selectedAccount,
                selectedMethod: state.selectedMethod,
                selectCredits: state.selectCredits,
                typeProduct: state.typeProduct,
                typeDescription: state.typeDescription,
                selectedAssociation: state.selectedAssociation,
                accountType: state.accountType,
                dateStart: serializeDateRange(state.dateStart),
            }),
            merge: (persisted, current) => {
                const data = (persisted ?? {}) as Partial<PaymentFilterState>;
                return {
                    ...current,
                    ...data,
                    dateStart: deserializeDateRange(data.dateStart as { from?: string; to?: string } | undefined),
                };
            },
        }
    )
);