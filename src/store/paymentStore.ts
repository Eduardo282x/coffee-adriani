import { AccountPay, GroupAccounts } from '@/interfaces/payment.interface';
import { deletePaymentAccounts, getPaymentAccounts } from '@/services/payment.service';
import { create } from 'zustand'


interface PaymentState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    accounts: GroupAccounts;
    setAccounts: (accounts: GroupAccounts) => void;
    getAccountsApi: () => Promise<void>;
    deleteAccount: (id: number) => void;
}

export const accountStore = create<PaymentState>((set) => ({
    accounts: { allAccounts: [], accounts: [] },
    loading: false,
    setAccounts: (accounts: GroupAccounts) => { set(() => ({accounts}))},
    setLoading: (loading: boolean) => { (set(() => ({ loading }))) },
    getAccountsApi: async () => {
        set(() => ({ loading: true }))
        const response: AccountPay[] = await getPaymentAccounts();
        if (response && response.length > 0) {
            set(() => ({
                accounts: { accounts: response, allAccounts: response },
            }))
        }
        set(() => ({ loading: false }))
    },
    deleteAccount: async (id: number) => {
        await deletePaymentAccounts(id);
        set((state) => {
            const accountDeleted = state.accounts.allAccounts.filter((us: AccountPay) => us.id != id);
            return {
                accounts: { allAccounts: accountDeleted, accounts: accountDeleted }
            };
        });
    }
}))