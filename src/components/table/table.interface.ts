export interface IColumns<T> {
    column: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'custom' | 'editable';
    element: (data: T) => string;
    orderBy: OrderBy;
    icon?: boolean;
    optionActions?: IOptionActions[];
    className?: (data: T) => string;
}

export interface IOptionActions {
    label: string;
    icon: React.ComponentType<{ className?: string }>
    className?: string;
}

export type OrderBy = '' | 'asc' | 'desc';