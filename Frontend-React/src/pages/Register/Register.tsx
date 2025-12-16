import TextInput from '../../components/common/inputText/TextInput'
import './Register.css'

function Register() {

  return (
    <main>
      <div className='main-container'>
        <div className='bg-white-primary global-container'>
          <h1> Inscription </h1>

          <form action="" className='form-register'>
            <TextInput id='firstname' label='Prénom' placeholder='Entrer un nom de famille' />
            <TextInput id='name' label='Nom' placeholder='Entrer un prénom' />
            <TextInput id='email' label='Email' placeholder='Entrer une adresse email' />
            <TextInput id='password' label='Mot de passe' placeholder='Entrer un mot de passe sécurisé' />
            <TextInput id='confirm-password' label='Confirmation du Mot de passe' placeholder='Confirmer votre mot de passe sécurisé' />
          </form>

          <button> S'inscrire </button>
        </div>

        <div className='constainer side-container bg-glass-400'>

        </div>
      </div>
    </main>
  )
}

export default Register

