import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { FC } from 'react';

interface CardDashboardProps {
    title: string;
    mainNumber: number;
    percent: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>
}

export const CardDashboard: FC<CardDashboardProps> = ({ title, mainNumber, icon: Icon, percent, subtitle }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mainNumber}</div>
                <p className="text-xs text-muted-foreground">
                    <span className={` ${percent.includes('-') ? 'text-red-500' : 'text-green-500'} flex items-center`}>
                        {percent.includes('-') ? <ArrowDownRight className="mr-1 h-4 w-4"/> : <ArrowUpRight className="mr-1 h-4 w-4" />} 
                        {percent}
                    </span>{" "}
                    {subtitle}
                </p>
            </CardContent>
        </Card>
    )
}
