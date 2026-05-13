import { IOptions } from "./form.interface";
import { IProducts } from "./product.interface";

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
