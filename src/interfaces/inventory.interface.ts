import { IProducts } from "./product.interface";

export interface Resume {
    totalProducts: number;
    downProducts: number;
    zeroProducts: number;
}

export interface IInventory {
    id: number;
    productId: number;
    quantity: number;
    createdAt: Date;
    product: IProducts;

    movementType?: string,
    movementDate?: Date,
}

export interface BodyInventory {
    productId: number;
    quantity: number;
}

export interface GroupInventory {
    allInventory: IInventory[],
    inventory: IInventory[]
}
