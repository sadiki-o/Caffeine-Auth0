export interface Drink {
    id: number
    title: string
    recipe: {
        name?: string
        color: string
        parts: number
    }[]
}

export interface User{
    user_id: string
    email: string
    name: string
    picture: string
    blocked: boolean
    blockUser: (token: string, id: string) => Promise<boolean>
    unblockUser: (token: string, id: string) => Promise<boolean>
    deleteUser?: (token: string, id: string) => Promise<boolean>
    refreshUsers?: () => void
}

export type Trole = ("admin" | "manager" | "barista")
