import { create } from 'zustand'
import { GroupUsers, IUsers } from '@/interfaces/user.interface'
import { getUsers, deleteUsers } from '@/services/user.service';

interface UserState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    users: GroupUsers;
    setUsers: (users: GroupUsers) => void;
    getUsersApi: () => Promise<void>;
    // addUsers: () => void;
    // editUser: () => void;
    deleteUser: (id: number) => void;
}

export const userStore = create<UserState>((set) => ({
    users: { allUsers: [], users: [] },
    loading: false,
    setLoading: (loading: boolean) => { (set(() => ({ loading }))) },
    setUsers: (users: GroupUsers) => set(() => ({ users })),
    getUsersApi: async () => {
        const response: IUsers[] = await getUsers();
        if (response && response.length > 0) {
            set(() => ({
                users: { allUsers: response, users: response }
            }))
        }
    },
    deleteUser: async (id: number) => {
        await deleteUsers(id);
        set((state) => {
            const userDeleted = state.users.allUsers.filter((us: IUsers) => us.id != id);
            return {
                users: { allUsers: userDeleted, users: userDeleted }
            };
        });
    }
}))