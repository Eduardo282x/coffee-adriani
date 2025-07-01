import { create } from 'zustand'
import { GroupProducts, IProducts } from '@/interfaces/product.interface';
import { deleteProduct, getProduct, getProductHistory } from '@/services/products.service';
import { IOptions } from '@/interfaces/form.interface';

interface ProductState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    products: GroupProducts;
    productOptions: IOptions[];
    setProducts: (products: GroupProducts) => void;
    getProductsApi: () => Promise<void>;
    productsHistory: IProducts[];
    deleteProducts: (id: number) => void;
}

export const productStore = create<ProductState>((set) => ({
    products: { products: [], productsFilter: [] },
    productsHistory: [],
    productOptions: [],
    loading: false,
    setLoading: (loading: boolean) => { (set(() => ({ loading }))) },
    setProducts: (products: GroupProducts) => set(() => ({ products })),
    getProductsApi: async () => {
        set(() => ({ loading: true }))
        const response: IProducts[] = await getProduct();
        const responseHistory: IProducts[] = await getProductHistory();
        if (response && response.length > 0) {
            set(() => ({
                productOptions: response.map(pro => {
                    return {
                        label: `${pro.name} ${pro.presentation}`,
                        value: pro.id
                    }
                }),
                products: { products: response, productsFilter: response },
                productsHistory: responseHistory
            }))
        }
        set(() => ({ loading: false }))
    },
    deleteProducts: async (id: number) => {
        await deleteProduct(id);
        set((state) => {
            const productDelected = state.products.products.filter((us: IProducts) => us.id != id);
            return {
                products: { products: productDelected, productsFilter: productDelected }
            };
        });
    }
}))