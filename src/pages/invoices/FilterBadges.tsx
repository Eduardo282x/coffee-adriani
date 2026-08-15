import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { blockStore } from "@/store/clientStore"
import { invoiceFilterStore } from "@/store/invoiceFilterStore"

const defaultTypeProduct = 'Cafe';

export const FilterBadges = () => {
    const search = invoiceFilterStore((s) => s.search);
    const selectedZone = invoiceFilterStore((s) => s.selectedZone);
    const selectedBlock = invoiceFilterStore((s) => s.selectedBlock);
    const selectedStatus = invoiceFilterStore((s) => s.selectedStatus);
    const selectedTypeProduct = invoiceFilterStore((s) => s.selectedTypeProduct);
    const dateStart = invoiceFilterStore((s) => s.dateStart);
    const setSearch = invoiceFilterStore((s) => s.setSearch);
    const setSelectedZone = invoiceFilterStore((s) => s.setSelectedZone);
    const setSelectedBlock = invoiceFilterStore((s) => s.setSelectedBlock);
    const setSelectedStatus = invoiceFilterStore((s) => s.setSelectedStatus);
    const setSelectedTypeProduct = invoiceFilterStore((s) => s.setSelectedTypeProduct);
    const setDateStart = invoiceFilterStore((s) => s.setDateStart);

    const { blocks } = blockStore();
    const blockName = blocks?.allBlocks.find((b) => b.id.toString() === selectedBlock)?.name;

    const badges: { key: string; label: string; onClear: () => void }[] = [];

    if (search) {
        badges.push({
            key: 'search',
            label: `Buscar: ${search.length > 20 ? `${search.slice(0, 20)}…` : search}`,
            onClear: () => setSearch('')
        });
    }
    if (selectedZone && selectedZone !== 'all') {
        badges.push({ key: 'zone', label: `Zona: ${selectedZone}`, onClear: () => setSelectedZone('all') });
    }
    if (selectedBlock && selectedBlock !== 'all') {
        badges.push({
            key: 'block',
            label: `Bloque: ${blockName ?? selectedBlock}`,
            onClear: () => setSelectedBlock('all')
        });
    }
    if (selectedStatus && selectedStatus !== 'all') {
        badges.push({ key: 'status', label: `Estado: ${selectedStatus}`, onClear: () => setSelectedStatus('all') });
    }
    if (selectedTypeProduct && selectedTypeProduct !== defaultTypeProduct) {
        badges.push({
            key: 'type',
            label: `Producto: ${selectedTypeProduct}`,
            onClear: () => setSelectedTypeProduct(defaultTypeProduct)
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