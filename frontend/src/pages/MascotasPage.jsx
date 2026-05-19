import { useState, useEffect } from 'react'
import Layout from '../components/common/Layout'
import Modal from '../components/common/Modal'
import mascotaService from '../services/mascotaService'
import clienteService from '../services/clienteService'

const formInicial = {
    nombre: '', especie: '', raza: '',
    edad: '', pesoKg: '', observaciones: '', clienteId: '',
}

export default function MascotasPage() {
    const [mascotas, setMascotas] = useState([])
    const [clientes, setClientes] = useState([])
    const [clienteSeleccionado, setClienteSeleccionado] = useState('')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [mascotaEditando, setMascotaEditando] = useState(null)
    const [form, setForm] = useState(formInicial)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        clienteService.listarTodos().then(res => setClientes(res.data))
    }, [])

    useEffect(() => {
        if (clienteSeleccionado) {
            mascotaService.listarPorCliente(clienteSeleccionado)
                .then(res => setMascotas(res.data))
        } else {
            setMascotas([])
        }
    }, [clienteSeleccionado])

    const abrirCrear = () => {
        setMascotaEditando(null)
        setForm({ ...formInicial, clienteId: clienteSeleccionado })
        setError('')
        setModalAbierto(true)
    }

    const abrirEditar = (m) => {
        setMascotaEditando(m)
        setForm({
            nombre: m.nombre, especie: m.especie, raza: m.raza || '',
            edad: m.edad || '', pesoKg: m.pesoKg || '',
            observaciones: m.observaciones || '', clienteId: m.clienteId,
        })
        setError('')
        setModalAbierto(true)
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setError('')
        try {
            const datos = {
                ...form,
                edad: form.edad ? parseInt(form.edad) : null,
                pesoKg: form.pesoKg ? parseFloat(form.pesoKg) : null,
                clienteId: parseInt(form.clienteId),
            }
            if (mascotaEditando) {
                await mascotaService.actualizar(mascotaEditando.mascotaId, datos)
            } else {
                await mascotaService.crear(datos)
            }
            setModalAbierto(false)
            if (clienteSeleccionado) {
                const res = await mascotaService.listarPorCliente(clienteSeleccionado)
                setMascotas(res.data)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la mascota')
        } finally {
            setCargando(false)
        }
    }

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1 className="page-titulo">Mascotas</h1>
                    <button className="btn btn-primary" onClick={abrirCrear}
                        disabled={!clienteSeleccionado}>
                        + Nueva mascota
                    </button>
                </div>

                <div className="page-filtros">
                    <select className="form-input" value={clienteSeleccionado}
                        onChange={e => setClienteSeleccionado(e.target.value)}>
                        <option value="">Selecciona un cliente...</option>
                        {clientes.map(c => (
                            <option key={c.clienteId} value={c.clienteId}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="tabla-container">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>Nombre</th><th>Especie</th><th>Raza</th>
                                <th>Edad</th><th>Peso (kg)</th><th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mascotas.length === 0 ? (
                                <tr><td colSpan={6} className="tabla-vacia">
                                    {clienteSeleccionado ? 'No hay mascotas registradas' : 'Selecciona un cliente'}
                                </td></tr>
                            ) : (
                                mascotas.map(m => (
                                    <tr key={m.mascotaId}>
                                        <td>{m.nombre}</td><td>{m.especie}</td>
                                        <td>{m.raza || '—'}</td><td>{m.edad ? `${m.edad} años` : '—'}</td>
                                        <td>{m.pesoKg ? `${m.pesoKg} kg` : '—'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(m)}>
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {modalAbierto && (
                    <Modal titulo={mascotaEditando ? 'Editar mascota' : 'Nueva mascota'}
                        onClose={() => setModalAbierto(false)}>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Nombre *</label>
                                    <input className="form-input" name="nombre" value={form.nombre}
                                        onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Especie *</label>
                                    <input className="form-input" name="especie" value={form.especie}
                                        onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Raza</label>
                                    <input className="form-input" name="raza" value={form.raza}
                                        onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Edad (años)</label>
                                    <input className="form-input" type="number" name="edad"
                                        value={form.edad} onChange={handleChange} min="0" max="50" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Peso (kg)</label>
                                <input className="form-input" type="number" name="pesoKg"
                                    value={form.pesoKg} onChange={handleChange} step="0.01" min="0" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Observaciones especiales</label>
                                <textarea className="form-input form-textarea" name="observaciones"
                                    value={form.observaciones} onChange={handleChange}
                                    placeholder="Alergias, comportamiento, condiciones médicas..." />
                            </div>
                            {!mascotaEditando && (
                                <div className="form-group">
                                    <label className="form-label">Cliente *</label>
                                    <select className="form-input" name="clienteId"
                                        value={form.clienteId} onChange={handleChange} required>
                                        <option value="">Selecciona un cliente...</option>
                                        {clientes.map(c => (
                                            <option key={c.clienteId} value={c.clienteId}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {error && <p className="form-error">{error}</p>}
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary"
                                    onClick={() => setModalAbierto(false)}>Cancelar</button>
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