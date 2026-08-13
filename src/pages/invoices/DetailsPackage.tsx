import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";
import { DetPackage, PaymentsInvoices } from "@/interfaces/invoice.interface";

interface DetailsPackageProps {
    detPackage: DetPackage[];
    detPackageLost: DetPackage[];
    packagePaid: number;
    packageLostTotal: number;
    packagePaidBS: number;
    packagePaidUSD: number;
}

export const DetailsPackage = ({ detPackage, detPackageLost, packagePaid, packagePaidBS, packagePaidUSD, packageLostTotal }: DetailsPackageProps) => {
    const [open, setOpen] = useState(false);

    const calculateTotalDispatch = () => {
        const total = detPackage.reduce((acc, sum) => acc + Number(sum.totalQuantity), 0)
        return total;
    }
    const calculateTotalPaid = () => {
        const total = detPackage.reduce((acc, sum) => acc + Number(sum.paidQuantity), 0)
        return total;
    }
    const calculateTotalPending = () => {
        const total = detPackage.reduce((acc, sum) => acc + Number(sum.pendingQuantity), 0)
        return total;
    }

    const renderTable = (items: DetPackage[]) => (
        <div className="grid grid-cols-5 gap-1">
            <p className="font-bold col-span-2">Producto</p>
            <p className="font-bold">Despachado</p>
            <p className="font-bold">Pagados</p>
            <p className="font-bold">Restante</p>
            {items && items.map((item: DetPackage, index: number) => (
                <div className="col-span-5 grid grid-cols-5 gap-1" key={index}>
                    <p className="col-span-2">{item.product}</p>
                    <p className="text-right">{formatOnlyNumberWithDots(item.totalQuantity, 4)}</p>
                    <p className="text-right">{formatOnlyNumberWithDots(item.paidQuantity, 4)}</p>
                    <p className="text-right">{formatOnlyNumberWithDots(item.pendingQuantity, 4)}</p>
                </div>
            ))}
            <div className="col-span-5 grid grid-cols-5 gap-1 border-t-2 pt-2 font-bold">
                <p className="col-span-2">Total</p>
                <p className="text-right">{formatOnlyNumberWithDots(calculateTotalDispatch(), 4)}</p>
                <p className="text-right">{formatOnlyNumberWithDots(calculateTotalPaid(), 4)}</p>
                <p className="text-right">{formatOnlyNumberWithDots(calculateTotalPending(), 4)}</p>
            </div>
            {items.length == 0 && (
                <p className="col-span-5 text-center">Sin detalles</p>
            )}
        </div>
    );

    const renderTableLost = (items: DetPackage[]) => (
        <div className="grid grid-cols-3 gap-1">
            <p className="font-bold col-span-2">Producto</p>
            <p className="font-bold">Cantidad</p>
            {items && items.map((item: DetPackage, index: number) => (
                <div className="col-span-3 grid grid-cols-3 gap-1" key={index}>
                    <p className="col-span-2">{item.product}</p>
                    <p>{formatOnlyNumberWithDots(item.totalQuantity, 4)}</p>
                </div>
            ))}
            {items.length == 0 && (
                <p className="col-span-2 text-center">Sin detalles</p>
            )}
        </div>
    );

    return (
        <div className="relative">
            <Button onClick={() => setOpen(!open)} className="bg-[#6f4e37] text-white hover:bg-[#7c5a43]">Detalles</Button>
            {open && (
                <div className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md absolute top-10 -right-110 text-sm w-200">
                    <div className="grid grid-cols-4 gap-1 border-b-2 pb-2 px-2 py-1.5 select-none">
                        <p className="font-bold">Total de Bultos</p>
                        <p className="font-bold">Bultos Pagos BS</p>
                        <p className="font-bold">Bultos Pagos USD</p>
                        <p className="font-bold">Total Bultos Perdidos</p>
                        <p className="">{formatOnlyNumberWithDots(packagePaid)}</p>
                        <p className="">{formatOnlyNumberWithDots(packagePaidBS)}</p>
                        <p className="">{formatOnlyNumberWithDots(packagePaidUSD)}</p>
                        <p className="">{formatOnlyNumberWithDots(packageLostTotal)}</p>
                    </div>

                    <div className="flex items-start justify-start gap-3 w-full px-2 py-1.5 select-none">
                        <div className="w-3/4 border-2 border-gray-300 rounded-md p-3 space-y-2">
                            {/* <p className="font-bold">Detalles</p> */}
                            {renderTable(detPackage)}
                        </div>
                        <div className="border-2 border-gray-300 rounded-md p-3 space-y-2">
                            {/* <p className="font-bold">Perdidos</p> */}
                            {renderTableLost(detPackageLost)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

interface DetailsPaymentsProps {
    payments: PaymentsInvoices
}

export const DetailsPayments = ({ payments }: DetailsPaymentsProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <Button onClick={() => setOpen(!open)} className="bg-[#6f4e37] text-white hover:bg-[#7c5a43]">Dinero</Button>
            {open && (
                <div className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md mr-6 absolute top-10 text-sm w-54 -right-6">
                    <div className="flex justify-between rounded-sm px-2 py-1.5 select-none"><span className="font-bold">Total:</span> {formatOnlyNumberWithDots(payments.total, 4)} $</div>
                    {/* <div className="flex justify-between rounded-sm px-2 py-1.5 select-none"><span className="font-bold">Pendiente:</span> {formatOnlyNumberWithDots(payments.totalPending, 4)} $</div> */}
                    <div className="flex justify-between rounded-sm px-2 py-1.5 select-none"><span className="font-bold">Pagado:</span> {formatOnlyNumberWithDots(payments.remaining, 4)} $</div>
                    <div className="flex justify-between rounded-sm px-2 py-1.5 select-none"><span className="font-bold">Pendiente:</span> {formatOnlyNumberWithDots(payments.totalPending, 4)} $</div>
                </div>
            )}
        </div>
    )
}
