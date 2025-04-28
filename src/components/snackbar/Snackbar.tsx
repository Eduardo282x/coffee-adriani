import { Check, X } from "lucide-react";
import { FC } from "react"

interface SnackbarProps {
    success: boolean;
    message: string;
}

export const Snackbar: FC<SnackbarProps> = ({ success, message }) => {
    return (
        <div className={`animationOpacity flex items-center justify-center gap-3 ${success ? 'bg-green-600' : 'bg-red-600'} text-white font-semibold text-lg rounded-lg px-6 py-2`}>
            <span>{success ? <Check className="text-xl font-bold"/> : <X className="text-xl font-bold"/>}</span>
            <span>{message}</span>
        </div>
    )
}
