import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Filter } from "@/components/table/Filter"
import { TableComponent } from "@/components/table/TableComponent"
import { useState, useEffect } from "react"
import { deleteMessageCollection, getCollection, getMessageCollection, postMessageCollection, postSendMessageCollection, putCollection, putMarkCollection, putMessageCollection } from "@/services/collection.service"
import { CollectionMessageBody, GroupCollection, GroupMessages, ICollection, IMessages, MarkBody } from "@/interfaces/collection.interface"
import { clientCollectionColumns, getSendVariant, isToday, messageCollectionColumns, normalColumns } from "./collection.data.tsx"
import { CollectionExpandible } from "./CollectionExpandible"
import { Button } from "@/components/ui/button"
import { IColumns } from "@/components/table/table.interface.ts";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DialogComponent } from "@/components/dialog/DialogComponent.tsx"
import { CollectionForm, DeleteMessageForm } from "./CollectionForm.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"

type TypesViews = 'collection' | 'messages' | 'sended' | 'no-sended' | 'history' | 'errors';

export const Collections = () => {
    const [messages, setMessages] = useState<GroupMessages>({ allMessages: [], messages: [] });
    const [collections, setCollections] = useState<GroupCollection>({ allCollections: [], collections: [] });
    const [columns, setColumns] = useState<IColumns<ICollection>[]>(clientCollectionColumns);
    const [loading, setLoading] = useState<boolean>(false);
    const [view, setView] = useState<TypesViews>('collection');
    // const [showMessage, setShowMessages] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [openDialogDeleteMessage, setOpenDialogDeleteMessage] = useState<boolean>(false)
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
        console.log(collections);

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
        console.log(action);

        setMessageSelected(data);
        if (action === 'Editar') {
            setTimeout(() => {
                setOpenDialog(true)
            }, 0);
        }
        if (action === 'Eliminar') {
            setTimeout(() => {
                setOpenDialogDeleteMessage(true)
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

    const deleteMessageAPI = async (actionDelete: boolean) => {
        if (actionDelete && messageSelected) {
            await deleteMessageCollection(messageSelected.id)
            await getMessageCollectionApi();
        }
        setOpenDialogDeleteMessage(false);
    }

    const sendMessage = async () => {
        setLoading(true)
        await postSendMessageCollection()
        console.log('Prueba de mensaje enviado');
        setLoading(false)
    }
    const markNoSend = () => {
        markCollections({ send: false })
    }
    const markSend = () => {
        markCollections({ send: true })
    }

    const markCollections = async (mark: MarkBody) => {
        setCollections(prev => {
            return {
                ...prev,
                collections: prev.collections.map(colle => {
                    return {
                        ...colle,
                        send: mark.send
                    }
                })
            }
        })
        await putMarkCollection(mark)
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
                    {view == 'messages' && (
                        <Button onClick={newMessage}>Agregar mensaje</Button>
                    )}

                    <Tabs
                        className="border rounded-lg border-[#ebe0d2] p-1 mx-4"
                        defaultValue="collection" value={view} onValueChange={(value) => setView(value as TypesViews)}>
                        <TabsList>
                            <TabsTrigger value="collection">Cobranza</TabsTrigger>
                            <TabsTrigger value="messages">Mensajes</TabsTrigger>
                            <TabsTrigger value="sended">Enviados</TabsTrigger>
                            <TabsTrigger value="no-sended">No Enviados</TabsTrigger>
                            <TabsTrigger value="history">Historial</TabsTrigger>
                            <TabsTrigger value="errors">Errores</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37]">Gestión de Cobranza</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex w-80  items-center space-x-2">
                            {view == 'collection'
                                ? <Filter dataBase={collections.allCollections} columns={columns} setDataFilter={setFilterCollection} />
                                : <Filter dataBase={messages.allMessages} columns={messageCollectionColumns} setDataFilter={setFilterMessage} />
                            }
                        </div>
                        <Button onClick={sendMessage} className="bg-[#6f4e37] text-white hover:bg-[#7a5b45]">Enviar mensajes</Button>
                        <Button onClick={markNoSend} className="bg-[#9e673f] text-white hover:bg-[#7a5b45]">No Enviar a todos</Button>
                        <Button onClick={markSend} className="bg-[#b27245] text-white hover:bg-[#7a5b45]">Enviar a todos</Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    {view == 'collection' && (
                        <TableComponent
                            columns={columns}
                            dataBase={collections.collections}
                            isExpansible={true}
                            renderRow={(collec, index) => (
                                <CollectionExpandible key={index} collection={collec} />
                            )}
                            action={getActions}
                        />
                    )}
                    {view == 'sended' && (
                        <TableComponent
                            columns={normalColumns}
                            dataBase={collections.collections.filter(item => isToday(item.sentAt))}
                            isExpansible={true}
                            renderRow={(collec, index) => (
                                <CollectionExpandible key={index} collection={collec} />
                            )}
                            action={getActions}
                        />
                    )}
                    {view == 'no-sended' && (
                        <TableComponent
                            columns={normalColumns}
                            dataBase={collections.collections.filter(item => !isToday(item.sentAt))}
                            isExpansible={true}
                            renderRow={(collec, index) => (
                                <CollectionExpandible key={index} collection={collec} />
                            )}
                            action={getActions}
                        />
                    )}

                    {view == 'messages' && (
                        <TableComponent
                            columns={messageCollectionColumns}
                            dataBase={messages.messages}
                            action={getActionsMessage}
                        />
                    )}
                </div>
            </main >


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

            {openDialogDeleteMessage && (
                <DeleteMessageForm
                    open={openDialogDeleteMessage}
                    setOpen={setOpenDialogDeleteMessage}
                    onDelete={deleteMessageAPI} />
            )}
        </div >
    )
}
