import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { getProduct } from "@/services/products.service"
import { GroupProducts, IProducts } from "@/interfaces/product.interface"
import { TableComponent } from "@/components/table/TableComponent"
import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { Filter } from "@/components/table/Filter"
import { productsColumns } from "./products.data"

export const Products = () => {
    const [products, setProducts] = useState<GroupProducts>({ products: [], productsFilter: [] });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getProductsApi()
    }, [])

    const getProductsApi = async () => {
        setLoading(true);
        const response: IProducts[] = await getProduct();
        setProducts({ products: response, productsFilter: response });
        setLoading(false);
    }

    const setProductFilter = (products: IProducts[]) => {
        setProducts((prev) => ({ ...prev, productsFilter: products }))
    }

    // Función para obtener el color de la insignia según el estado
    // const getBadgeVariant = (estado: string) => {
    //     switch (estado) {
    //         case "Disponible":
    //             return "bg-green-100 text-green-800"
    //         case "Bajo Stock":
    //             return "bg-yellow-100 text-yellow-800"
    //         case "Agotado":
    //             return "bg-red-100 text-red-800"
    //         default:
    //             return "bg-gray-100 text-gray-800"
    //     }
    // }

    return (
        <div className="flex flex-col">

            {loading && (
                <ScreenLoader />
            )}

            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Productos</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Producto
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Gestión de Productos</h2>

                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Filter dataBase={products.products} columns={productsColumns} setDataFilter={setProductFilter} />
                    </div>
                </div>

                <div>
                    <TableComponent columns={productsColumns} dataBase={products.productsFilter}></TableComponent>
                </div>
            </main>
        </div>
    )
}

