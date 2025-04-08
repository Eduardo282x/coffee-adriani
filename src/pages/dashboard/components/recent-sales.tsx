import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const RecentSales = () => {
    return (
        <div className="space-y-8">
            {[
                {
                    name: "Olivia Martín",
                    email: "olivia.martin@email.com",
                    amount: "$1,999.00",
                    status: "success",
                },
                {
                    name: "Jackson Lee",
                    email: "jackson.lee@email.com",
                    amount: "$39.00",
                    status: "success",
                },
                {
                    name: "Isabella Nguyen",
                    email: "isabella.nguyen@email.com",
                    amount: "$299.00",
                    status: "success",
                },
                {
                    name: "William Kim",
                    email: "will@email.com",
                    amount: "$99.00",
                    status: "pending",
                },
                {
                    name: "Sofia Davis",
                    email: "sofia.davis@email.com",
                    amount: "$39.00",
                    status: "success",
                },
            ].map((sale, index) => (
                <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={sale.name} />
                        <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.name}</p>
                        <p className="text-sm text-muted-foreground">{sale.email}</p>
                    </div>
                    <div className={`ml-auto font-medium ${sale.status === "success" ? "text-green-500" : "text-yellow-500"}`}>
                        {sale.amount}
                    </div>
                </div>
            ))}
        </div>
    )
}

