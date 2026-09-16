import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useSuppliers } from "@/hooks/supplier.hook"
import { enterpriseFilterStore } from "@/store/enterpriseFilterStore"

export const FilterBadges = () => {
    const search = enterpriseFilterStore((s) => s.search);
    const supplierId = enterpriseFilterStore((s) => s.supplierId);
    const dateStart = enterpriseFilterStore((s) => s.dateStart);
    const setSearch = enterpriseFilterStore((s) => s.setSearch);
    const setSupplierId = enterpriseFilterStore((s) => s.setSupplierId);
    const setDateStart = enterpriseFilterStore((s) => s.setDateStart);

    const { suppliers } = useSuppliers();
    const supplierName = suppliers.find((s) => s.id.toString() === supplierId)?.name;

    const badges: { key: string; label: string; onClear: () => void }[] = [];

    if (search) {
        badges.push({
            key: 'search',
            label: `Buscar: ${search.length > 20 ? `${search.slice(0, 20)}…` : search}`,
            onClear: () => setSearch('')
        });
    }
    if (supplierId) {
        badges.push({
            key: 'supplier',
            label: `Proveedor: ${supplierName ?? supplierId}`,
            onClear: () => setSupplierId('')
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
