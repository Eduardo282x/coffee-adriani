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
    totalBsInUSD?: number;
    total?: number;
    count?: number;
}

const renderMoneyBlock = ({ label, totalBs, totalUSD, totalBsInUSD, total, count }: MoneyBlock) => (
    <div className="border-2 border-gray-300 rounded-md p-3 space-y-1">
        <p className="font-bold">{label}</p>
        <div className="grid grid-cols-2 gap-1 text-sm">
            {totalBs !== undefined && (
                <>
                    <span className="text-gray-900">Transferencia/Pago Movil</span>
                    {totalBsInUSD == undefined && (
                        <span className="text-right">{formatOnlyNumberWithDots(totalBs)} Bs</span>
                    )}
                    {totalBsInUSD !== undefined && (
                        <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                            <span className="text-right">{formatOnlyNumberWithDots(totalBs)} Bs</span>
                            {/* <LuEqualApproximately className="text-gray-500" /> */}
                            <span className="text-gray-600">({formatOnlyNumberWithDots(totalBsInUSD)} $)</span>
                        </div>
                    )}
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
                <div className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md absolute top-10 -right-140 text-sm w-220 max-h-[70vh] overflow-y-auto">
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
                                    <p className="font-bold">Total de pagos</p>
                                    <p>{statistics.counts.total}</p>
                                </div>
                                <div className="border-2 border-gray-300 rounded-md p-3">
                                    <p className="font-bold">Pagos Asociados</p>
                                    <p>{statistics.counts.associated}</p>
                                </div>
                                <div className="border-2 border-gray-300 rounded-md p-3">
                                    <p className="font-bold">Pagos Sin asociar</p>
                                    <p>{statistics.counts.unassociated}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
