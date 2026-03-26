import axiosClient from "../config/axios"
import type { Category } from "../interfaces/dto/category"

export default function CategoriesRequest() {

    const getCategories = async (): Promise<Category[]> => {
        const response = await axiosClient.get("categories")

        if (response.status) {
            console.log("Récupération des données Category : ", response.data)
            return response.data
        }

        throw Error('Une erreur est survenu lors de la récupération des données ')

    }

    return {
        getCategories
    }
}