import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ nombreUsuario: '', contrasena: '' })
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const [mostrarPass, setMostrarPass] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setError('')

        // Simulamos un pequeño delay para dar feedback visual
        await new Promise(r => setTimeout(r, 400))

        // Validación temporal — reemplazar con llamada real al backend
        if (form.nombreUsuario === 'admin' && form.contrasena === 'Admin2025*') {
            navigate('/dashboard')
        } else {
            setError('Usuario o contraseña incorrectos')
        }
        setCargando(false)
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">🐾</div>
                <h1 className="login-titulo">PetCare Manager</h1>
                <p className="login-subtitulo">Ingresa tus credenciales para continuar</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <input
                            id="login-usuario"
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
                        <div className="password-wrapper">
                            <input
                                id="login-password"
                                className="form-input"
                                type={mostrarPass ? 'text' : 'password'}
                                name="contrasena"
                                value={form.contrasena}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                autoComplete="current-password"
                                required
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setMostrarPass(!mostrarPass)}
                                tabIndex={-1}
                                aria-label={mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {mostrarPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {error && <p className="form-error">⚠ {error}</p>}

                    <button
                        id="login-submit"
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                                <span className="loading-spinner" style={{ width: 16, height: 16, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span>
                                Ingresando...
                            </>
                        ) : 'Iniciar sesión'}
                    </button>
                </form>
            </div>
        </div>
    )
}