import { Package, ArrowUpDown } from "lucide-react"

// Datos de ejemplo para el inventario
export const inventarioData = [
    {
        id: 1,
        codigo: "PROD-001",
        nombre: "Laptop Pro X",
        ubicacion: "Almacén A - Estante 1",
        stock: 25,
        stockMinimo: 10,
        ultimaActualizacion: "10/04/2024",
    },
    {
        id: 2,
        codigo: "PROD-002",
        nombre: "Smartphone Galaxy",
        ubicacion: "Almacén A - Estante 2",
        stock: 50,
        stockMinimo: 15,
        ultimaActualizacion: "12/04/2024",
    },
    {
        id: 3,
        codigo: "PROD-003",
        nombre: "Auriculares Inalámbricos",
        ubicacion: "Almacén B - Estante 1",
        stock: 100,
        stockMinimo: 20,
        ultimaActualizacion: "15/04/2024",
    },
    {
        id: 4,
        codigo: "PROD-004",
        nombre: "Monitor 4K",
        ubicacion: "Almacén A - Estante 3",
        stock: 15,
        stockMinimo: 10,
        ultimaActualizacion: "18/04/2024",
    },
    {
        id: 5,
        codigo: "PROD-005",
        nombre: "Teclado Mecánico",
        ubicacion: "Almacén B - Estante 2",
        stock: 30,
        stockMinimo: 15,
        ultimaActualizacion: "20/04/2024",
    },
    {
        id: 6,
        codigo: "PROD-006",
        nombre: "Ratón Ergonómico",
        ubicacion: "Almacén B - Estante 2",
        stock: 0,
        stockMinimo: 10,
        ultimaActualizacion: "22/04/2024",
    },
    {
        id: 7,
        codigo: "PROD-007",
        nombre: "Impresora Láser",
        ubicacion: "Almacén C - Estante 1",
        stock: 10,
        stockMinimo: 5,
        ultimaActualizacion: "25/04/2024",
    },
    {
        id: 8,
        codigo: "PROD-008",
        nombre: "Disco Duro Externo",
        ubicacion: "Almacén C - Estante 2",
        stock: 40,
        stockMinimo: 20,
        ultimaActualizacion: "28/04/2024",
    },
]

// Datos para las tarjetas de resumen
export const resumenData = [
    {
        title: "Total de Productos",
        value: "245",
        description: "Productos en inventario",
        icon: Package,
        color: "bg-blue-100 text-blue-800",
    },
    {
        title: "Productos con Stock Bajo",
        value: "12",
        description: "Por debajo del mínimo",
        icon: ArrowUpDown,
        color: "bg-yellow-100 text-yellow-800",
    },
    {
        title: "Productos Agotados",
        value: "3",
        description: "Sin existencias",
        icon: Package,
        color: "bg-red-100 text-red-800",
    },
]