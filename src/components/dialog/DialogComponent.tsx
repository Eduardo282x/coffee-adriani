import { FC } from "react";
import { DialogHeader, Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface DialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    className: string;
    label1: string;
    label2: string;
    isEdit: boolean;
    children: React.ReactNode;
}

export const DialogComponent: FC<DialogProps> = ({ open, setOpen, className, isEdit, label1, label2, children }) => {

    // const handleOpenChange = (isOpen: boolean) => {
    //     if (!isOpen) {
    //         // Si el dialog se cierra, mover el foco al body
    //         (document.activeElement as HTMLElement)?.blur();
    //     }
    //     setOpen(isOpen);
    // };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setTimeout(() => {
                // Intenta mover el foco a un botón principal o al body
                const mainBtn = document.querySelector('button, [tabindex]:not([tabindex="-1"])');
                if (mainBtn) {
                    (mainBtn as HTMLElement).focus();
                } else {
                    (document.body as HTMLElement).focus();
                }
            }, 0);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange} modal>
            <DialogContent forceMount className={className}>
                <DialogHeader>
                    <DialogTitle className='text-center'>
                        {isEdit ? label1 : label2}
                    </DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
