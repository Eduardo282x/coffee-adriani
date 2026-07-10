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
import { IInventoryEntry } from "@/interfaces/inventory.interface";
import { formatOnlyNumberWithDots } from "@/hooks/formaters";
import { IProducts } from "@/interfaces/product.interface";
import { ISupplier } from "@/interfaces/inventory.interface";
import { EnterpriseItem } from "./enterprise.data";
import { FormSelect } from "@/components/form/FormSelect";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

interface IEnterpriseForm {
    controlNumber: string;
    description: string;
    supplierId: string;
    entryDate: Date;
}

interface EnterpriseFormProps extends FromProps {
    data?: IInventoryEntry | null;
    productOptions: IOptions[];
    products: IProducts[];
    suppliers: ISupplier[];
}

export const EnterpriseForm: FC<EnterpriseFormProps> = ({ onSubmit, data, productOptions, products, suppliers }) => {
    const [items, setItems] = useState<EnterpriseItem[]>([]);
    const [total, setTotal] = useState<number>(0);

    const suppliersOptions = suppliers.map((supplier) => ({
        label: supplier.name,
        value: supplier.id.toString()
    }));

    const form = useForm<IEnterpriseForm>({
        defaultValues: {
            controlNumber: '',
            description: '',
            supplierId: '',
            entryDate: new Date(),
        }
    });

    const entryDate = form.watch('entryDate');

    useEffect(() => {
        if (data) {
            form.reset({
                controlNumber: data.controlNumber,
                description: data.description || '',
                supplierId: data.supplier?.id?.toString() || '',
                entryDate: new Date(data.date),
            });

            const mappedItems = data.details.map(detail => ({
                productId: detail.productId,
                productName: detail.product?.name || '',
                presentation: detail.product?.presentation || '',
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                unitPriceUSD: detail.unitPriceUSD,
                subtotal: Number(detail.subtotal)
            }));
            setItems(mappedItems);
        }
    }, [data, form]);

    const selectProduct = (data: string) => {
        const selectedProductData = products.find((pro) => pro.id === Number(data));
        if (selectedProductData) {
            const selectedProduct = items.find((inv) => inv.productId === selectedProductData.id);
            if (!selectedProduct) {
                setItems((prev) => [...prev, {
                    productId: selectedProductData.id,
                    productName: selectedProductData.name,
                    presentation: selectedProductData.presentation,
                    quantity: 1,
                    unitPrice: Number(selectedProductData.purchasePrice),
                    unitPriceUSD: Number(selectedProductData.purchasePriceUSD),
                    subtotal: Number(selectedProductData.purchasePriceUSD)
                }])
            }
        }
    }

    const changeDataTable = (action: string, itemData: EnterpriseItem) => {
        if (action === 'editable') {
            setItems(prev => prev.map(item => {
                if (item.productId === itemData.productId) {
                    const subtotal = itemData.quantity * itemData.unitPriceUSD;
                    return { ...itemData, subtotal };
                }
                return item;
            }));
        }

        if (action === 'Eliminar') {
            setItems(prev => prev.filter(item => item.productId !== itemData.productId));
        }
    };

    const onSubmitForm = (formData: IEnterpriseForm) => {
        if (items.length === 0) {
            toast.custom(<Snackbar success={false} message={"Por favor, agregue al menos un producto"} />, {
                duration: 1500,
                position: 'bottom-center'
            });
            return;
        }

        const body = {
            controlNumber: formData.controlNumber,
            description: formData.description,
            date: formData.entryDate,
            supplierId: Number(formData.supplierId),
            details: items.map(item => ({
                productId: item.productId,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                unitPriceUSD: Number(item.unitPriceUSD)
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-full py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col items-start justify-start gap-2">
                        <Label className="text-right">
                            Número de Control
                        </Label>
                        <Input {...form.register('controlNumber')} />
                    </div>

                    <div className="flex flex-col items-start justify-start gap-2">
                        <Label className="text-right">
                            Descripción
                        </Label>
                        <Input {...form.register('description')} />
                    </div>

                    <div className="flex flex-col items-start justify-start gap-2">
                        <FormSelect
                            form={form}
                            name='supplierId'
                            label='Proveedor'
                            placeholder='Seleccione un proveedor'
                            options={suppliersOptions}></FormSelect>
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
                        date={entryDate}
                        setDate={(date) => form.setValue('entryDate', date || new Date())}
                        label="Fecha de Entrada"
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

                <div className="col-span-2 flex items-center justify-end mt-4">
                    <Button disabled={items.length === 0} type="submit">
                        Guardar Entrada
                    </Button>
                </div>
            </form>
        </Form>
    );
};
