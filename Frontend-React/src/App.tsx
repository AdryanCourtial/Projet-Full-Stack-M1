import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home/Home";
import Schedule from "./pages/Schedule/Schedule";
import MainBackground from "./components/common/MainBackground/MainBackground";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { ToastContainer } from "react-toastify";
import Authentificated from "./layout/Authentificated";
import Group from "./pages/Group/Group";
import PublicOnly from "./layout/PublicOnly";
import PrivateShell from "./layout/PrivateShell";

function App() {
  return (
    <>
      <ToastContainer aria-label={"toast container"} />
      <MainBackground>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />

          <Route element={<PublicOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<Authentificated />}>
            <Route element={<PrivateShell />}>
              <Route path="/home" element={<Home />} />
              <Route path="/settings" element={<Schedule />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/groupe" element={<Group />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </MainBackground>
    </>
  );
}

export default App;
