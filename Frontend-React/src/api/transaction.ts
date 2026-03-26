import axiosClient from "../config/axios"
import type { GetFitlerTransaction, PutTransaction, Transaction } from "../interfaces/dto/transaction"
import { buildQuery } from "../utils/utils"

export default function TransationRequest() {

    const getTransation = async (filter: GetFitlerTransaction): Promise<Transaction[]> => {

        const query = buildQuery(filter)

        console.log(query)

        const response = await axiosClient.get("transactions" + query)

        if (response.status === 200) {
            return response.data
        }

        throw Error("Une erreur est survenu lors de la récupération des transactions")

    }

    const getTransactionSchedule = async (): Promise<Transaction[]> => {

        const response = await axiosClient.get("transactions/schedules")

        if (response.status === 200) {
            return response.data
        }

        throw Error("Une erreur est survenu lors de la récupération des transactions")
        
    }

    const putTransaction = async (id: number, data: PutTransaction): Promise<Transaction> => {

        const response = await axiosClient.put("transactions/" + id, data)

        if (response.status === 200) {
            return response.data
        }

        throw Error("Une erreur est survenu lors du changement de la transaction")
    }

    return {
        getTransation,
        getTransactionSchedule,
        putTransaction
    }
}