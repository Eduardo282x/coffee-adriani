import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumberWithDots } from "@/hooks/formaters";
import { DetPackage, PaymentsInvoices } from "@/interfaces/invoice.interface";

interface DetailsPackageProps {
    detPackage: DetPackage[]
}

export const DetailsPackage = ({ detPackage }: DetailsPackageProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <Button className="bg-[#6f4e37] text-white hover:bg-[#7c5a43]">Detalles</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[30rem]">
                <DropdownMenuItem className="grid grid-cols-5 gap-1" onSelect={(e) => e.preventDefault()}>
                    <p className="font-bold col-span-2">Producto</p>
                    <p className="font-bold">Despachado</p>
                    <p className="font-bold">Pagados</p>
                    <p className="font-bold">Restante</p>
                </DropdownMenuItem>
                {detPackage && detPackage.map((item: DetPackage, index: number) => (
                    <DropdownMenuItem className="grid grid-cols-5 gap-1" key={index} onSelect={(e) => e.preventDefault()}>
                        <p className=" col-span-2">{item.product.name} {item.product.presentation}</p>
                        <p className="">{item.totalQuantity.toFixed(4)}</p>
                        <p className="">{item.paidQuantity.toFixed(4)}</p>
                        <p className="">{item.total.toFixed(4)}</p>
                        </DropdownMenuItem>
                ))}
                {detPackage.length == 0 && (
                    <p className="text-center">Sin detalles</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

interface DetailsPaymentsProps {
    payments: PaymentsInvoices
}

export const DetailsPayments = ({ payments }: DetailsPaymentsProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <Button className="bg-[#6f4e37] text-white hover:bg-[#7c5a43]">Dinero</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" className="mr-6">
                <DropdownMenuItem className="flex justify-between" onSelect={(e) => e.preventDefault()}><span className="font-bold">Total:</span> {formatNumberWithDots(payments.total.toFixed(2), '','$')}</DropdownMenuItem>
                {/* <DropdownMenuItem className="flex justify-between" onSelect={(e) => e.preventDefault()}><span className="font-bold">Pendiente:</span> {formatNumberWithDots(payments.totalPending.toFixed(2), '','$')}</DropdownMenuItem> */}
                <DropdownMenuItem className="flex justify-between" onSelect={(e) => e.preventDefault()}><span className="font-bold">Pagado:</span> {formatNumberWithDots(payments.debt.toFixed(2), '','$')}</DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between" onSelect={(e) => e.preventDefault()}><span className="font-bold">Pendiente:</span> {formatNumberWithDots(payments.remaining.toFixed(2), '','$')}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
