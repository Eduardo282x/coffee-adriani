export interface IColumns<T> {
    column: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'custom' | 'editable';
    element: (data: T) => string | React.ReactNode;
    orderBy: OrderBy;
    icon?: boolean;
    visible?: boolean;
    optionActions?: IOptionActions[];
    className?: (data: T) => string;
}

export interface IOptionActions {
    label: string;
    icon: React.ComponentType<{ className?: string }>
    className?: string;
}

export type OrderBy = '' | 'asc' | 'desc';