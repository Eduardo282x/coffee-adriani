import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { X } from "lucide-react"
import { getPaymentAccounts, getPaymentMethod } from "@/services/payment.service"
import { AccountPay, Method } from "@/interfaces/payment.interface"
import { paymentFilterStore } from "@/store/paymentFilterStore"

const defaultAccountType = 'INCOME';

const accountTypeLabels: Record<string, string> = {
    INCOME: 'Entrada',
    SUPPLIER: 'Proveedores',
    EXPENSE: 'Gastos/Salidas',
    PERSONAL_EXPENSES: 'Gastos Personales',
};

export const FilterBadges = () => {
    const search = paymentFilterStore((s) => s.search);
    const selectedAccount = paymentFilterStore((s) => s.selectedAccount);
    const selectedMethod = paymentFilterStore((s) => s.selectedMethod);
    const selectCredits = paymentFilterStore((s) => s.selectCredits);
    const typeProduct = paymentFilterStore((s) => s.typeProduct);
    const typeDescription = paymentFilterStore((s) => s.typeDescription);
    const selectedAssociation = paymentFilterStore((s) => s.selectedAssociation);
    const accountType = paymentFilterStore((s) => s.accountType);
    const dateStart = paymentFilterStore((s) => s.dateStart);
    const setSearch = paymentFilterStore((s) => s.setSearch);
    const setSelectedAccount = paymentFilterStore((s) => s.setSelectedAccount);
    const setSelectedMethod = paymentFilterStore((s) => s.setSelectedMethod);
    const setSelectCredits = paymentFilterStore((s) => s.setSelectCredits);
    const setTypeProduct = paymentFilterStore((s) => s.setTypeProduct);
    const setTypeDescription = paymentFilterStore((s) => s.setTypeDescription);
    const setSelectedAssociation = paymentFilterStore((s) => s.setSelectedAssociation);
    const setAccountType = paymentFilterStore((s) => s.setAccountType);
    const setDateStart = paymentFilterStore((s) => s.setDateStart);

    const { data: accounts } = useQuery({
        queryKey: ['payment-accounts'],
        queryFn: () => getPaymentAccounts() as Promise<AccountPay[]>,
        staleTime: Infinity,
    });

    const { data: methods } = useQuery({
        queryKey: ['payment-methods'],
        queryFn: () => getPaymentMethod() as Promise<Method[]>,
        staleTime: Infinity,
    });

    const account = accounts?.find((a) => a.id.toString() === selectedAccount);
    const method = methods?.find((m) => m.id.toString() === selectedMethod);

    const badges: { key: string; label: string; onClear: () => void }[] = [];

    if (search) {
        badges.push({
            key: 'search',
            label: `Buscar: ${search.length > 20 ? `${search.slice(0, 20)}…` : search}`,
            onClear: () => setSearch('')
        });
    }
    if (selectedAccount && selectedAccount !== 'all') {
        badges.push({
            key: 'account',
            label: `Cuenta: ${account ? `${account.name} ${account.bank}` : selectedAccount}`,
            onClear: () => setSelectedAccount('all')
        });
    }
    if (selectedMethod && selectedMethod !== 'all') {
        badges.push({
            key: 'method',
            label: `Método: ${method?.name ?? selectedMethod}`,
            onClear: () => setSelectedMethod('all')
        });
    }
    if (selectCredits && selectCredits !== 'all') {
        badges.push({
            key: 'credit',
            label: `Abonos: ${selectCredits === 'credit' ? 'Con abonos' : 'Sin abonos'}`,
            onClear: () => setSelectCredits('all')
        });
    }
    if (typeProduct && typeProduct !== 'all') {
        badges.push({ key: 'type', label: `Producto: ${typeProduct}`, onClear: () => setTypeProduct('all') });
    }
    if (typeDescription && typeDescription !== 'all') {
        badges.push({
            key: 'typeDescription',
            label: `Gasto: ${typeDescription}`,
            onClear: () => setTypeDescription('all')
        });
    }
    if (selectedAssociation && selectedAssociation !== 'all') {
        badges.push({
            key: 'association',
            label: `Asociación: ${selectedAssociation === 'associated' ? 'Asociados' : 'Sin Asociar'}`,
            onClear: () => setSelectedAssociation('all')
        });
    }
    if (accountType && accountType !== defaultAccountType) {
        badges.push({
            key: 'accountType',
            label: `Tipo cuenta: ${accountTypeLabels[accountType] ?? accountType}`,
            onClear: () => setAccountType(defaultAccountType)
        });
    }
    if (dateStart) {
        const label = `Fecha: ${dateStart.from ? dateStart.from.toLocaleDateString() : ''}${dateStart.to ? ` - ${dateStart.to.toLocaleDateString()}` : ''}`;
        badges.push({ key: 'date', label, onClear: () => setDateStart(undefined) });
    }

    if (badges.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {badges.map((badge) => (
                <Badge
                    key={badge.key}
                    variant="secondary"
                    className="rounded-full gap-1.5 py-1 text-white bg-[#6f4e37] hover:bg-[#7e5b41]"
                >
                    {badge.label}
                    <button onClick={badge.onClear} className="hover:text-red-600 cursor-pointer">
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
        </div>
    );
};