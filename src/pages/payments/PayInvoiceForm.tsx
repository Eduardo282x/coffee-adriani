import { FromProps, IOptions } from '@/interfaces/form.interface'
import { FC, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IPayInvoiceForm, IPayments } from '@/interfaces/payment.interface';
import { formatNumberWithDots } from '@/hooks/formaters';
import { getInvoiceUnordered } from '@/services/invoice.service';
import { Autocomplete } from '@/components/autocomplete/Autocomplete';
import { IInvoice, IInvoiceForPay } from '@/interfaces/invoice.interface';
import { TableComponent } from '@/components/table/TableComponent';
import { paymentsFilterColumns } from './payment.data';
import toast from 'react-hot-toast';
import { Snackbar } from '@/components/snackbar/Snackbar';
// import { IDolar } from '@/interfaces/product.interface';

// interface PayInvoiceFormProps extends FromProps {
//     dolar: IDolar | undefined
// }

export const PayInvoiceForm: FC<FromProps> = ({ onSubmit, data }) => {
    const [infoPayment, setInfoPayment] = useState<IPayments>(data);
    const [allInvoices, setAllInvoices] = useState<IOptions[]>([]);
    // const [cash, setCash] = useState<boolean>(false);
    const [currencyBs, setCurrencyBs] = useState<boolean>(false);
    const [invoicesForPay, setInvoicesForPay] = useState<IInvoiceForPay[]>([]);
    const [invoices, setInvoices] = useState<IInvoice[]>([]);
    const [restPayment, setRestPayment] = useState<number>(0);

    useEffect(() => {
        setCurrencyBs(data.account.method.currency === 'BS');
        // setCash(data.account.method.currency === 'USD' && data.account.method.name === 'Efectivo $')
        setInfoPayment(data);
        setRestPayment(Number(data.remainingUSD))
    }, [data])

    useEffect(() => {
        getInvoiceApi()
    }, [])

    const getInvoiceApi = async () => {
        const response: IInvoice[] = await getInvoiceUnordered();
        setInvoices(response);
        const parseData: IOptions[] = response.map((inv: IInvoice) => (
            {
                label: `Factura #${inv.controlNumber} - ${inv.client?.name}`,
                value: inv.id.toString(),
            }
        ));
        setAllInvoices(parseData);
    }

    const setPayment = (payment: IPayments, remaining: boolean): string => {
        if (payment.account.method.currency === 'USD') {
            return formatNumberWithDots(remaining ? data.remaining : data.amountUSD, '', ' $')
        } else {
            return formatNumberWithDots(remaining ? data.remaining : data.amountBs, '', ' Bs');
        }
    }

    const setPaymentRest = (payment: IPayments, remaining: boolean): string => {
        if (payment.account.method.currency === 'USD') {
            return formatNumberWithDots(remaining ? data.remaining : data.amountUSD, '', ' $')
        } else {
            return formatNumberWithDots(remaining ? data.remaining : data.amountBs, '', ' Bs');
        }
    }

    const selectInvoice = (value: string) => {
        const findInvoice: IInvoiceForPay = invoices.find((inv) => inv.id.toString() === value) as IInvoiceForPay;
        if (!findInvoice) return;

        const duplicateInvoice = invoicesForPay.find(item => item.id.toString() == value);
        if (duplicateInvoice) {
            return;
        }

        // const alreadyUsedUSD = invoicesForPay.reduce((acc, inv) => acc + (currencyBs ? Number(inv.totalPaid) / dolar : Number(inv.totalPaid)), 0);
        const alreadyUsedUSD = invoicesForPay.reduce((acc, inv) => acc + (Number(inv.totalPaid)), 0);

        const totalAvailable = Number(infoPayment.remainingUSD);

        const remaining = totalAvailable - alreadyUsedUSD;

        // Si no hay fondos suficientes, no se agrega
        if (remaining <= 0) {
            toast.custom(<Snackbar success={false} message='No se pueden asignar mas facturas a este pago'></Snackbar>, {
                position: 'bottom-center',
                duration: 3000,
            })
            return;
        }

        // const parseRemaining = currencyBs ? Number(remaining / Number(dolar?.dolar)).toFixed(2) : remaining;
        // Cuánto se puede pagar a esta factura sin pasarse
        const totalPaid = Math.min(Number(findInvoice.remaining), restPayment);

        // const setCurrencyPay = currencyBs ? Number(totalPaid * dolar).toFixed(2) : totalPaid.toFixed(2);
        const setCurrencyPay = totalPaid.toFixed(2);

        const newItem = {
            ...findInvoice,
            totalPaid: setCurrencyPay,
            currency: infoPayment.account.method.currency,
            // totalAmountBs: Number(Number(dolar?.dolar) * Number(findInvoice.totalAmount)).toFixed(2)
        }

        if (!currencyBs) {
            newItem.totalAmount = Number(findInvoice.specialPrice);
            newItem.remaining = Number(findInvoice.specialPrice);
            newItem.totalPaid = Number(findInvoice.specialPrice).toFixed(2);
        }

        setInvoicesForPay(prev => [
            ...prev,
            newItem
        ]);

        setRestPayment(totalAvailable - (alreadyUsedUSD + totalPaid));
    }

    const setDataTable = (type: string, data: IInvoiceForPay) => {
        if (type == 'editable') {
            setInvoicesForPay((prev) => prev.map(inv => {
                if (inv.id === data.id) {
                    return {
                        ...inv,
                        totalPaid: data.totalPaid,
                        currency: infoPayment.account.method.currency,
                        // totalAmountBs: Number(Number(dolar?.dolar) * data.totalAmount).toFixed(2)
                    }
                }
                return inv;
            }))
        }

        if (type == 'Eliminar') {
            setInvoicesForPay((prev) => prev.filter(inv => inv.id !== data.id))
        }
    }

    // const setCurrency = (currency: string): string => {
    //     return currency === 'USD' ? ' $' : ' Bs';
    // }

    const sendPaymentInvoices = () => {
        const dataPay: IPayInvoiceForm = {
            paymentId: infoPayment.id,
            details: invoicesForPay.map(item => {
                return {
                    invoiceId: item.id,
                    amount: Number(item.totalPaid)
                }
            })
        }
        onSubmit(dataPay)
    }

    return (
        <div className="w-full bg-white rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">💳 Información del pago</h2>
            <div className="flex flex-col items-start gap-2 my-2 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Total:</span>
                    <span className="text-black">{setPayment(infoPayment, false)}</span>
                    {currencyBs && (
                        <span className="text-black"> = {infoPayment.amountUSD} $</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Restante:</span>
                    <span className="text-black">
                        {setPaymentRest(infoPayment, true)} = {Number(infoPayment.remainingUSD).toFixed(2)} $
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
                <Label className="text-sm font-medium text-gray-700">Buscar factura</Label>
                <Autocomplete
                    placeholder="Buscar factura"
                    data={allInvoices}
                    onChange={selectInvoice}
                    resetValues={true}
                />
            </div>

            <div className="mb-6">
                <TableComponent
                    dataBase={invoicesForPay}
                    columns={paymentsFilterColumns}
                    action={setDataTable}
                />
            </div>

            <div className="w-full flex items-center justify-center">
                <Button onClick={sendPaymentInvoices} className="w-40">
                    Pagar factura
                </Button>
            </div>
        </div>
    )
}
