import { Switch } from "@/components/ui/switch";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IMessages } from "@/interfaces/collection.interface";


interface CollectionActionsProps {
    markAll: boolean;
    toggleSendData: (send: boolean) => void;
    messages: IMessages[];
    changeMessage: (messageId: number) => void;
}

export const CollectionActions = ({ markAll, toggleSendData, messages, changeMessage }: CollectionActionsProps) => {
    return (
        <div className="flex flex-col gap-2 p-2 w-60">
            <div className="flex items-center justify-between gap-2">
                <p>Mensaje:</p>

                <Select onValueChange={(value) => changeMessage(Number(value))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Mensaje" />
                    </SelectTrigger>
                    <SelectContent>
                        {messages.map((item, index) => (
                            <SelectItem key={index} value={item.id.toString()}>{item.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between gap-2">
                <p>Enviar a todos:</p>
                <Switch checked={markAll} onCheckedChange={toggleSendData} />
            </div>
        </div>
    )
}
