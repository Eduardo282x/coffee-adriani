import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { administrationFilterStore } from "@/store/administrationFilterStore"

export const FilterBadges = () => {
    const productTypeSelected = administrationFilterStore((s) => s.productTypeSelected);
    const dateRange = administrationFilterStore((s) => s.dateRange);
    const setProductTypeSelected = administrationFilterStore((s) => s.setProductTypeSelected);
    const setDateRange = administrationFilterStore((s) => s.setDateRange);

    const badges: { key: string; label: string; onClear: () => void }[] = [];

    if (productTypeSelected) {
        badges.push({
            key: 'type',
            label: `Producto: ${productTypeSelected}`,
            onClear: () => setProductTypeSelected('')
        });
    }
    if (dateRange) {
        const label = `Fecha: ${dateRange.from ? dateRange.from.toLocaleDateString() : ''}${dateRange.to ? ` - ${dateRange.to.toLocaleDateString()}` : ''}`;
        badges.push({ key: 'date', label, onClear: () => setDateRange(undefined) });
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
