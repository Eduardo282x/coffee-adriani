import { IOptions } from "./form.interface";
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
    description: string;
    subtotal?: number;
    createdAt: Date;
    product: IProducts;

    movementType?: string,
    movementDate?: Date,
}

export interface BodyInventory {
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
