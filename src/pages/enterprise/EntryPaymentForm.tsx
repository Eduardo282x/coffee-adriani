import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/datepicker/DatePicker";
import { Snackbar } from "@/components/snackbar/Snackbar";
import toast from "react-hot-toast";
import { IInventoryEntry } from "@/interfaces/inventory.interface";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";
import { EntryPaymentForm as EntryPaymentFormType } from "@/interfaces/inventory.interface";
import { AccountPay } from "@/interfaces/payment.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductDolar } from "@/hooks/product.hook";

interface EntryPaymentFormProps {
    entry: IInventoryEntry;
    accounts: AccountPay[];
    onSubmit: (data: EntryPaymentFormType) => void;
    onCancel: () => void;
}

export const EntryPaymentForm: FC<EntryPaymentFormProps> = ({ entry, accounts, onSubmit, onCancel }) => {
    const [amount, setAmount] = useState<number>(0);
    const [accountId, setAccountId] = useState<number>(0);
    const [reference, setReference] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());

    const { dolar } = useProductDolar();
    const dolarRate = Number(dolar?.dolar || 0);

    const remaining = Number(entry.remaining);

    const selectedAccount = useMemo(() => {
        return accounts.find(a => a.id === accountId);
    }, [accounts, accountId]);

    const isBS = selectedAccount?.method?.currency === 'BS';

    const convertedAmount = useMemo(() => {
        if (amount <= 0 || dolarRate <= 0) return 0;
        if (isBS) {
            return amount / dolarRate;
        }
        return amount * dolarRate;
    }, [amount, dolarRate, isBS]);

    const entryAmount = useMemo(() => {
        if (amount <= 0) return 0;
        if (isBS) {
            return dolarRate > 0 ? amount / dolarRate : 0;
        }
        return amount;
    }, [amount, isBS, dolarRate]);

    useEffect(() => {
        setAmount(0);
    }, [accountId]);

    const onSubmitForm = () => {
        if (amount <= 0) {
            toast.custom(<Snackbar success={false} message={"El monto debe ser mayor a 0"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }

        if (entryAmount <= 0) {
            toast.custom(<Snackbar success={false} message={"El monto de la entrada debe ser mayor a 0"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }

        if (entryAmount > remaining) {
            toast.custom(<Snackbar success={false} message={`El monto no puede exceder el saldo pendiente de $${remaining.toFixed(2)}`} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }

        if (accountId === 0) {
            toast.custom(<Snackbar success={false} message={"Seleccione una cuenta de pago"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }

        if (reference === '') {
            toast.custom(<Snackbar success={false} message={"Ingrese una referencia"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }

        onSubmit({
            amount: amount,
            accountId: accountId,
            reference: reference,
            description: description,
            paymentDate: paymentDate || new Date(),
            inventoryEntryId: entry.id,
            entryAmount: entryAmount
        });
    };

    return (
        <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Resumen de la Entrada</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Total:</span>
                        <p className="font-semibold">$ {formatOnlyNumberWithDots(entry.totalAmount)}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Pagado:</span>
                        <p className="font-semibold text-green-600">$ {formatOnlyNumberWithDots(entry.totalPaid)}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Pendiente:</span>
                        <p className="font-semibold text-red-600">$ {formatOnlyNumberWithDots(entry.remaining)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label>Cuenta de Pago</Label>
                    <Select
                        value={accountId === 0 ? '' : accountId.toString()}
                        onValueChange={(v) => setAccountId(Number(v))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione cuenta" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id.toString()}>
                                    {account.name} - {account.bank} ({account.method?.currency})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label>
                        Monto del Pago {isBS ? '(Bs)' : '($)'}
                    </Label>
                    <Input
                        className="w-full"
                        type="number"
                        min={0}
                        step={0.01}
                        value={amount || ''}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder={isBS ? "Monto en bolívares" : "Monto en dólares"}
                    />
                    {isBS && amount > 0 && dolarRate > 0 && (
                        <p className="text-xs text-gray-500">
                            Equivalente a: $ {convertedAmount.toFixed(2)}
                            {' '}(tasa: {formatOnlyNumberWithDots(dolarRate)} Bs/$)
                        </p>
                    )}
                    {!isBS && (
                        <p className="text-xs text-gray-500">
                            Máximo: $ {remaining.toFixed(2)}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-start justify-start gap-2">
                    <Label>Referencia</Label>
                    <Input
                        className="w-full"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Número de referencia"
                    />
                </div>

                <DatePicker
                    setDate={setPaymentDate}
                    date={paymentDate}
                    label="Fecha de Pago"
                    maxDate={new Date()}
                    minDate={new Date(2000, 0, 1)}
                />
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
                <Label>Descripción</Label>
                <Input
                    className="w-full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del pago"
                />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button onClick={onSubmitForm} variant="default" className="bg-[#6f4e37] hover:bg-[#5a3e2e] text-white">
                    Registrar Pago
                </Button>
            </div>
        </div>
    );
};
