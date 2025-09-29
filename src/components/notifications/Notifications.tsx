import { INotification } from '@/interfaces/notifications.interface';
import { getNotifications, markNotificationAsRead } from '@/services/notifications.service';
import { useEffect, useRef, useState } from 'react'
import { IoIosNotifications, IoIosNotificationsOutline } from 'react-icons/io';

export const Notifications = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [countNotifications, setCountNotifications] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const getNotificationsApi = async () => {
        try {
            const response = await getNotifications() as INotification[];
            setNotifications(response);
            setCountNotifications(response.filter(item => item.seen === false).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        getNotificationsApi();
    }, []);

    const handleNotificationsClick = () => {
        setOpen(!open);
    }

    const readNotifications = async (id: number) => {
        const updatedNotifications = notifications.map(noti => ({
            ...noti,
            seen: noti.id === id ? true : noti.seen
        }));
        await markNotificationAsRead(id);
        setNotifications(updatedNotifications);
        setCountNotifications(updatedNotifications.filter(item => item.seen === false).length);
    }

    return (
        <div className='relative' ref={notificationsRef}>

            <div onClick={handleNotificationsClick} className='mx-4 cursor-pointer relative'>
                {countNotifications == 0 ?
                    <IoIosNotificationsOutline size={25} />
                    :
                    <IoIosNotifications size={25} />
                }

                {countNotifications > 0 && (
                    <span className='absolute -top-2 -right-2 bg-[#a1887f] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                        {countNotifications}
                    </span>
                )}
            </div>

            {open && (
                <div className='absolute right-0 mt-2 w-80 bg-gray-100 border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center'>
                    {notifications.length === 0 ? (
                        <p className='text-gray-600'>No hay notificaciones</p>
                    ) : (
                        <ul className='max-h-[30rem] overflow-y-auto'>
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    onClick={() => readNotifications(notification.id)}
                                    className={`cursor-pointer mb-2 p-2 rounded ${notification.seen ? 'bg-white' : 'bg-[#ebe0d2] font-semibold'}`}
                                >
                                    <p className='text-sm text-black'>{notification.message}</p>
                                    <p className='text-xs text-gray-500'>{new Date(notification.createdAt).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
