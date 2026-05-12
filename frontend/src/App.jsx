import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import MascotasPage from './pages/MascotasPage'
import { ServiciosPage } from './pages/ServiciosPage'
import AtencionesPage from './pages/AtencionesPage'
import UsuariosPage from './pages/UsuariosPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/mascotas" element={<MascotasPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/atenciones" element={<AtencionesPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App