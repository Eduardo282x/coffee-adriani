import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/hooks/formaters"
import { DashboardSnapshot } from "@/interfaces/dashboard.interface"
import { RiFileExcel2Line } from "react-icons/ri"

interface DashboardSnapshotsProps {
    snapshots: DashboardSnapshot[]
    isDownloading: boolean
    onDownload: (id: number, fileName: string) => void
}

export const DashboardSnapshots = ({ snapshots, isDownloading, onDownload }: DashboardSnapshotsProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Semana</TableHead>
                    <TableHead>Fecha de creación</TableHead>
                    <TableHead className="text-right">Descargar</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {snapshots && snapshots.length > 0 ? snapshots.map((snapshot, index) => (
                    <TableRow key={snapshot.id ?? index}>
                        <TableCell className="font-medium">{snapshot.type}</TableCell>
                        <TableCell>{formatDate(snapshot.weekStart)} - {formatDate(snapshot.weekEnd)}</TableCell>
                        <TableCell>{formatDate(snapshot.createdAt)}</TableCell>
                        <TableCell className="text-right">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isDownloading}
                                onClick={() => onDownload(snapshot.id, snapshot.fileName)}
                            >
                                <RiFileExcel2Line className="text-green-600 font-bold" /> Descargar
                            </Button>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            No hay reportes disponibles
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}