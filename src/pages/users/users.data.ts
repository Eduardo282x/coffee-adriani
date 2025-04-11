import { IColumns } from "@/components/table/table.interface";
import { IUsers } from "@/interfaces/user.interface";
import { Edit, Trash2 } from "lucide-react";

export const usersColumns: IColumns<IUsers>[] = [
    {
        label: 'Nombre',
        column: 'name',
        element: (data: IUsers) => data.name,
        orderBy: '',
        icon: false,
    },
    {
        column: 'lastName',
        label: 'Apellido',
        element: (data: IUsers) => data.lastName,
        orderBy: '',
        icon: false,
    },
    {
        column: 'username',
        label: 'Usuario',
        element: (data: IUsers) => data.username,
        orderBy: '',
        icon: false,
    },
    {
        column: 'roles',
        label: 'Rol',
        element: (data: IUsers) => data.roles.rol,
        orderBy: '',
        icon: false,
    },
    {
        column: '',
        label: 'Acciones',
        element: () => '',
        orderBy: '',
        icon: true,
        optionActions: [
            { label: 'Editar', icon: Edit, className: '' },
            { label: 'Eliminar', icon: Trash2, className: 'text-red-600' },
        ]
    },
];

export interface IUsersForm {
    id?: number;
    username: string;
    name: string;
    lastName: string;
    rolId: number;
}

export const defaultValues:IUsersForm = {
    username: '',
    name: '',
    lastName: '',
    rolId: 0,
}