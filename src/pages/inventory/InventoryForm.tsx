import { Input } from '@/components/ui/input'
import { FromProps, IOptions } from '@/interfaces/form.interface'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { BodyInventory, BodyInventorySimple } from '@/interfaces/inventory.interface'
import { Form } from '@/components/ui/form'
import { DatePicker } from '@/components/datepicker/DatePicker'
import { Autocomplete } from '@/components/autocomplete/Autocomplete'
import { TableComponent } from '@/components/table/TableComponent'
import { IProducts } from '@/interfaces/product.interface'
import { inventoryProductFormColumns } from './inventory.data'
import { FormSelect } from '@/components/form/FormSelect'

interface InventoryFormProps extends FromProps {
    productOptions: IOptions[]
    products: IProducts[]
}

export interface ProductTable {
    id: number;
    name: string;
    presentation: string;
    quantity: number;
}

export const InventoryForm: FC<InventoryFormProps> = ({ onSubmit, productOptions, products, data }) => {
    // const isEdit = data.productId !== 0 ? true : false;
    const [entryDate, setEntryDate] = useState<Date | undefined>(new Date());
    const [productsSelected, setProductsSelected] = useState<ProductTable[]>([]);

    const formAddInventory = useForm<BodyInventory>({
        defaultValues: {
            controlNumber: '',
            description: 'Entrada de mercancía',
            details: [],
            date: new Date()
        },
    });

    console.log(data);

    const onSubmitInventory = (formData: BodyInventory) => {
        const dataToSubmit = {
            ...formData,
            details: productsSelected.map((product) => ({
                productId: product.id,
                quantity: Number(product.quantity),
            })),
        }

        onSubmit(dataToSubmit);
    }


    // useEffect(() => {
    //     if (data) {
    //         setTimeout(() => {
    //             form.reset({
    //                 productId: data.productId,
    //                 date: data.date
    //             })
    //         }, 0);
    //     }
    // }, [data, products])

    // useEffect(() => {
    //     formAddInventory.setValue('date', entryDate);
    // }, [entryDate])

    const selectProduct = (data: string) => {
        const selectedProductData = products.find((pro) => pro.id === Number(data));
        if (selectedProductData) {
            const selectedProduct = productsSelected.find((inv) => inv.id === selectedProductData.id);
            if (!selectedProduct) {
                setProductsSelected((prev) => [...prev, {
                    id: selectedProductData.id,
                    name: selectedProductData.name,
                    presentation: selectedProductData.presentation,
                    quantity: 1,
                }])
            }
        }
    }

    const changeDataTable = (action: string, data: ProductTable) => {
        if (action === 'editable') {
            setProductsSelected((prev) => prev.map((inv) => {
                if (inv.id === data.id) {
                    // Ahora data ya viene con las propiedades anidadas correctamente actualizadas
                    return data;
                } else {
                    return inv;
                }
            }));
        }

        if (action == 'Eliminar') {
            setProductsSelected((prev) => prev.filter((inv) => inv.id !== data.id))
        }
    }

    return (
        <Form {...formAddInventory}>
            <form onSubmit={formAddInventory.handleSubmit(onSubmitInventory)} className="grid grid-cols-2 gap-4 w-full py-4">
                <div>
                    <div className="space-y-4 w-full">
                        <Label className="text-right w-42">
                            Numero de control
                        </Label>
                        <Input className="w-full" {...formAddInventory.register('controlNumber')} />
                    </div>
                </div>

                <div>
                    <div className="space-y-4 w-full">
                        <Label className="text-right w-42">
                            Descripcion
                        </Label>
                        <Input className="w-full" {...formAddInventory.register('description')} />
                    </div>
                </div>

                <div className="space-y-2 w-full">
                    <Label className="text-right w-42">
                        Producto
                    </Label>
                    <Autocomplete
                        placeholder="Seleccione un producto"
                        data={productOptions}
                        onChange={selectProduct}></Autocomplete>
                </div>

                <DatePicker
                    label='Fecha de ingreso'
                    date={entryDate}
                    setDate={setEntryDate}
                    maxDate={undefined}
                    minDate={undefined}
                />

                <div className="col-span-2">
                    <TableComponent
                        columns={inventoryProductFormColumns}
                        dataBase={productsSelected}
                        action={changeDataTable}
                    />
                </div>

                <div className="col-span-2">
                    <div className='w-full flex items-center justify-center'>
                        <Button type='submit' variant='primary' className='w-40' >Enviar</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const InventoryFormUpdate: FC<InventoryFormProps> = ({ onSubmit, productOptions, data }) => {
    const formInventoryUpdate = useForm<BodyInventorySimple>({
        defaultValues: {
            productId: 0,
            quantity: 0,
        },
    });

    useEffect(() => {
        if (data) {
            setTimeout(() => {
                formInventoryUpdate.reset({
                    productId: data.productId,
                    quantity: data.quantity,
                })
            }, 0);
        }
    }, [data, productOptions])

    return (
        <Form {...formInventoryUpdate}>
            <form onSubmit={formInventoryUpdate.handleSubmit(onSubmit)} className="flex flex-wrap justify-start items-start gap-4 w-full py-4">
                <FormSelect form={formInventoryUpdate} name='productId' label='Producto' placeholder='Seleccione un producto' options={productOptions}></FormSelect>
                <div className="space-y-4 w-full">
                    <Label className="text-right">
                        Cantidad
                    </Label>
                    <Input type='number' min={0} {...formInventoryUpdate.register('quantity', { valueAsNumber: true })} />
                </div>

                <div className='w-full flex items-center justify-center'>
                    <Button type='submit' variant='primary' className='w-40' >Enviar</Button>
                </div>
            </form>
        </Form>
    )
}
