import { useState } from 'react'
import './SchedulePopup.css'
import { ScheduleFrequency, type PostScheduleDto } from '../../../interfaces/dto/schedules'
import TextInput from '../../../components/common/inputText/TextInput'
import DateInput from '../../../components/common/inputDate/DateInput'
import SelecteurInput from '../../../components/common/inputSelecteur/SelecteurInput'

const SchedulePopup = () => {

    const [page, setPage] = useState<"add" | "show">("show")

    const [form, setForm] = useState<PostScheduleDto>({
        amount: 0,
        name: "",
        startDate: new Date().toISOString(),
        type: "EXPENSE",
        frequency: ScheduleFrequency.MONTHLY,
        categoryId: 1,
        budgetId: 1,
        endDate: new Date().toISOString()
    })

    const sendForm = () => {
        console.log(form);
        // Lunch
    }

    const changePage = (page: "add" | "show") => {
        setPage(page)
    }

    const settings = () => page === "add" ? "Ajouter une échéance" : "Afficher les échéances"

    return (
        <div className='schedule-popup-container'>
          <div className='header-show-schedule'>
            <h2>{settings()}</h2>
            <button onClick={() => changePage(page === "add" ? "show" : "add")}> (-) </button>
          </div>
        
        {
            page === "add" ? (
                <div className='add-schedule'>
                        <TextInput
                            id='name' 
                            label='Nom' 
                            placeholder='Entrer un label'
                            value={form.name}
                            onChange={(value) => setForm({ ...form, name: value as string })}
                        />

                        <TextInput
                            id='amont' 
                            label='Montant'
                            placeholder='Entrer un montant'
                            type='number'
                            value={form.amount}
                            onChange={(value) => setForm({ ...form, amount: value as number })}
                        />

                        <SelecteurInput
                            id='frequency' 
                            label='Fréquence de prélevement'
                            onChange={(value) => setForm({ ...form, frequency: value as ScheduleFrequency})}
                        >
                            <option value=""> Selectionner une valeur </option>
                            {Object.values(ScheduleFrequency).map((freq) => (
                                <option value={freq}> {freq} </option>
                            ))}
                        </SelecteurInput>

                        <DateInput
                            id='start' 
                            label='Début'
                            placeholder='Entrer une date'
                            value={form.startDate}
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
                            <option></option>
                        </SelecteurInput>

                        <SelecteurInput
                            id='budget' 
                            label='Budget' 
                            onChange={(value) => setForm({ ...form, budgetId: parseInt(value) })}
                        >
                            <option value=""> Selectionner une valeur </option>
                        </SelecteurInput>

                        <button onClick={sendForm}> Créer </button>

                </div>
            ) : (
                <div className='show-schedule'>
                    <span>Nom</span>
                    <span>Prix</span>
                    <span>Date de fin</span>
                    <span>Date de début</span>
                    <button> Supprimer </button>
                </div>
            )
        }
        </div>
    )
}

export default SchedulePopup