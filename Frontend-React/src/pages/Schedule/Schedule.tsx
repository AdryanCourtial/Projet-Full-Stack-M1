import { useEffect, useState } from 'react'
import MainInteractiveContainer from '../../components/common/MainInteractiveContainer/MainInteractiveContainer'
import Popup from '../../components/common/Popup/Popup'
import SchedulePopup from './Popup/SchedulePopup'
import './Schedule.css'
import CheckboxInput from '../../components/common/inputCheckbox/inputCheckbox'
import TransationRequest from '../../api/transaction'
import type { Schedule } from '../../interfaces/dto/schedules'
import type { Transaction } from '../../interfaces/dto/transaction'
import Feedback from '../../components/common/Feedback/Feedback'
import { formatDateToMMDDYYYY } from '../../utils/utils'

function Schedule() {

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [transactions, setTransaction] = useState<Transaction[]>()

    const openPopup = () => setIsPopupOpen(true)
    const closePopup = () => setIsPopupOpen(false)

    useEffect(() => {
      TransationRequest().getTransactionSchedule().then((data) => {
        setTransaction(data)
        console.log("Schedules : ", data)
      })
    }, [])

    const toggleCheckbox = (value: boolean, transaction: Transaction) => {

      TransationRequest().putTransaction(transaction.id, {
        paymentStatus: value
      }).then(() => {
        setTransaction((prev) => {
          if (!prev) return prev;
  
          return prev.map((item) =>
            item.id === transaction.id
              ? { ...item, paymentStatus: value }
              : item
          );
        });
        console.log(transactions)
      }) 
    }


  return (
    <>
      <div className='schedule-container container'>
        <MainInteractiveContainer>
          <h1 className='text-4xl font-bold'>Echéancier</h1>
        </MainInteractiveContainer>
        
        <MainInteractiveContainer style={{
          gap: "1em",
          display: "flex",
          flexDirection: "column",
          width: "800px"
        }}>
          <button className='btn btn-primary mb-4' onClick={openPopup}>Gérer les échéances</button>
          <table className='table'>
            <thead>
              <tr>
                <th>Label</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Pointer</th>
              </tr>
            </thead>
            <tbody>
              { transactions?.length ? (
                transactions.map((tr) => (
                    <tr>
                      <td>{tr.schedule?.name}</td>
                      <td>{formatDateToMMDDYYYY(tr.date)}</td>
                      <td>{tr.amount}$</td>
                      <CheckboxInput 
                        id='check-schedule'
                        label=''
                        key={tr.id}
                        onChange={(value) => toggleCheckbox(value, tr)}
                        value={tr.paymentStatus}
                      />
                    </tr>
                ))
                ) : <Feedback feedBack={{
                  text: "Aucune échéance pour le mois",
                  type: "error"
                }} />
              }
            </tbody>
          </table>
        </MainInteractiveContainer>

        <Popup isOpen={isPopupOpen} onClose={closePopup}>

          <SchedulePopup />

        </Popup>
      </div>
      
    </>
  )
}

export default Schedule

