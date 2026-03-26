import React, { useEffect, useState } from 'react'
import './SchedulePopup.css'
import { ScheduleFrequency, type PostScheduleDto, type Schedule } from '../../../interfaces/dto/schedules'
import TextInput from '../../../components/common/inputText/TextInput'
import DateInput from '../../../components/common/inputDate/DateInput'
import SelecteurInput from '../../../components/common/inputSelecteur/SelecteurInput'
import CategoriesRequest from '../../../api/categories'
import type { Category } from '../../../interfaces/dto/category'
import type { Budget } from '../../../interfaces/dto/budget'
import BudgetsRequest from '../../../api/budget'
import SchedulesRequest from '../../../api/schedules'
import { formatDateToMMDDYYYY } from '../../../utils/utils'

interface Props {
    closePopup: () => void,
    addSchedule: (schedule: Schedule) => void
}

const SchedulePopup: React.FC<Props> = ({ closePopup, addSchedule }) => {

    const [categories, setCategories] = useState<Category[]>([])
    const [budget, setBudget] = useState<Budget[]>([])
    const [schedules, setSchedule] = useState<Schedule[]>()

    useEffect(() => {

        // Récupération des Catégories
        CategoriesRequest().getCategories().then((data) => {
            setCategories(data)
        })

        //Récupération des Budgets
        BudgetsRequest().getBudgets().then((data) => {
            setBudget(data)
        })

        // Récupération des Schedules
        SchedulesRequest().getSchedules().then((data) => {
            setSchedule(data)
        })

    }, [])

    const [page, setPage] = useState<"add" | "show">("show")


    const [form, setForm] = useState<PostScheduleDto>({
        amount: 0,
        name: "",
        startDate: new Date().toISOString(),
        type: "EXPENSE",
        frequency: ScheduleFrequency.MONTHLY,
        categoryId: 1,
        budgetId: undefined,
        endDate: undefined
    })

    const sendForm = () => {
        SchedulesRequest().postSchedule(form).then((data) => {
            closePopup()
            addSchedule(data)
        })
    }

    const deleteSchedules = (schedule: Schedule) => {
        console.log("Suppression de ce schedule :", schedule)
        const verif = window.confirm("Etes-vous sûr de vouloir supprimer cette échéance ?")

        if (!verif || !schedules) return

        SchedulesRequest().deleteSchedules(schedule.id).then(() => {
            const newScheduleTab = schedules.filter((sc) => sc.id !== schedule.id)
            setSchedule(newScheduleTab)
        })

    }
    const changePage = (page: "add" | "show") => {
        setPage(page)
    }

    const settings = () => page === "add" ? "Ajouter une échéance" : "Afficher les échéances"

    return (
        <div className='schedule-popup-container'>
          <div className='header-show-schedule'>
            <h2>{settings()}</h2>
            <button onClick={() => changePage(page === "add" ? "show" : "add")}> (+) </button>
          </div>
        
        {
            page === "add" ? (
                <div className='add-schedule'>
                        <TextInput
                            id='name' 
                            label='Nom'
                            dark={false}
                            placeholder='Entrer un label'
                            value={form.name}
                            onChange={(value) => setForm({ ...form, name: value as string })}
                        />

                        <TextInput
                            id='amont' 
                            label='Montant'
                            dark={false}
                            placeholder='Entrer un montant'
                            type='number'
                            value={form.amount}
                            onChange={(value) => setForm({ ...form, amount: value as any })}
                        />

                        <SelecteurInput
                            id='frequency' 
                            label='Fréquence de prélevement'
                            onChange={(value) => setForm({ ...form, frequency: value as ScheduleFrequency})}
                        >
                            <option value=""> Selectionner une valeur </option>
                            <option value={ScheduleFrequency.MONTHLY}> Tous les mois</option>
                            <option value={ScheduleFrequency.YEARLY}> Tous les ans</option>
                        </SelecteurInput>

                        <DateInput
                            id='start' 
                            label='Début'
                            placeholder='Entrer une date'
                            value={form.startDate ?? ""}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        />

                        <DateInput
                            id='end' 
                            label='Fin' 
                            placeholder='Entrer une date'
                            value={form.endDate ?? ""}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        />

                        <SelecteurInput
                            id='category'
                            label='Catégorie' 
                            onChange={(value) => setForm({ ...form, categoryId: parseInt(value) })}
                        >
                            <option value=""> Selectionner une valeur </option>
                            {
                                categories.map((category) => (
                                    <option value={category.id}> {category.name} </option>
                                ))
                            }
                        </SelecteurInput>

                        <SelecteurInput
                            id='budget' 
                            label='Budget' 
                            onChange={(value) => setForm({ ...form, budgetId: parseInt(value) })}
                        >
                            <option value=""> Selectionner une valeur </option>
                            {
                                budget.map((budget) => (
                                    <option value={budget.id}> {budget.name} </option>
                                ))
                            }
                        </SelecteurInput>

                    <button 
                        onClick={sendForm}
                        className=''
                    > Créer </button>
                </div>
            ) : (
                <table className='show-schedule'>
                    <thead>
                        <tr>
                            <th> Nom </th>
                            <th> Prix </th>
                            <th> Commence le </th>
                            <th> Fini le </th>
                        </tr>
                    </thead>
                    <tbody>
                        { schedules && (
                            schedules.map((schedule) => (
                            <tr>
                                <td>{schedule.name}</td>
                                <td>{schedule.amount}€</td>
                                <td>{formatDateToMMDDYYYY(schedule.startDate)}</td>
                                <td>{schedule.endDate ? formatDateToMMDDYYYY(schedule.endDate) : "N/A"}</td>
                                <td>
                                    <button onClick={() => deleteSchedules(schedule)}> Supprimer </button>
                                </td>
                            </tr>
                            ))
                            )
                        }   
                    </tbody>
                </table>
            )
        }
        </div>
    )
}

export default SchedulePopup