import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home/Home'
import Schedule from './pages/Schedule/Schedule'
import MainBackground from './components/common/MainBackground/MainBackground'
import Navbar from './components/common/Navbar/Navbar'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify'
import Authentificated from './layout/Authentificated'

function App() {

  return (
    <>
      <ToastContainer aria-label={'toast container'} />
      <MainBackground>
        <Routes>

          <Route
            path="/login"
            element={
              <MainBackground>
                <Login />
              </MainBackground>
            }
          />

          <Route
            path="/register"
            element={
              <MainBackground>
                <Register />
              </MainBackground>
            }
          />

          <Route path='/' element={
            <>
              <Authentificated />
              <Navbar />
            </>
            }>

            <Route
              path="/home"
              element={<Home />}
            />

            <Route
              path='/settings'
              element={<Schedule />}
            />

            <Route
              path='/schedule'
              element={<Schedule />}
            />

            <Route
              path='/groupe'
              element={<Schedule />}
            />
          </Route>
          
        </Routes>
      </MainBackground>
    </>
  )
}

export default App
