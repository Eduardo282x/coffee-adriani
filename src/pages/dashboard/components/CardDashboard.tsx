import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FC } from 'react';

interface CardDashboardProps {
    title: string;
    number: number;
    icon: React.ComponentType<{ className?: string }>
}

export const CardDashboard: FC<CardDashboardProps> = ({ title, number, icon: Icon }) => {
    return (
        <Card className=''>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-bold text-[#6f4e37]">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className='-mt-5'>
                <div className="text-xl font-semibold">{number}</div>
            </CardContent>
        </Card>
    )
}
