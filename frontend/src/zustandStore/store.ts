import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand'
import { Trole, User } from '../types/types';



interface authState {
    token: string | undefined
    role: Trole | undefined
    setRole: (newRole: Trole | undefined) => void
    setToken: (newToken: string) => void
}


const useStore = create<authState>((set) => ({
    token: undefined,
    role: undefined,
    setRole: (newRole) => set({role: newRole}),
    setToken: (newToken: string) => set({token: newToken}),
}))

export default useStore;

if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('Store', useStore);
}