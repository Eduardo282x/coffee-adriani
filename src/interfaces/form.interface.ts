/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOptions {
    label: string;
    value: string | number;
}

export interface FromProps {
    data?: any;
    onSubmit: (data: any) => void;
}