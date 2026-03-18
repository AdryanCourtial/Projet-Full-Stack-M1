import { useState } from 'react'
import TextInput from '../../components/common/inputText/TextInput'
import './Register.css'
import type { RegisterDto } from '../../interfaces/dto/auth'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router'

function Register() {

  const { register } = useAuth();

  const [form, setForm] = useState<RegisterDto>({
    email: "",
    password: "",
    password_confirmation: "",
    firstName: "",
    lastName: "",
    username: "",
  })

  const sendForm = () => {
    console.log(form);
    register(form);
  }

  return (
    <main>
      <div className='main-container'>
        <div className='bg-white-primary global-container'>
          <h1> Inscription </h1>

          <form action="" className='form-register'>
            <TextInput
              id='firstname' 
              label='Prénom' 
              placeholder='Entrer un prénom'
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />

            <TextInput
              id='lastname' 
              label='Nom de famille' 
              placeholder='Entrer un nom de famille'
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />

            <TextInput
              id='email' 
              label='Email' 
              placeholder='Entrer une adresse email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextInput
              id='password' 
              label='Mot de passe'
              password
              placeholder='Entrer un mot de passe sécurisé'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <TextInput
              id='password_confirmation' 
              label='Confirmation du mot de passe'
              password
              placeholder='Confirmer votre mot de passe sécurisé'
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            />
          </form>

          <Link to={'/login'} >Vous voulez vous connecter ?</Link>

          <button onClick={sendForm}> S'inscrire </button>
        </div>

        <div className='constainer side-container bg-glass-400'>

        </div>
      </div>
    </main>
  )
}

export default Register

