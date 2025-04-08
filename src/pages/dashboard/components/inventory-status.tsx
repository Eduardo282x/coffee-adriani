import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Datos de ejemplo para el gráfico
const data = [
    { name: "Electrónicos", value: 400, color: "#8884d8" },
    { name: "Muebles", value: 300, color: "#82ca9d" },
    { name: "Ropa", value: 300, color: "#ffc658" },
    { name: "Alimentos", value: 200, color: "#ff8042" },
    { name: "Otros", value: 100, color: "#0088fe" },
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
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} unidades`, "Cantidad"]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

