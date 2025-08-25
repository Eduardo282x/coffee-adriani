import { Inventory } from "@/interfaces/dashboard.interface";
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// const coffeeColors = {
//     darkRoast: "#5D4037", // Café oscuro
//     mediumRoast: "#795548", // Café medio
//     lightRoast: "#A1887F", // Café claro
//     cream: "#D7CCC8", // Crema
//     espresso: "#3E2723", // Espresso
//     mocha: "#6D4C41", // Moca
//     caramel: "#8D6E63", // Caramelo
//     hazelnut: "#4E342E", // Avellana
// }

const coffeeColors = [
    '#5D4037',
    '#795548',
    '#A1887F',
    '#D7CCC8',
    '#3E2723',
    '#6D4C41',
    '#8D6E63',
    '#4E342E',
]

interface DataChart {
    name: string;
    value: number;
    color: string;
}
interface InventoryStatusProps {
    inventoryData: Inventory
}

export const InventoryStatus = ({ inventoryData }: InventoryStatusProps) => {
    const [mounted, setMounted] = useState(false);

    const [data, setData] = useState<DataChart[]>([]);


    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        calculateData()
    }, [inventoryData])

    const calculateData = () => {
        const prepareData: DataChart[] = [];
        if (inventoryData && inventoryData.products.length > 0) {
            inventoryData.products.map((item, index) => {
                prepareData.push({
                    name: item.name,
                    value: item.amount,
                    color: coffeeColors[index]
                })
            });
            setData(prepareData);
        }
    }

    if (!mounted) return null

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill={coffeeColors[0]}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [`${value} unidades`, "Cantidad"]}
                        contentStyle={{
                            backgroundColor: "rgba(255, 250, 240, 0.95)",
                            borderColor: coffeeColors[1],
                            borderRadius: "4px",
                        }}
                    />
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

