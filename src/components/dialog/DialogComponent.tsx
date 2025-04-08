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
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={className}>
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
