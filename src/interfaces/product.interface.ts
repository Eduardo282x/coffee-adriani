export interface BodyProduct {
    name: string;
    presentation: string;
    price: number;
    priceUSD: number;
    amount: number;
}

export interface GroupProducts {
    products: IProducts[];
    productsFilter: IProducts[];
}

export interface IProducts {
    id: number;
    name: string;
    presentation: string;
    type: string;
    price: number;
    priceBs: number;
    priceUSD: number;
    purchasePrice: number;
    purchasePriceUSD: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDolar {
    id: number;
    dolar: string;
    date: Date;
}

export interface IDolarForm {
    dolar: number
}

export interface DolarBody {
    dolar: number;
    date: Date;
}

export interface ProductType {
    type: string;
}
