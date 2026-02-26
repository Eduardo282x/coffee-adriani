import { FC } from "react";

interface InventoryCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>,
    color: string;
}

export const InventoryCards: FC<InventoryCardProps> = ({ title, value, description, icon: Icon, color }) => {
    return (
        <div className="border bg-white px-4 py-2 rounded-xl">
            <div className="flex flex-row items-center justify-between">
                <p className="font-bold text-[#6f4e37]">{title}</p>
                <div className={`rounded-full p-2 ${color}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div>
                <div className="text-xl font-semibold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}
