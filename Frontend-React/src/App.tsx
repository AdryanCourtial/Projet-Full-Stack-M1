import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home/Home'
import Schedule from './pages/Schedule/Schedule'
import Authentification from './components/Authentifiaction/Authentification'
import MainBackground from './components/common/MainBackground/MainBackground'
import Navbar from './components/common/Navbar/Navbar'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'

function App() {

  return (
    <>
        <BrowserRouter>
          <Navbar />
          
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

            <Route
              path="/home"
              element={
                <Authentification>
                  <Home />
                </Authentification>
              }
            />

            <Route
              path='/schedule'
              element={
                <Authentification>
                  <Schedule />
                </Authentification>
              }
            />

            <Route
              path='/groupe'
              element={
                <Authentification>
                  <Schedule />
                </Authentification>
              }
            />

            <Route
              path='/settings'
              element={
                <Authentification>
                  <Schedule />
                </Authentification>
              }
            />
            
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
