import { IColumns } from "@/components/table/table.interface";
import { ISupplier } from "@/interfaces/supplier.interface";
import { MdEdit } from "react-icons/md";
import { Trash2 } from "lucide-react";

export const supplierColumns: IColumns<ISupplier>[] = [
    {
        label: 'Nombre',
        column: 'name',
        element: (data: ISupplier) => data.name,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'RIF',
        column: 'rif',
        element: (data: ISupplier) => data.rif,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Teléfono',
        column: 'phone',
        element: (data: ISupplier) => data.phone,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Dirección',
        column: 'address',
        element: (data: ISupplier) => data.address,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        label: 'Rubro',
        column: 'rubro',
        element: (data: ISupplier) => data.rubro,
        orderBy: '',
        type: 'string',
        icon: false,
    },
    {
        column: '',
        label: 'Acciones',
        element: () => '',
        orderBy: '',
        type: 'string',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: MdEdit, className: 'text-[#6f4e37]' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
];
