import { ScreenLoader } from "@/components/loaders/ScreenLoader"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Filter } from "@/components/table/Filter"
import { TableComponent } from "@/components/table/TableComponent"
import { useState, useEffect, useEffectEvent } from "react"
import { deleteMessageCollection, getCollection, getCollectionExcel, getCollectionHistory, getMessageCollection, postMessageCollection, postSendMessageCollection, putAllMessageCollection, putCollection, putMarkCollection, putMessageCollection } from "@/services/collection.service"
import { CollectionMessageBody, GroupCollection, GroupCollectionHistory, GroupMessages, ICollection, ICollectionHistory, IMessages, MarkBody, Message } from "@/interfaces/collection.interface"
import { clientCollectionColumns, collectionErrorsColumns, collectionHistoryColumns, isToday, messageCollectionColumns, normalColumns } from "./collection.data.tsx"
import { CollectionExpandible } from "./CollectionExpandible"
import { Button } from "@/components/ui/button"
import { IColumns } from "@/components/table/table.interface.ts";
import { notifyError } from "@/lib/error-feedback"
import { saveBlob } from "@/lib/download"

// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DialogComponent } from "@/components/dialog/DialogComponent.tsx"
import { CollectionForm, DeleteMessageForm } from "./CollectionForm.tsx"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { DropDownFilter } from "@/components/dropdownFilter/DropDownFilter.tsx"
import { CollectionActions } from "./CollectionActions.tsx"
// import { Switch } from "@/components/ui/switch.tsx"
import { IoMdSettings } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";

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
        try {
            const response: ICollection[] = await getCollection();
            if (response) {
                setCollections({
                    allCollections: response,
                    collections: response,
                });
            }
        } catch (error) {
            notifyError(error, 'No se pudieron cargar los mensajes.');
        } finally {
            setLoading(false)
        }
    }

    const getMessageCollectionApi = useEffectEvent(async () => {
        const response: IMessages[] = await getMessageCollection();

        const newColumns: IColumns<ICollection>[] = [
            // {
            //     column: 'message.title',
            //     label: 'Mensaje',
            //     element: (data: ICollection) => (
            //         <DropdownMenu>
            //             <DropdownMenuTrigger asChild>
            //                 <span className="rounded-lg px-2 bg-green-100 text-green-800">
            //                     {data.message ? data.message.title : ''}
            //                 </span>
            //             </DropdownMenuTrigger>
            //             <DropdownMenuContent>
            //                 {response && response.map((me: IMessages, index: number) => (
            //                     <DropdownMenuItem key={index} onClick={() => getActions('message.title', { ...data, messageId: me.id, message: me }, true)}>{me.title}</DropdownMenuItem>
            //                 ))}
            //             </DropdownMenuContent>
            //         </DropdownMenu>
            //     ),
            //     // className: () => "rounded-lg px-2 bg-green-100 text-green-800",
            //     orderBy: '',
            //     type: 'custom',
            //     icon: false,
            // },
            {
                column: 'send',
                label: 'Enviar',
                element: (data: ICollection) => (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Button className="text-white bg-green-600 hover:bg-green-700"  onClick={() => getActions('redirect-whatsApp', data)} >
                            <FaWhatsapp />
                        </Button>
                    </div>
                ),
                orderBy: '',
                type: 'custom',
                icon: false,
            }
            // {
            //     column: 'send',
            //     label: 'Enviar',
            //     element: (data: ICollection) => (
            //         <div onClick={(e) => e.stopPropagation()}>
            //             <Switch checked={data.send} onCheckedChange={(value) => getActions('send', { ...data, send: value }, true)} />
            //         </div>
            //     ),
            //     orderBy: '',
            //     type: 'custom',
            //     icon: false,
            // }
        ]

        setColumns([...clientCollectionColumns, ...newColumns])
        if (response) {
            setMessages({
                allMessages: response,
                messages: response,
            });
        }
    })

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

        if (action == 'redirect-whatsApp') {
            return handleSendReminder(data as ICollection);
        }

        if (byColumn) {
            const updateData = {
                messageId: data.messageId,
                send: data.send
            }

            try {
                await putCollection(data.id, updateData);
            } catch {
                // El interceptor ya notificó el error. La tabla queda como quedó
                // en el render optimista: se sincroniza al recargar.
            }
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
        // El estado local se actualiza solo si la escritura se completó. Antes se
        // hacía igual en ambos casos, así que un fallo de red dejaba el mensaje
        // "guardado" en pantalla sin estar en el servidor.
        try {
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
        } catch {
            // El formulario permanece abierto con los datos ya escritos.
        }
    }

    const deleteMessageAPI = async (actionDelete: boolean) => {
        if (actionDelete && messageSelected) {
            try {
                await deleteMessageCollection(messageSelected.id);
                setMessages(prev => ({
                    ...prev,
                    messages: prev.messages.filter(item => item.id != messageSelected.id),
                }));
                // await getMessageCollectionApi();
            } catch {
                return;
            }
        }
        setOpenDialogDeleteMessage(false);
    }

    const sendMessage = async () => {
        setLoading(true);
        try {
            await postSendMessageCollection();
        } catch {
            // El interceptor ya notificó el error.
        } finally {
            setLoading(false);
        }
    }

    const toggleSendData = (send: boolean) => {
        setMarkAll(send)
        markCollections({ send: send })
    }

    const updateAllMessageClient = async (messageId: number) => {
        const findMessage = messages.allMessages.find(item => item.id == messageId) as Message;

        // Se llama desde onClick sin await: el fallo se absorbe acá para no dejar
        // una promesa rechazada sin manejar.
        try {
            await putAllMessageCollection(messageId);
        } catch {
            return;
        }

        // El estado local se actualiza solo si el servidor confirmó el cambio.
        setCollections(prev => ({
            ...prev,
            collections: prev.collections.map(item => ({
                ...item,
                messageId: messageId,
                message: findMessage
            }))
        }))
    }

    const markCollections = async (mark: MarkBody) => {
        try {
            await putMarkCollection(mark);
        } catch {
            return;
        }

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

    const exportExcelCollection = async () => {
        try {
            const response = await getCollectionExcel();
            saveBlob(response, `Cobranza.xlsx`);
        } catch (error) {
            notifyError(error, 'No se pudo exportar la cobranza.');
        }
    }

    const handleSendReminder = (colletion: ICollection) => {
        // 1. Normalizar el número: dejamos solo los dígitos
        const cleanPhone = colletion.client.phone.replace(/\D/g, '');

        // 2. Armar el mensaje amigable
        // const message = `¡Hola, ${invoice.clientName}! Esperamos que los despachos de café estén yendo excelente. ☕\n\nTe escribimos para dejarte este recordatorio amistoso de que la factura #${invoice.invoiceNumber} por $${invoice.amount} está pendiente. ¿Te podemos ayudar con algo?\n\n¡Quedamos a la orden!`;

        // 3. Codificar el mensaje para la URL
        // const encodedMessage = encodeURIComponent(message);

        // 4. Construir el link final
        // const waLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        const waLink = `https://wa.me/${cleanPhone}`;

        // 5. Abrir en una nueva pestaña
        window.open(waLink, '_blank');
    };

    return (
        <div className="flex h-full flex-col">
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
                            <TabsTrigger variant='secondary' value="collection">Cobranza</TabsTrigger>
                            <TabsTrigger variant='secondary' value="messages">Mensajes</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </header>

            <main className="flex-1 min-h-0 overflow-y-auto p-4 md:px-6">
                <div className="flex lg:flex-row flex-col items-center justify-between mb-6">
                    <div className="flex items-end gap-2 lg:mt-0 -mt-4">
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
                    <div className="flex items-center gap-2 lg:mt-0 mt-2">
                        <Button onClick={exportExcelCollection} className="bg-green-700 hover:bg-green-600 text-white lg:flex hidden">
                            <RiFileExcel2Line className=" font-bold" /> Exportar
                        </Button>
                        <div className="flex w-80 items-center space-x-2">
                            {view == 'collection'
                                ? <Filter dataBase={collections.allCollections} columns={columns} setDataFilter={setFilterCollection} />
                                : <Filter dataBase={messages.allMessages} columns={messageCollectionColumns} setDataFilter={setFilterMessage} />
                            }
                        </div>

                        <Button onClick={sendMessage} className="bg-[#6f4e37] text-white hover:bg-[#7a5b45] lg:block hidden">Enviar mensajes</Button>

                        <div className="-mt-6 lg:block hidden">
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
