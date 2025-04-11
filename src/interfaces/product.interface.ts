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
    id:           number;
    name:         string;
    presentation: string;
    price:        number;
    priceBs:     number;
    priceUSD:     number;
    amount:       number;
    createdAt:    Date;
    updatedAt:    Date;
}

export interface IDolar {
    id:    number;
    dolar: string;
    date:  Date;
}
