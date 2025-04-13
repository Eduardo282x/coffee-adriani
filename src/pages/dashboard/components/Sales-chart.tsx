/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Datos de ejemplo para el gráfico
const generateData = () => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1

    return months.map((month) => {
        const currentYearSales = Math.floor(Math.random() * 50000) + 10000
        const lastYearSales = Math.floor(Math.random() * 40000) + 10000

        return {
            name: month,
            [currentYear]: currentYearSales,
            [lastYear]: lastYearSales,
        }
    })
}

export const SalesChart = () => {
    const [data, setData] = useState<any[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setData(generateData())
    }, [])

    if (!mounted) return null

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]} />
                    <Legend />
                    <Line type="monotone" dataKey="2024" stroke="#8B4513" strokeWidth={2} activeDot={{ r: 8 }} name="2024" />
                    <Line type="monotone" dataKey="2023" stroke="#D2B48C" strokeWidth={2} name="2023" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
