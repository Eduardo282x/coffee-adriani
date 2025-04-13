import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const coffeeColors = {
    darkRoast: "#5D4037", // Café oscuro
    mediumRoast: "#795548", // Café medio
    lightRoast: "#A1887F", // Café claro
    cream: "#D7CCC8", // Crema
    espresso: "#3E2723", // Espresso
    mocha: "#6D4C41", // Moca
    caramel: "#8D6E63", // Caramelo
    hazelnut: "#4E342E", // Avellana
}

// Datos de ejemplo para el gráfico
const data = [
    { name: "Café Espresso", value: 400, color: coffeeColors.espresso },
    { name: "Café Latte", value: 300, color: coffeeColors.cream },
    { name: "Café Mocha", value: 300, color: coffeeColors.mocha },
    { name: "Café Caramelo", value: 200, color: coffeeColors.caramel },
    { name: "Café Avellana", value: 100, color: coffeeColors.hazelnut },
]

export const InventoryStatus = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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
                        fill={coffeeColors.darkRoast}
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
                            borderColor: coffeeColors.mediumRoast,
                            borderRadius: "4px",
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

