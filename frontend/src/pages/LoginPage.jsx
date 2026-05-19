import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const { login } = useAuth()
    const [form, setForm] = useState({ nombreUsuario: '', contrasena: '' })
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const [mostrarContrasena, setMostrarContrasena] = useState(false)
    const [shake, setShake] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setError('')
        try {
            await login(form.nombreUsuario, form.contrasena)
            // La redirección la maneja AuthContext según el rol
        } catch {
            setError('Usuario o contraseña incorrectos')
            setShake(true)
            setTimeout(() => setShake(false), 500)
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="login-container">
            <div className={`login-card ${shake ? 'login-shake' : ''}`}>
                <div className="login-logo">🐾</div>
                <h1 className="login-titulo">PetCare Manager</h1>
                <p className="login-subtitulo">Ingresa tus credenciales para continuar</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <input
                            className="form-input"
                            type="text"
                            name="nombreUsuario"
                            value={form.nombreUsuario}
                            onChange={handleChange}
                            placeholder="Nombre de usuario"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <div className="input-password-wrapper">
                            <input
                                className="form-input"
                                type={mostrarContrasena ? 'text' : 'password'}
                                name="contrasena"
                                value={form.contrasena}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="btn-toggle-password"
                                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                tabIndex={-1}
                            >
                                {mostrarContrasena ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="btn btn-primary btn-full" disabled={cargando}>
                        {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    )
}