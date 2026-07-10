import { IOptions } from "./form.interface";
import { IProducts } from "./product.interface";
import { IPayments } from "./payment.interface";

export interface Resume {
    totalProducts: number;
    totalMoney: number;
    downProducts: number;
    zeroProducts: number;
}

export interface IInventory {
    id: number;
    productId: number;
    quantity: number;
    description: string;
    subtotal?: number;
    createdAt: Date;
    product: IProducts;
    movementType?: string,
    movementDate?: Date,
}

export interface BodyInventorySimple extends DetailInventory{
    description?: string;
}

export interface BodyUpdateHistoryInventory{
    controlNumberOld: string;
    controlNumber: string;
    date: Date;
}

export interface BodyInventory {
    controlNumber: string;
    date: Date;
    description?: string;
    details: DetailInventory[];
}

export interface DetailInventory {
    productId: number;
    quantity: number;
}

export interface GroupInventoryDate {
    allInventory: IInventory[],
    inventory: IOptions[]
}
export interface GroupInventory {
    allInventory: IInventory[],
    inventory: IInventory[]
}


export interface InventoryHistory {
    history: History[];
    pagination: PaginationHistory;
}

export interface History {
    controlNumber: string;
    description:   string;
    movementType:  string;
    movementDate:  Date;
    details:       DetailHistory[];
}

export interface DetailHistory {
    productId:    number;
    name:         string;
    presentation: string;
    quantity:     number;
    priceBs:      string;
    priceUSD:     string;
    date:         Date;
}

export interface PaginationHistory {
    total:           number;
    page:            number;
    limit:           number;
    totalPages:      number;
    hasNextPage:     boolean;
    hasPreviousPage: boolean;
}

// Inventory Entry interfaces
export interface ISupplier {
    id: number;
    name: string;
    rif: string;
    phone: string;
    address: string;
    email: string;
}

export interface IInventoryEntryDetail {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    unitPriceUSD: number;
    subtotal: number;
    product: IProducts;
}

export interface IInventoryEntryPayment {
    id: number;
    amount: string;
    amountUSD: string;
    amountBS: string;
    payment: IPayments;
    createdAt: Date;
}

export interface IInventoryEntry {
    id: number;
    controlNumber: string;
    title: string;
    description: string;
    date: Date;
    status: 'CREADA' | 'PENDIENTE' | 'PAGADO' | 'CANCELADA';
    movementType: string;
    totalAmount: string;
    totalBultos: number;
    totalPaid: string;
    remaining: string;
    supplier: ISupplier | null;
    details: IInventoryEntryDetail[];
    payments: IInventoryEntryPayment[];
    detailsCount?: number;
    paymentsCount?: number;
}

export interface PaginatedEntryResponse {
    entries: IInventoryEntry[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface CreateInventoryEntryForm {
    controlNumber: string;
    title?: string;
    description?: string;
    date: Date;
    supplierId?: number;
    details: {
        productId: number;
        quantity: number;
        unitPrice: number;
        unitPriceUSD?: number;
    }[];
}

export interface EntryPaymentForm {
    amount: number;
    accountId: number;
    reference: string;
    description?: string;
    paymentDate: Date;
    inventoryEntryId: number;
    entryAmount: number;
}

export interface EntryPaymentsResponse {
    entryId: number;
    controlNumber: string;
    totalAmount: string;
    totalPaid: string;
    remaining: string;
    payments: IInventoryEntryPayment[];
}
