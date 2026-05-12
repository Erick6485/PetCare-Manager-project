// ServiciosPage.jsx
import { useState, useEffect } from 'react'
import Layout from '../components/common/Layout'
import Modal from '../components/common/Modal'
import servicioService from '../services/servicioService'

const formInicial = { nombre: '', descripcion: '', precio: '' }

export function ServiciosPage() {
    const [servicios, setServicios] = useState([])
    const [modalAbierto, setModalAbierto] = useState(false)
    const [servicioEditando, setServicioEditando] = useState(null)
    const [form, setForm] = useState(formInicial)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const [cargandoLista, setCargandoLista] = useState(true)

    useEffect(() => { cargar() }, [])

    const cargar = async () => {
        setCargandoLista(true)
        try {
            const res = await servicioService.listarTodos()
            setServicios(res.data)
        } catch {
            setServicios([])
        } finally {
            setCargandoLista(false)
        }
    }

    const abrirCrear = () => {
        setServicioEditando(null); setForm(formInicial); setError(''); setModalAbierto(true)
    }

    const abrirEditar = (s) => {
        setServicioEditando(s)
        setForm({ nombre: s.nombre, descripcion: s.descripcion || '', precio: s.precio })
        setError(''); setModalAbierto(true)
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setCargando(true); setError('')
        try {
            const datos = { ...form, precio: parseFloat(form.precio) }
            if (servicioEditando) await servicioService.actualizar(servicioEditando.servicioId, datos)
            else await servicioService.crear(datos)
            setModalAbierto(false); cargar()
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar')
        } finally { setCargando(false) }
    }

    const toggleEstado = async (s) => {
        try {
            if (s.activo) await servicioService.desactivar(s.servicioId)
            else await servicioService.activar(s.servicioId)
            cargar()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al cambiar estado')
        }
    }

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1 className="page-titulo">Servicios</h1>
                    <button id="btn-nuevo-servicio" className="btn btn-primary" onClick={abrirCrear}>+ Nuevo servicio</button>
                </div>

                {cargandoLista ? (
                    <div className="loading-text">
                        <span className="loading-spinner"></span>
                        Cargando servicios...
                    </div>
                ) : (
                    <div className="tabla-container">
                        <table className="tabla">
                            <thead><tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
                            <tbody>
                                {servicios.length === 0 ? (
                                    <tr><td colSpan={5} className="tabla-vacia">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">🛁</div>
                                            <div className="empty-state-text">No hay servicios registrados</div>
                                        </div>
                                    </td></tr>
                                ) : servicios.map(s => (
                                    <tr key={s.servicioId}>
                                        <td style={{ fontWeight: 500 }}>{s.nombre}</td>
                                        <td>{s.descripcion || '—'}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>${parseFloat(s.precio).toLocaleString()}</td>
                                        <td><span className={`badge ${s.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                                            {s.activo ? '● Activo' : '● Inactivo'}
                                        </span></td>
                                        <td className="tabla-acciones">
                                            <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(s)}>Editar</button>
                                            <button className={`btn btn-sm ${s.activo ? 'btn-danger' : 'btn-success'}`}
                                                onClick={() => toggleEstado(s)}>
                                                {s.activo ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {modalAbierto && (
                    <Modal titulo={servicioEditando ? 'Editar servicio' : 'Nuevo servicio'} onClose={() => setModalAbierto(false)}>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label className="form-label">Nombre *</label>
                                <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripción</label>
                                <textarea className="form-input form-textarea" name="descripcion"
                                    value={form.descripcion} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Precio *</label>
                                <input className="form-input" type="number" name="precio"
                                    value={form.precio} onChange={handleChange} min="0" step="0.01" required />
                            </div>
                            {error && <p className="form-error">⚠ {error}</p>}
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