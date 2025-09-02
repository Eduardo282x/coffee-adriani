import { formatDateWithDateTime, formatOnlyNumberWithDots } from '@/hooks/formaters';
import { IDolar, IDolarForm, DolarBody } from '@/interfaces/product.interface';
import { getProductDolar, updateDolarAutomatic, updateDolar } from '@/services/products.service';
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react'
import { MdOutlineCurrencyExchange } from 'react-icons/md';
import { ToolTip } from '../tooltip/ToolTip';
import { DialogComponent } from '../dialog/DialogComponent';
import { DolarForm } from '@/pages/products/DolarForm';
import { Button } from '../ui/button';
import { addDays } from 'date-fns';

export const DolarComponents = () => {
    const [openDolar, setOpenDolar] = useState<boolean>(false);
    const [dolar, setDolar] = useState<IDolar>();

    useEffect(() => {
        getProductDolarApi();
    }, [])

    const getProductDolarApi = async () => {
        const response: IDolar = await getProductDolar();
        setDolar(response)
    }

    const updateDolarApi = async () => {
        await updateDolarAutomatic();
        await getProductDolarApi();
    }

    const updateDolarManual = async (data: IDolarForm) => {
        const tomorrow = new Date()
        const dataDolar: DolarBody = {
            dolar: Number(data.dolar),
            date: addDays(tomorrow, 1)
        };
        await updateDolar(dataDolar);
        await getProductDolarApi();
        setOpenDolar(false);
    }

    return (
        <div>
            <div className='flex items-center gap-4'>
                <ToolTip tooltip="Actualizar manual" position="left">
                    <Button onClick={() => setOpenDolar(true)} className='hidden lg:flex'>
                        <MdOutlineCurrencyExchange />
                    </Button>
                </ToolTip>
                <ToolTip tooltip="Actualizar tasa dolar" position="left">
                    <Button onClick={updateDolarApi} className='hidden lg:flex'>
                        <RefreshCcw />
                    </Button>
                </ToolTip>

                <div className="lg:border border-[#ebe0d2] lg:px-4 py-1 rounded-lg relative">
                    <span className="font-semibold text-xs lg:text-sm text-[#ebe0d2] text-ellipsis whitespace-nowrap block">Dolar: {dolar ? formatOnlyNumberWithDots(dolar?.dolar) : ''}  Bs</span> 
                    <span className=" absolute -bottom-6 -left-32 text-sm w-80 hidden lg:block">Ultima actualización: {formatDateWithDateTime(dolar ? dolar.date as Date : new Date())}</span>
                </div>
            </div>

            <DialogComponent
                open={openDolar}
                setOpen={setOpenDolar}
                className="w-[30rem]"
                label2="Agregar Producto"
                label1="Actualizar Dolar"
                isEdit={true}
            >
                <DolarForm onSubmit={updateDolarManual}></DolarForm>
            </DialogComponent>
        </div>
    )
}
