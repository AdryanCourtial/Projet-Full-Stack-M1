import type { User } from "../authentification"
import type { Group } from "./groups"
import type { TransactionType } from "./schedules"

export interface Category {
    id: number
    name: string

    userId: number
    user?: User

    type: TransactionType
    updatedAt: Date
    createdAt: Date

    groupId: number
    group?: Group
}