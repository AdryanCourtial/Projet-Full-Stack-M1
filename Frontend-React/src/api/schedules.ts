import axiosClient from "../config/axios"
import type { PostScheduleDto, Schedule } from "../interfaces/dto/schedules"

export default function SchedulesRequest() {

    const getSchedules = async (): Promise<Schedule[]> => {
        const response = await axiosClient.get("schedules")

        if (response.status) {
            return response.data
        }

        throw Error('Une erreur est survenu lors de la récupération des données ')

    }

    const postSchedule = async (data: PostScheduleDto): Promise<Schedule[]> => {

        const response = await axiosClient.post("schedules", data)

        if (response.status) {
            return response.data
        }

        throw Error('Une erreur est survenu lors de la récupération des données ')

    }

    const deleteSchedules = async (id: number): Promise<Schedule> => {
        const response = await axiosClient.delete("schedules/" + id)

        if (response.status) {
            return response.data
        }

        throw Error('Une erreur est survenu lors de la suppression de la donnée ')

    }

    return {
        getSchedules,
        postSchedule,
        deleteSchedules
    }
}