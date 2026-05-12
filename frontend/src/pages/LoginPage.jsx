import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ nombreUsuario: '', contrasena: '' })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Validación temporal — reemplazar con llamada real al backend
        if (form.nombreUsuario === 'admin' && form.contrasena === 'Admin2025*') {
            navigate('/dashboard')
        } else {
            setError('Usuario o contraseña incorrectos')
        }
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
                            className="form-input"
                            type="text"
                            name="nombreUsuario"
                            value={form.nombreUsuario}
                            onChange={handleChange}
                            placeholder="Nombre de usuario"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            className="form-input"
                            type="password"
                            name="contrasena"
                            value={form.contrasena}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="btn btn-primary btn-full">
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}