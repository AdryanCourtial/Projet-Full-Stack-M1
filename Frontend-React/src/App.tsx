import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home/Home'
import Schedule from './pages/Schedule/Schedule'
import Authentification from './components/Authentifiaction/Authentification'
import MainBackground from './components/common/MainBackground/MainBackground'
import Navbar from './components/common/Navbar/Navbar'

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
                  <Home />
                </MainBackground>
              }
            />


            <Route
              path="/signin"
              element={
                <MainBackground>
                  <Home />
                </MainBackground>
              }
            />


            <Route
              path="/home"
              element={
                <MainBackground>
                  <Home />
                </MainBackground>
              }
            />

            <Route
              path='/schedule'
              element={
                <MainBackground>
                  <Schedule />
                </MainBackground>
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
