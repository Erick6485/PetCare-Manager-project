import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/common/PrivateRoute'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClientesPage from './pages/ClientesPage'
import MascotasPage from './pages/MascotasPage'
import { ServiciosPage } from './pages/ServiciosPage'
import AtencionesPage from './pages/AtencionesPage'
import UsuariosPage from './pages/UsuariosPage'
import RecepcionistaPage from './pages/RecepcionistaPage'
import PeluqueroPage from './pages/PeluqueroPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Solo ADMINISTRADOR */}
          <Route path="/dashboard" element={
            <PrivateRoute roles={['ADMINISTRADOR']}>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/usuarios" element={
            <PrivateRoute roles={['ADMINISTRADOR']}>
              <UsuariosPage />
            </PrivateRoute>
          } />
          <Route path="/servicios" element={
            <PrivateRoute roles={['ADMINISTRADOR']}>
              <ServiciosPage />
            </PrivateRoute>
          } />

          {/* ADMINISTRADOR + RECEPCIONISTA */}
          <Route path="/clientes" element={
            <PrivateRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <ClientesPage />
            </PrivateRoute>
          } />
          <Route path="/mascotas" element={
            <PrivateRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <MascotasPage />
            </PrivateRoute>
          } />
          <Route path="/atenciones" element={
            <PrivateRoute roles={['ADMINISTRADOR', 'RECEPCIONISTA']}>
              <AtencionesPage />
            </PrivateRoute>
          } />

          {/* Solo RECEPCIONISTA (y admin como respaldo) */}
          <Route path="/recepcionista" element={
            <PrivateRoute roles={['RECEPCIONISTA', 'ADMINISTRADOR']}>
              <RecepcionistaPage />
            </PrivateRoute>
          } />

          {/* Solo PELUQUERO */}
          <Route path="/peluquero" element={
            <PrivateRoute roles={['PELUQUERO']}>
              <PeluqueroPage />
            </PrivateRoute>
          } />

          {/* Cualquier ruta desconocida → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App