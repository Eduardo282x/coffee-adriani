import { Skeleton } from "@/components/ui/skeleton"

const CardSkeleton = () => (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
        </div>
        <div className="p-6 pt-0">
            <Skeleton className="h-6 w-20" />
        </div>
    </div>
)

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>

            <div className="flex items-center gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-28" />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-2 p-6">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="p-6 pt-0">
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
                <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-2 p-6">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                    <div className="space-y-4 p-6 pt-0">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Skeleton className="h-2 w-2 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
