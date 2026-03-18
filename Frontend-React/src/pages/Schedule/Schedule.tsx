import { useState } from 'react'
import MainInteractiveContainer from '../../components/common/MainInteractiveContainer/MainInteractiveContainer'
import Popup from '../../components/common/Popup/Popup'
import SchedulePopup from './Popup/SchedulePopup'
import './Schedule.css'

function Schedule() {

    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const openPopup = () => setIsPopupOpen(true)
    const closePopup = () => setIsPopupOpen(false)


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
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Pointer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-07-01</td>
                <td>1000€</td>
                <td>Payé</td>
                <td><input type="checkbox" /></td>
              </tr>
              <tr>
                <td>2024-08-01</td>
                <td>1000€</td>
                <td>En attente</td>
                <td><input type="checkbox" /></td>
              </tr>
              <tr>
                <td>2024-09-01</td>
                <td>1000€</td>
                <td>En attente</td>
                <td><input type="checkbox" /></td>
              </tr>
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

