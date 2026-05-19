import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [cargando, setCargando] = useState(true)
    const navigate = useNavigate()

    // Al montar, recuperar sesión guardada
    useEffect(() => {
        const tokenGuardado = localStorage.getItem('petcare_token')
        const userGuardado = localStorage.getItem('petcare_user')
        if (tokenGuardado && userGuardado) {
            setToken(tokenGuardado)
            setUser(JSON.parse(userGuardado))
        }
        setCargando(false)
    }, [])

    const login = async (nombreUsuario, contrasena) => {
        const res = await authService.login(nombreUsuario, contrasena)
        const { token, usuarioId, nombreCompleto, rol } = res.data

        localStorage.setItem('petcare_token', token)
        localStorage.setItem('petcare_user', JSON.stringify({ usuarioId, nombreCompleto, nombreUsuario, rol }))

        setToken(token)
        setUser({ usuarioId, nombreCompleto, nombreUsuario, rol })

        // Redirigir según rol
        if (rol === 'PELUQUERO') navigate('/peluquero')
        else if (rol === 'RECEPCIONISTA') navigate('/recepcionista')
        else navigate('/dashboard') // ADMINISTRADOR
    }

    const logout = () => {
        localStorage.removeItem('petcare_token')
        localStorage.removeItem('petcare_user')
        setToken(null)
        setUser(null)
        navigate('/login')
    }

    const isAuthenticated = !!token

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, cargando }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}