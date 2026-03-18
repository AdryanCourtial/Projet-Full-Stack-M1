import { useState } from 'react'
import './SchedulePopup.css'
import { ScheduleFrequency, type PostScheduleDto } from '../../../interfaces/dto/schedules'
import TextInput from '../../../components/common/inputText/TextInput'

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
                    <form action="">
                        <TextInput
                            id='name' 
                            label='Nom' 
                            placeholder='Entrer un label'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <TextInput
                            id='amont' 
                            label='Montant'
                            placeholder='Entrer un montant'
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) })}
                        />

                        <TextInput
                            id='name' 
                            label='Nom' 
                            placeholder='Entrer un label'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <TextInput
                            id='name' 
                            label='Nom' 
                            placeholder='Entrer un label'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <TextInput
                            id='name' 
                            label='Nom' 
                            placeholder='Entrer un label'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <TextInput
                            id='name' 
                            label='Nom' 
                            placeholder='Entrer un label'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <TextInput
                            id='name' 
                            label='Nom' 
                            placeholder='Entrer un label'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />


                    </form>
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