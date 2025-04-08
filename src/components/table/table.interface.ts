export interface IColumns<T> {
    column: string;
    label: string;
    element: (data: T) => string;
    orderBy: OrderBy;
    icon: boolean;
    optionActions?: IOptionActions[];
}

export interface IOptionActions {
    label: string;
    icon: React.ComponentType<{ className?: string }>
    className?: string;
}

export type OrderBy = '' | 'asc' | 'desc';