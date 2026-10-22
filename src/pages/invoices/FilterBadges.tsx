import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { blockStore } from "@/store/clientStore"
import { invoiceFilterStore } from "@/store/invoiceFilterStore"
import { useOptimizedInventory } from "@/hooks/inventory.hook"

const defaultTypeProduct = 'Cafe';

export const FilterBadges = () => {
    const search = invoiceFilterStore((s) => s.search);
    const selectedZone = invoiceFilterStore((s) => s.selectedZone);
    const selectedBlock = invoiceFilterStore((s) => s.selectedBlock);
    const selectedStatuses = invoiceFilterStore((s) => s.selectedStatuses);
    const selectedTypeProduct = invoiceFilterStore((s) => s.selectedTypeProduct);
    const selectedProductIds = invoiceFilterStore((s) => s.selectedProductIds);
    const dateStart = invoiceFilterStore((s) => s.dateStart);
    const setSearch = invoiceFilterStore((s) => s.setSearch);
    const setSelectedZone = invoiceFilterStore((s) => s.setSelectedZone);
    const setSelectedBlock = invoiceFilterStore((s) => s.setSelectedBlock);
    const setSelectedStatuses = invoiceFilterStore((s) => s.setSelectedStatuses);
    const setSelectedTypeProduct = invoiceFilterStore((s) => s.setSelectedTypeProduct);
    const setSelectedProductIds = invoiceFilterStore((s) => s.setSelectedProductIds);
    const setDateStart = invoiceFilterStore((s) => s.setDateStart);

    const { blocks } = blockStore();
    const { inventory } = useOptimizedInventory({ enableHistory: false });
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
    selectedStatuses.forEach((status) => {
        badges.push({
            key: `status-${status}`,
            label: `Estado: ${status}`,
            onClear: () => setSelectedStatuses(selectedStatuses.filter((value) => value !== status))
        });
    });
    if (selectedTypeProduct && selectedTypeProduct !== defaultTypeProduct) {
        badges.push({
            key: 'type',
            label: `Producto: ${selectedTypeProduct}`,
            onClear: () => setSelectedTypeProduct(defaultTypeProduct)
        });
    }
    if (selectedProductIds.length > 0) {
        const productNames = selectedProductIds.map((productId) => {
            const product = inventory.find((item) => item.productId === productId)?.product;
            return product ? `${product.name} ${product.presentation}` : `#${productId}`;
        });
        const label = `${productNames.join(', ')}`;
        badges.push({
            key: 'products',
            label: `Productos: ${label.length > 40 ? `${label.slice(0, 40)}…` : label}`,
            onClear: () => setSelectedProductIds([])
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