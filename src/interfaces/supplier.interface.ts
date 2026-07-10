import { Pagination } from "./invoice.interface";

export interface Supplier {
    suppliers: ISupplier[];
    pagination: Pagination;
}

export interface ISupplier {
    id: number;
    name: string;
    rif: string;
    phone: string;
    address: string;
    email: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface BodySupplier {
    name: string;
    rif: string;
    phone: string;
    address: string;
    email: string;
}

export interface SupplierResponse {
    suppliers: ISupplier[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
