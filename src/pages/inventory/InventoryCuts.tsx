import { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { TableComponent } from "@/components/table/TableComponent";
import { useInventoryCut } from "@/hooks/inventory.hook";
import { InventoryCut } from "@/interfaces/inventory.interface";
import { inventoryCutColumns, inventoryCutDetailColumns } from "./inventory.data";

interface InventoryCutsProps {
    typeProduct?: string;
    dateRange?: DateRange | null;
}

export const InventoryCuts = ({ typeProduct, dateRange }: InventoryCutsProps) => {
    const {
        cuts,
        isLoadingCuts,
        setCutType,
        setCutDateRangeFilter,
    } = useInventoryCut();

    useEffect(() => {
        setCutType(typeProduct ?? 'ALL');
    }, [typeProduct, setCutType]);

    useEffect(() => {
        setCutDateRangeFilter(dateRange ?? undefined);
    }, [dateRange, setCutDateRangeFilter]);

    const renderCutDetail = (cut: InventoryCut) => (
        <div className="space-y-4">
            <div>
                <h4 className="text-sm font-semibold text-[#6f4e37] mb-2">Inventario Inicial</h4>
                <TableComponent
                    dataBase={cut.initialDetail}
                    columns={inventoryCutDetailColumns}
                    hidePaginator={true}
                />
            </div>
            {cut.closeDetail && cut.closeDetail.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-[#6f4e37] mb-2">Inventario Cierre</h4>
                    <TableComponent
                        dataBase={cut.closeDetail}
                        columns={inventoryCutDetailColumns}
                        hidePaginator={true}
                    />
                </div>
            )}
        </div>
    );

    return (
        <TableComponent
            loading={isLoadingCuts}
            key="inventory-cuts"
            columns={inventoryCutColumns}
            dataBase={cuts}
            isExpansible={true}
            renderRow={(cut) => renderCutDetail(cut)}
        />
    );
};
