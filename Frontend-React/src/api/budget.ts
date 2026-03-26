import axiosClient from "../config/axios"
import type { Budget } from "../interfaces/dto/budget"

export default function BudgetsRequest() {

    const getBudgets = async (): Promise<Budget[]> => {
        const response = await axiosClient.get("budgets")

        if (response.status)
            return response.data

        throw Error('Une erreur est survenu lors de la récupération des données')

    }

    return {
        getBudgets
    }
}