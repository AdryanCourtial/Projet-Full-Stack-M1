import MainInteractiveContainer from '../../components/common/MainInteractiveContainer/MainInteractiveContainer'
import './Home.css'

function Home() {

  return (
      <main className='home-page'>

          <div className='container-solde-wallet' > 
            <p className='title'>Compte de Adryan COURTIAL</p>
            <h1> 1654,84 € </h1>
            <p> Solde à venir : 1565,65 €</p>
          </div>

        <MainInteractiveContainer>
            <div className='comming-mouvement'>
              <div className='flex-row justify-between align-center'>
                <h3>mouvement à venir</h3>
                <p>(-123,00 €)</p>
              </div>
            </div>
        </MainInteractiveContainer>

        <MainInteractiveContainer>
            <div className='text-green-primary test'
              > Hello HOME!
            </div>
        </MainInteractiveContainer>

      </main>
  )
}

export default Home

