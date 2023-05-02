export type User = {
    username: string
    password: string
    full_name: string
    email: string
    phone: string
    gender?: string | null
    age_range?: string | null
}

export type DBReturn = {
    affectedRows: number
}
