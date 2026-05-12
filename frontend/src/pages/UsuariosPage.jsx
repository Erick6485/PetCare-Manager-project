import { useState, useEffect } from 'react'
import Layout from '../components/common/Layout'
import Modal from '../components/common/Modal'
import usuarioService from '../services/usuarioService'

const formInicial = {
    nombreCompleto: '', telefono: '', correo: '',
    nombreUsuario: '', contrasena: '', rolId: '',
}

const ROLES = [
    { id: 1, nombre: 'ADMINISTRADOR' },
    { id: 2, nombre: 'RECEPCIONISTA' },
    { id: 3, nombre: 'PELUQUERO' },
]

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([])
    const [modalAbierto, setModalAbierto] = useState(false)
    const [form, setForm] = useState(formInicial)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    useEffect(() => { cargar() }, [])

    const cargar = async () => {
        const res = await usuarioService.listarTodos()
        setUsuarios(res.data)
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setCargando(true); setError('')
        try {
            await usuarioService.crear({ ...form, rolId: parseInt(form.rolId) })
            setModalAbierto(false); setForm(formInicial); cargar()
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el usuario')
        } finally { setCargando(false) }
    }

    const toggleEstado = async (u) => {
        if (u.estadoActividad) await usuarioService.desactivar(u.usuarioId)
        else await usuarioService.activar(u.usuarioId)
        cargar()
    }

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1 className="page-titulo">Usuarios</h1>
                    <button className="btn btn-primary" onClick={() => { setForm(formInicial); setError(''); setModalAbierto(true) }}>
                        + Nuevo usuario
                    </button>
                </div>

                <div className="tabla-container">
                    <table className="tabla">
                        <thead>
                            <tr><th>Nombre</th><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
                        </thead>
                        <tbody>
                            {usuarios.length === 0 ? (
                                <tr><td colSpan={6} className="tabla-vacia">No hay usuarios registrados</td></tr>
                            ) : usuarios.map(u => (
                                <tr key={u.usuarioId}>
                                    <td>{u.nombreCompleto}</td>
                                    <td>{u.nombreUsuario}</td>
                                    <td>{u.correo}</td>
                                    <td>{u.nombreRol}</td>
                                    <td><span className={`badge ${u.estadoActividad ? 'badge-activo' : 'badge-inactivo'}`}>
                                        {u.estadoActividad ? 'Activo' : 'Inactivo'}
                                    </span></td>
                                    <td>
                                        <button className={`btn btn-sm ${u.estadoActividad ? 'btn-danger' : 'btn-success'}`}
                                            onClick={() => toggleEstado(u)}>
                                            {u.estadoActividad ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {modalAbierto && (
                    <Modal titulo="Nuevo usuario" onClose={() => setModalAbierto(false)}>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label className="form-label">Nombre completo *</label>
                                <input className="form-input" name="nombreCompleto" value={form.nombreCompleto}
                                    onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Usuario *</label>
                                    <input className="form-input" name="nombreUsuario" value={form.nombreUsuario}
                                        onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contraseña *</label>
                                    <input className="form-input" type="password" name="contrasena"
                                        value={form.contrasena} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Correo *</label>
                                    <input className="form-input" type="email" name="correo"
                                        value={form.correo} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Teléfono</label>
                                    <input className="form-input" name="telefono" value={form.telefono}
                                        onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Rol *</label>
                                <select className="form-input" name="rolId" value={form.rolId}
                                    onChange={handleChange} required>
                                    <option value="">Selecciona un rol...</option>
                                    {ROLES.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                                </select>
                            </div>
                            {error && <p className="form-error">{error}</p>}
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" disabled={cargando}>
                                    {cargando ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </Layout>
    )
}