import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Filter } from "@/components/table/Filter"
import { TableComponent } from "@/components/table/TableComponent"
import { useState, useEffect } from "react"
import { getCollection, getMessageCollection, postMessageCollection, putCollection, putMessageCollection } from "@/services/collection.service"
import { CollectionMessageBody, GroupCollection, GroupMessages, ICollection, IMessages } from "@/interfaces/collection.interface"
import { clientCollectionColumns, getSendVariant, messageCollectionColumns } from "./collection.data.tsx"
import { CollectionExpandible } from "./CollectionExpandible"
import { Button } from "@/components/ui/button"
import { IColumns } from "@/components/table/table.interface.ts";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DialogComponent } from "@/components/dialog/DialogComponent.tsx"
import { CollectionForm } from "./CollectionForm.tsx"

export const Collections = () => {
    const [messages, setMessages] = useState<GroupMessages>({ allMessages: [], messages: [] });
    const [collections, setCollections] = useState<GroupCollection>({ allCollections: [], collections: [] });
    const [columns, setColumns] = useState<IColumns<ICollection>[]>(clientCollectionColumns);
    const [loading, setLoading] = useState<boolean>(false);
    const [showMessage, setShowMessages] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [messageSelected, setMessageSelected] = useState<IMessages | null>(null);

    const getCollectionsApi = async () => {
        setLoading(true);
        const response: ICollection[] = await getCollection();
        if (response) {
            setCollections({
                allCollections: response,
                collections: response,
            });
        }
        setLoading(false)
    }

    const getMessageCollectionApi = async () => {
        setLoading(true);
        const response: IMessages[] = await getMessageCollection();

        const newColumns: IColumns<ICollection>[] = [
            {
                column: 'message.title',
                label: 'Mensaje',
                element: (data: ICollection) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <span className="rounded-lg px-2 bg-green-100 text-green-800">
                                {data.message ? data.message.title : ''}
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {response && response.map((me: IMessages, index: number) => (
                                <DropdownMenuItem key={index} onClick={() => getActions('message.title', { ...data, messageId: me.id, message: me }, true)}>{me.title}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
                // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
                orderBy: '',
                type: 'custom',
                icon: false,
            },
            {
                column: 'send',
                label: 'Enviar',
                element: (data: ICollection) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <span className={`${getSendVariant(data.send)}`}>
                                {data.send == true ? 'Enviar' : 'No enviar'}
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => getActions('send', { ...data, send: true }, true)}>Enviar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => getActions('send', { ...data, send: false }, true)}>No Enviar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
                orderBy: '',
                type: 'custom',
                icon: false,
            }
        ]

        setColumns([...clientCollectionColumns, ...newColumns])
        if (response) {
            setMessages({
                allMessages: response,
                messages: response,
            });
        }
        setLoading(false)
    }

    useEffect(() => {
        getCollectionsApi();
        getMessageCollectionApi();
    }, [])

    const setFilterCollection = (collections: ICollection[]) => {
        setCollections(prev => {
            return {
                ...prev,
                collections
            }
        })
    }
    const setFilterMessage = (messages: IMessages[]) => {
        setMessages(prev => {
            return {
                ...prev,
                messages
            }
        })
    }

    const newMessage = () => {
        setOpenDialog(true);
        setMessageSelected(null);
    }

    const getActions = async (action: string, data: ICollection, byColumn?: boolean) => {
        if (action == 'send' && byColumn) {
            setCollections(prev => {
                return {
                    ...prev,
                    collections: prev.collections.map(colle => {
                        return {
                            ...colle,
                            send: colle.id == data.id ? data.send : colle.send
                        }
                    })
                }
            })
        }
        if (action == 'message.title' && byColumn) {
            setCollections(prev => {
                return {
                    ...prev,
                    collections: prev.collections.map(colle => {
                        return {
                            ...colle,
                            messageId: colle.id == data.id ? data.messageId : colle.messageId,
                            message: colle.id == data.id ? data.message : colle.message
                        }
                    })
                }
            })
        }

        if (byColumn) {
            setLoading(true);
            const updateData = {
                messageId: data.messageId,
                send: data.send
            }

            await putCollection(data.id, updateData);
            setLoading(false);
        }

    }
    const getActionsMessage = (action: string, data: IMessages) => {
        setMessageSelected(data);
        if (action === 'Editar') {
            setTimeout(() => {
                setOpenDialog(true)
            }, 0);
        }
    }

    const onSubmitMessage = async (message: CollectionMessageBody) => {
        if (messageSelected) {
            await putMessageCollection(messageSelected.id, message)
        } else {
            await postMessageCollection(message)
        }

        setOpenDialog(false);
        await getMessageCollectionApi();
    }

    return (
        <div className="flex flex-col">
            {loading && (
                <ScreenLoader />
            )}

            <header className="flex bg-[#6f4e37] h-14 lg:h-[60px] items-center gap-4 border-b text-white px-6">
                <SidebarTrigger />
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Cobranza</h1>
                </div>

                <div className="flex items-center justify-center">
                    {showMessage && (
                        <Button onClick={newMessage}>Agregar mensaje</Button>
                    )}
                    <div className="border border-[#ebe0d2] rounded-lg p-1 bg-[#6f4e37]/20 flex items-center justify-center gap-2 mx-4">
                        <Button className={`${showMessage ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setShowMessages(false)}>Cobranza</Button>
                        <Button className={`${!showMessage ? 'bg-transparent' : 'bg-[#ebe0d2]'} hover:bg-[#ebe0d2]/90`} onClick={() => setShowMessages(true)}>Mensajes</Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Cobranza</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex w-80  items-center space-x-2">
                            {!showMessage
                                ? <Filter dataBase={collections.allCollections} columns={columns} setDataFilter={setFilterCollection} />
                                : <Filter dataBase={messages.allMessages} columns={messageCollectionColumns} setDataFilter={setFilterMessage} />
                            }
                        </div>
                        <Button className="bg-[#6f4e37] text-white hover:bg-[#7a5b45]">Enviar mensajes</Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    {!showMessage ?
                        <TableComponent
                            columns={columns}
                            dataBase={collections.collections}
                            isExpansible={true}
                            renderRow={(collec, index) => (
                                <CollectionExpandible key={index} collection={collec} />
                            )}
                            action={getActions}
                        />
                        :
                        <TableComponent
                            columns={messageCollectionColumns}
                            dataBase={messages.messages}
                            action={getActionsMessage}
                        />
                    }
                </div>
            </main>


            <DialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                className="w-[35rem]"
                label2="Agregar Mensaje"
                label1="Editar Mensaje"
                isEdit={messageSelected ? true : false}
            >
                <CollectionForm onSubmit={onSubmitMessage} data={messageSelected}></CollectionForm>
            </DialogComponent>
        </div>
    )
}
