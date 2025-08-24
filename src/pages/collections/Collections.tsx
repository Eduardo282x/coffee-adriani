import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Filter } from "@/components/table/Filter"
import { TableComponent } from "@/components/table/TableComponent"
import { useState, useEffect } from "react"
import { deleteMessageCollection, getCollection, getCollectionHistory, getMessageCollection, postMessageCollection, postSendMessageCollection, putAllMessageCollection, putCollection, putMarkCollection, putMessageCollection } from "@/services/collection.service"
import { CollectionMessageBody, GroupCollection, GroupCollectionHistory, GroupMessages, ICollection, ICollectionHistory, IMessages, MarkBody, Message } from "@/interfaces/collection.interface"
import { clientCollectionColumns, collectionErrorsColumns, collectionHistoryColumns, isToday, messageCollectionColumns, normalColumns } from "./collection.data.tsx"
import { CollectionExpandible } from "./CollectionExpandible"
import { Button } from "@/components/ui/button"
import { IColumns } from "@/components/table/table.interface.ts";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DialogComponent } from "@/components/dialog/DialogComponent.tsx"
import { CollectionForm, DeleteMessageForm } from "./CollectionForm.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { DropDownFilter } from "@/components/dropdownFilter/DropDownFilter.tsx"
import { CollectionActions } from "./CollectionActions.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { IoMdSettings } from "react-icons/io"

type TypesViews = 'collection' | 'messages';
type CollectionTypes = 'collection' | 'messages' | 'sended' | 'no-sended' | 'history' | 'errors';

export const Collections = () => {
    const [messages, setMessages] = useState<GroupMessages>({ allMessages: [], messages: [] });
    const [collections, setCollections] = useState<GroupCollection>({ allCollections: [], collections: [] });
    const [collectionsHistory, setCollectionsHistory] = useState<GroupCollectionHistory>({ allCollections: [], collections: [] });
    const [columns, setColumns] = useState<IColumns<ICollection>[]>(clientCollectionColumns);
    const [loading, setLoading] = useState<boolean>(false);
    const [view, setView] = useState<TypesViews>('collection');
    const [viewMessages, setViewMessages] = useState<CollectionTypes>('collection');
    // const [showMessage, setShowMessages] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [openDialogDeleteMessage, setOpenDialogDeleteMessage] = useState<boolean>(false);
    const [markAll, setMarkAll] = useState<boolean>(false);
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
        const response: IMessages[] = await getMessageCollection();

        const newColumns: IColumns<ICollection>[] = [
            {
                column: 'message.title',
                label: 'Mensaje',
                element: (data: ICollection) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
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
                    <div onClick={(e) => e.stopPropagation()}>
                        <Switch checked={data.send} onCheckedChange={(value) => getActions('send', { ...data, send: value }, true)} />
                    </div>
                    // <DropdownMenu>
                    //     <DropdownMenuTrigger>
                    //         <span className={`${getSendVariant(data.send)}`}>
                    //             {data.send == true ? 'Enviar' : 'No enviar'}
                    //         </span>
                    //     </DropdownMenuTrigger>
                    //     <DropdownMenuContent>
                    //         <DropdownMenuItem onClick={() => getActions('send', { ...data, send: true }, true)}>Enviar</DropdownMenuItem>
                    //         <DropdownMenuItem onClick={() => getActions('send', { ...data, send: false }, true)}>No Enviar</DropdownMenuItem>
                    //     </DropdownMenuContent>
                    // </DropdownMenu>
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
    }

    const getCollectionHistoryApi = async () => {
        const response: ICollectionHistory[] = await getCollectionHistory();
        if (response) {
            setCollectionsHistory({
                allCollections: response,
                collections: response,
            });
        }
    }

    useEffect(() => {
        getCollectionsApi();
        getCollectionHistoryApi();
        getMessageCollectionApi();
    }, [])

    const setFilterCollection = (collections: ICollection[]) => {
        setCollections(prev => {
            return {
                ...prev,
                collections
            }
        })
    };

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

    const getActions = async (action: string, data: ICollection | ICollectionHistory, byColumn?: boolean) => {
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
            const updateData = {
                messageId: data.messageId,
                send: data.send
            }

            await putCollection(data.id, updateData);
        }

    }
    const getActionsMessage = (action: string, data: IMessages) => {
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
            await putMessageCollection(messageSelected.id, message);
            const updatedMessage = {
                ...messageSelected,
                title: message.title,
                content: message.content,
                updatedAt: new Date(),
            };
            setMessages(prev => ({
                ...prev,
                messages: prev.messages.map(item => item.id == messageSelected.id ? updatedMessage : item),
            }));
        } else {
            await postMessageCollection(message);
            const newMessage = {
                id: Math.floor(Math.random() * 1000) + 100, // Simula un ID único
                title: message.title,
                content: message.content,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, newMessage],
            }));
        }
        setOpenDialog(false);
        // await getMessageCollectionApi();
    }

    const deleteMessageAPI = async (actionDelete: boolean) => {
        if (actionDelete && messageSelected) {
            await deleteMessageCollection(messageSelected.id);
            setMessages(prev => ({
                ...prev,
                messages: prev.messages.filter(item => item.id != messageSelected.id),
            }));
            // await getMessageCollectionApi();
        }
        setOpenDialogDeleteMessage(false);
    }

    const sendMessage = async () => {
        setLoading(true);
        await postSendMessageCollection();
        setLoading(false);
    }

    const toggleSendData = (send: boolean) => {
        setMarkAll(send)
        markCollections({ send: send })
    }

    const updateAllMessageClient = async (messageId: number) => {
        const findMessage = messages.allMessages.find(item => item.id == messageId) as Message;
        setCollections(prev => ({
            ...prev,
            collections: prev.collections.map(item => ({
                ...item,
                messageId: messageId,
                message: findMessage
            }))
        }))

        await putAllMessageCollection(messageId);
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
        await putMarkCollection(mark);
    }

    useEffect(() => {
        setMarkAll(collections.collections.filter(item => item.send == true).length == collections.collections.length)
    }, [collections.collections]);

    const setClassName = (type: CollectionTypes): string => {
        if (viewMessages == type) {
            return 'bg-gray-200 px-2 py-1 cursor-pointer rounded-md'
        }
        return 'hover:bg-gray-200 px-2 py-1 cursor-pointer rounded-md'
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
                        defaultValue="collection"
                        value={view}
                        onValueChange={(value) => { setView(value as TypesViews); setViewMessages(value as TypesViews) }}>
                        <TabsList>
                            <TabsTrigger value="collection">Cobranza</TabsTrigger>
                            <TabsTrigger value="messages">Mensajes</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-end gap-2">
                        <h2 className="text-2xl font-bold tracking-tight text-[#6f4e37] mb-2">Gestión de Cobranza</h2>
                        {view == 'collection' &&
                            <DropDownFilter>
                                <div className="flex flex-col gap-1">
                                    <p className={`${setClassName('collection')}`} onClick={() => setViewMessages('collection')}>Todos</p>
                                    <p className={`${setClassName('sended')}`} onClick={() => setViewMessages('sended')}>Enviados</p>
                                    <p className={`${setClassName('no-sended')}`} onClick={() => setViewMessages('no-sended')}>No Enviados</p>
                                    <p className={`${setClassName('history')}`} onClick={() => setViewMessages('history')}>Historial</p>
                                    <p className={`${setClassName('errors')}`} onClick={() => setViewMessages('errors')}>Errores</p>
                                </div>
                            </DropDownFilter>
                        }
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex w-80  items-center space-x-2">
                            {view == 'collection'
                                ? <Filter dataBase={collections.allCollections} columns={columns} setDataFilter={setFilterCollection} />
                                : <Filter dataBase={messages.allMessages} columns={messageCollectionColumns} setDataFilter={setFilterMessage} />
                            }
                        </div>

                        <Button onClick={sendMessage} className="bg-[#6f4e37] text-white hover:bg-[#7a5b45]">Enviar mensajes</Button>

                        <div className="-mt-6">
                            <DropDownFilter customIcon={IoMdSettings}>
                                <CollectionActions
                                    markAll={markAll}
                                    changeMessage={updateAllMessageClient}
                                    toggleSendData={toggleSendData}
                                    messages={messages.allMessages}
                                />
                            </DropDownFilter>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border">
                    {viewMessages == 'collection' && (
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
                    {viewMessages == 'sended' && (
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
                    {viewMessages == 'no-sended' && (
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
                    {viewMessages == 'history' && (
                        <TableComponent
                            columns={collectionHistoryColumns}
                            dataBase={collectionsHistory.collections}
                            action={getActions}
                        />
                    )}
                    {viewMessages == 'errors' && (
                        <TableComponent
                            columns={collectionErrorsColumns}
                            dataBase={collectionsHistory.collections.filter(item => item.sended == false)}
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
