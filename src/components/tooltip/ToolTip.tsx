import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { FC } from "react";

interface ToolTipProps {
    tooltip: string;
    children: React.ReactNode;
    position?: TooltipPosition;
    className?: string;
}

type TooltipPosition = "bottom" | "top" | "right" | "left" | undefined;

export const ToolTip: FC<ToolTipProps> = ({ tooltip, children, position, className }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={`${className}`} asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={position}>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
