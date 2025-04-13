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
        <div className="border bg-white p-4 rounded-xl">
            <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-medium">{title}</p>
                <div className={`rounded-full p-2 ${color}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}
