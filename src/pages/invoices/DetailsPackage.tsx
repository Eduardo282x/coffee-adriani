import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DetPackage } from "@/interfaces/invoice.interface";

interface DetailsPackageProps {
    detPackage: DetPackage[]
}

export const DetailsPackage = ({ detPackage }: DetailsPackageProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button className="bg-[#6f4e37] text-white hover:bg-[#7c5a43]">Detalles</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {detPackage && detPackage.map((item: DetPackage, index: number) => (
                    <DropdownMenuItem key={index}>{item.product.name}: {item.totalQuantity}</DropdownMenuItem>
                ))}

                {detPackage.length == 0 && (
                    <p className="text-center">Sin detalles</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
