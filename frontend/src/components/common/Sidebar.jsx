import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LINKS_ADMIN = [
    {
        to: '/dashboard', label: 'Dashboard',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    },
    {
        to: '/clientes', label: 'Clientes',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
        to: '/mascotas', label: 'Mascotas',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" /><path d="M12 12c-2 3-6 5-6 8a6 6 0 0 0 12 0c0-3-4-5-6-8z" /></svg>,
    },
    {
        to: '/atenciones', label: 'Atenciones',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    },
    {
        to: '/servicios', label: 'Servicios',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
    },
    {
        to: '/usuarios', label: 'Usuarios',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    },
]

const LINKS_RECEPCIONISTA = [
    {
        to: '/recepcionista', label: 'Inicio',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    },
    {
        to: '/clientes', label: 'Clientes',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
        to: '/mascotas', label: 'Mascotas',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" /><path d="M12 12c-2 3-6 5-6 8a6 6 0 0 0 12 0c0-3-4-5-6-8z" /></svg>,
    },
    {
        to: '/atenciones', label: 'Atenciones',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    },
]

const LINKS_PELUQUERO = [
    {
        to: '/peluquero', label: 'Mi Agenda',
        icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    },
]

function ModalLogout({ onConfirmar, onCancelar }) {
    return (
        <div className="modal-overlay" onClick={onCancelar}>
            <div className="modal modal-logout" onClick={e => e.stopPropagation()}>
                <div className="modal-logout-icono">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </div>
                <h3 className="modal-logout-titulo">¿Cerrar sesión?</h3>
                <p className="modal-logout-mensaje">
                    Tu sesión actual se cerrará y tendrás que volver a ingresar tus credenciales.
                </p>
                <div className="modal-logout-acciones">
                    <button className="btn btn-secondary" onClick={onCancelar}>Cancelar</button>
                    <button className="btn btn-danger" onClick={onConfirmar}>Sí, cerrar sesión</button>
                </div>
            </div>
        </div>
    )
}

export default function Sidebar() {
    const { user, logout } = useAuth()
    const [mostrarConfirm, setMostrarConfirm] = useState(false)

    const links = user?.rol === 'PELUQUERO'
        ? LINKS_PELUQUERO
        : user?.rol === 'RECEPCIONISTA'
            ? LINKS_RECEPCIONISTA
            : LINKS_ADMIN

    return (
        <>
            <header className="topbar">
                {/* Logo — izquierda */}
                <div className="topbar-logo">
                    <div className="topbar-logo-icon">🐾</div>
                    <span>PetCare Manager</span>
                </div>

                {/* Navegación — centro */}
                <nav className="topbar-nav">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive ? 'nav-link nav-link--active' : 'nav-link'
                            }
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Usuario + botón salir — derecha */}
                <div className="topbar-user">
                    <div className="topbar-user-info">
                        <span className="topbar-user-name">
                            {user?.nombreCompleto || user?.nombreUsuario}
                        </span>
                        <span className="topbar-user-rol">{user?.rol}</span>
                    </div>
                    <button
                        className="btn-logout"
                        onClick={() => setMostrarConfirm(true)}
                        title="Cerrar sesión"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </header>

            {mostrarConfirm && (
                <ModalLogout
                    onConfirmar={() => { setMostrarConfirm(false); logout() }}
                    onCancelar={() => setMostrarConfirm(false)}
                />
            )}
        </>
    )
}