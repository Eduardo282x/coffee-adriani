import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";
import { PaymentStatisticsResponse } from "@/interfaces/payment.interface";

interface PaymentStatisticsDetailProps {
    statistics: PaymentStatisticsResponse;
}

interface MoneyBlock {
    label: string;
    totalBs?: number;
    totalUSD?: number;
    total?: number;
    count?: number;
}

const renderMoneyBlock = ({ label, totalBs, totalUSD, total, count }: MoneyBlock) => (
    <div className="border-2 border-gray-300 rounded-md p-3 space-y-1">
        <p className="font-bold">{label}</p>
        <div className="grid grid-cols-2 gap-1 text-sm">
            {totalBs !== undefined && (
                <>
                    <span className="text-gray-900">Transferencia/Pago Movil</span>
                    <span className="text-right">{formatOnlyNumberWithDots(totalBs)} Bs</span>
                </>
            )}
            {totalUSD !== undefined && (
                <>
                    <span className="text-gray-900">Dolares $:</span>
                    <span className="text-right">{formatOnlyNumberWithDots(totalUSD)} $</span>
                </>
            )}
            {total !== undefined && (
                <>
                    <span className="text-gray-900">Total:</span>
                    <span className="text-right">{formatOnlyNumberWithDots(total)} $</span>
                </>
            )}
            {count !== undefined && (
                <>
                    <span className="text-gray-900">Cantidad:</span>
                    <span className="text-right">{count}</span>
                </>
            )}
        </div>
    </div>
);

const SectionTitle = ({ title }: { title: string }) => (
    <p className="font-bold pb-1 mb-2">{title}</p>
);

export const PaymentStatisticsDetail = ({ statistics }: PaymentStatisticsDetailProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <Button onClick={() => setOpen(!open)} className="bg-[#6f4e37] text-white hover:bg-[#7c5a43]">Detalles</Button>
            {open && (
                <div className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md absolute top-10 -right-120 text-sm w-200 max-h-[70vh] overflow-y-auto">
                    <div className="p-3 space-y-4">
                        <div>
                            <SectionTitle title="Totales" />
                            <div className="grid grid-cols-2 gap-2">
                                {renderMoneyBlock({ label: 'Ingresos', totalBs: statistics.totals.totalBs, totalUSD: statistics.totals.totalUSD, total: statistics.totals.total })}
                                {renderMoneyBlock({ label: 'Pendiente', totalBs: statistics.totals.totalRemainingBs, totalUSD: statistics.totals.totalRemainingUSD, total: statistics.totals.remaining })}
                                {renderMoneyBlock({ label: 'Sin Asociar', total: statistics.totals.unassociatedAmount })}
                                {renderMoneyBlock({ label: 'Pérdidas', total: statistics.totalLost })}
                            </div>
                        </div>

                        <div>
                            <SectionTitle title="Gastos" />
                            <div className="grid grid-cols-2 gap-2">
                                {renderMoneyBlock({ label: 'Gastos', ...statistics.expenses })}
                                {renderMoneyBlock({ label: 'Personales', ...statistics.personalExpenses })}
                                {renderMoneyBlock({ label: 'Grupo (Gastos + Gastos Personales)', ...statistics.expensesGroup })}
                                {renderMoneyBlock({ label: 'Proveedores', ...statistics.supplier })}
                            </div>
                        </div>

                        <div>
                            <SectionTitle title="Conteos" />
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="border-2 border-gray-300 rounded-md p-3">
                                    <p className="font-bold">Total</p>
                                    <p>{statistics.counts.total}</p>
                                </div>
                                <div className="border-2 border-gray-300 rounded-md p-3">
                                    <p className="font-bold">Asociados</p>
                                    <p>{statistics.counts.associated}</p>
                                </div>
                                <div className="border-2 border-gray-300 rounded-md p-3">
                                    <p className="font-bold">Sin asociar</p>
                                    <p>{statistics.counts.unassociated}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <SectionTitle title="Valores" />
                            <div className="grid grid-cols-2 gap-2">
                                {renderMoneyBlock({ label: 'Originales', totalBs: statistics.valores.originals.totalAmountBs, totalUSD: statistics.valores.originals.totalAmountBsInUSD })}
                                {renderMoneyBlock({ label: 'Alter', totalBs: statistics.valores.alter.totalAmountBs, totalUSD: statistics.valores.alter.totalAmountBsInUSD })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
