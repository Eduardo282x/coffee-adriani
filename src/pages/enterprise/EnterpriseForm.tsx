/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete } from "@/components/autocomplete/Autocomplete";
import { TableComponent } from "@/components/table/TableComponent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC, useEffect, useState } from "react";
import { enterpriseItemColumns } from "./enterprise.data";
import { Button } from "@/components/ui/button";
import { FromProps, IOptions } from "@/interfaces/form.interface";
import { DatePicker } from "@/components/datepicker/DatePicker";
import { Snackbar } from "@/components/snackbar/Snackbar";
import toast from "react-hot-toast";
import { IPaymentEnterprise, IPaymentEnterpriseItems } from "@/interfaces/payment.interface";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";
import { IProducts } from "@/interfaces/product.interface";

interface EnterpriseFormProps extends FromProps {
    data?: IPaymentEnterprise | null;
    productOptions: IOptions[];
    products: IProducts[]
}

interface EnterpriseItem extends IPaymentEnterpriseItems {
    productName?: string;
    presentation?: string;
    subtotal?: number;
}

export const EnterpriseForm: FC<EnterpriseFormProps> = ({ onSubmit, data, productOptions, products }) => {
    const [controlNumber, setControlNumber] = useState<string>('');
    const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
    const [currency, setCurrency] = useState<string>('USD');
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [items, setItems] = useState<EnterpriseItem[]>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        if (data) {
            setControlNumber(data.controlNumber);
            setPaymentDate(new Date(data.paymentDate));
            setCurrency(data.currency);
            setAmount(Number(data.amount));
            setDescription(data.description);

            const mappedItems = data.items.map(item => ({
                ...item,
                productName: item.product?.name || '',
                presentation: item.product?.presentation || '',
                subtotal: item.quantity * item.price
            }));
            setItems(mappedItems);
        }
    }, [data]);

    const selectProduct = (data: string) => {
        const selectedProductData = products.find((pro) => pro.id === Number(data));
        if (selectedProductData) {
            const selectedProduct = items.find((inv) => inv.id === selectedProductData.id);
            if (!selectedProduct) {
                setItems((prev) => [...prev, {
                    productName: selectedProductData.name,
                    presentation: selectedProductData.presentation,
                    subtotal: Number(selectedProductData.purchasePrice),
                    price: selectedProductData.purchasePrice,
                    quantity: 1,
                    productId: selectedProductData.id
                }])
            }
        }
    }

    const changeDataTable = (action: string, itemData: EnterpriseItem) => {
        if (action === 'editable') {
            setItems(prev => prev.map(item => {
                if (item.productId === itemData.productId) {
                    const subtotal = itemData.quantity * itemData.price;
                    return { ...itemData, subtotal };
                }
                return item;
            }));
        }

        if (action === 'Eliminar') {
            setItems(prev => prev.filter(item => item.productId !== itemData.productId));
        }
    };

    const onSubmitForm = () => {
        if (controlNumber === '') {
            toast.custom(<Snackbar success={false} message={"Por favor, complete el número de control"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }

        if (items.length === 0) {
            toast.custom(<Snackbar success={false} message={"Por favor, agregue al menos un producto"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }

        const body = {
            amount: Number(amount),
            paymentDate: paymentDate,
            currency: currency,
            description: description,
            controlNumber: controlNumber,
            items: items.map(item => ({
                productId: item.productId,
                quantity: Number(item.quantity),
                price: Number(item.price)
            }))
        };

        onSubmit(body);
    };

    useEffect(() => {
        const newTotal = items.reduce((acc, item) => {
            return acc + (item.subtotal || 0);
        }, 0);
        setTotal(newTotal);
    }, [items]);

    return (
        <div className="">
            <div className="grid grid-cols-2 gap-4 w-full py-4">
                <div className="flex flex-col items-start justify-start gap-2">
                    <Label className="text-right">
                        Número de Control
                    </Label>
                    <Input
                        className="w-full"
                        value={controlNumber}
                        onChange={(e) => setControlNumber(e.target.value)}
                        placeholder="Ingrese el número de control"
                    />
                </div>

                <div className="flex flex-col items-start justify-start gap-2">
                    <Label className="text-right">
                        Descripción
                    </Label>
                    <Input
                        className="w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ingrese una descripción"
                    />
                </div>

                <div className="flex flex-col items-start justify-start gap-2">
                    <Label className="text-right">
                        Cantidad de pago
                    </Label>
                    <Input
                        className="w-full"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Ingrese la cantidad de pago"
                    />
                </div>

                <div className="flex flex-col items-start justify-start gap-2">
                    <Label className="text-right">
                        Moneda
                    </Label>
                    <select
                        className="w-full p-2 border rounded"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option value="USD">Dólares (USD)</option>
                        <option value="BS">Bolívares (BS)</option>
                    </select>
                </div>

                <div className="flex flex-col items-start justify-start gap-2">
                    <Label className="text-right">
                        Producto
                    </Label>
                    <Autocomplete
                        placeholder="Seleccione un producto"
                        data={productOptions}
                        onChange={selectProduct}
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

            <TableComponent
                columns={enterpriseItemColumns}
                total={formatOnlyNumberWithDots(total.toString())}
                dataBase={items}
                action={changeDataTable}
                includeFooter={true}
            />

            <div className="flex items-center justify-end mt-4">
                <Button disabled={items.length === 0} onClick={onSubmitForm}>
                    Guardar Pago Empresarial
                </Button>
            </div>
        </div>
    );
};