import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Envuelve rutas que requieren sesión activa.
 * roles: array opcional de roles permitidos, ej: ['ADMINISTRADOR', 'RECEPCIONISTA']
 * Si el usuario no tiene el rol requerido, lo manda a su página correspondiente.
 */
export default function PrivateRoute({ children, roles }) {
    const { isAuthenticated, user, cargando } = useAuth()

    // Mientras recupera la sesión de localStorage, no redirigir aún
    if (cargando) return null

    // Sin sesión → al login
    if (!isAuthenticated) return <Navigate to="/login" replace />

    // Con sesión pero sin el rol requerido → a su página propia
    if (roles && !roles.includes(user?.rol)) {
        if (user?.rol === 'PELUQUERO') return <Navigate to="/peluquero" replace />
        if (user?.rol === 'RECEPCIONISTA') return <Navigate to="/recepcionista" replace />
        return <Navigate to="/dashboard" replace />
    }

    return children
}