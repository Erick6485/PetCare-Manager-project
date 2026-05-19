import { useState, useEffect } from 'react'
import Layout from '../components/common/Layout'
import Modal from '../components/common/Modal'
import atencionService from '../services/atencionService'
import clienteService from '../services/clienteService'
import mascotaService from '../services/mascotaService'
import servicioService from '../services/servicioService'
import usuarioService from '../services/usuarioService'

const formInicial = {
    mascotaId: '', servicioId: '', peluqueroId: '',
    fecha: '', hora: '', observaciones: '',
}

export default function AtencionesPage() {
    const [atenciones, setAtenciones] = useState([])
    const [clientes, setClientes] = useState([])
    const [mascotas, setMascotas] = useState([])
    const [servicios, setServicios] = useState([])
    const [peluqueros, setPeluqueros] = useState([])
    const [clienteSeleccionado, setClienteSeleccionado] = useState('')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [form, setForm] = useState(formInicial)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => {
        cargarAtenciones()
        clienteService.listarTodos().then(r => setClientes(r.data))
        servicioService.listarActivos().then(r => setServicios(r.data))
        usuarioService.listarPeluqueros().then(r => setPeluqueros(r.data))
    }, [])

    useEffect(() => { cargarAtenciones() }, [fecha])

    useEffect(() => {
        if (clienteSeleccionado) {
            mascotaService.listarPorCliente(clienteSeleccionado).then(r => setMascotas(r.data))
        } else { setMascotas([]) }
    }, [clienteSeleccionado])

    const cargarAtenciones = async () => {
        const res = await atencionService.listarPorFecha(fecha)
        setAtenciones(res.data)
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault(); setCargando(true); setError('')
        try {
            await atencionService.crear({
                ...form,
                mascotaId: parseInt(form.mascotaId),
                servicioId: parseInt(form.servicioId),
                peluqueroId: parseInt(form.peluqueroId),
            })
            setModalAbierto(false); setForm(formInicial); cargarAtenciones()
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la atención')
        } finally { setCargando(false) }
    }

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1 className="page-titulo">Atenciones</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input className="form-input" type="date" value={fecha}
                            onChange={e => setFecha(e.target.value)} style={{ width: 'auto' }} />
                        <button className="btn btn-primary" onClick={() => { setForm(formInicial); setError(''); setModalAbierto(true) }}>
                            + Nueva atención
                        </button>
                    </div>
                </div>

                <div className="tabla-container">
                    <table className="tabla">
                        <thead>
                            <tr><th>Cliente</th><th>Mascota</th><th>Servicio</th><th>Peluquero</th><th>Hora</th><th>Estado</th></tr>
                        </thead>
                        <tbody>
                            {atenciones.length === 0 ? (
                                <tr><td colSpan={6} className="tabla-vacia">No hay atenciones para esta fecha</td></tr>
                            ) : atenciones.map(a => (
                                <tr key={a.atencionId}>
                                    <td>{a.nombreCliente}</td><td>{a.nombreMascota}</td>
                                    <td>{a.nombreServicio}</td><td>{a.nombrePeluquero}</td>
                                    <td>{a.hora}</td>
                                    <td><span className={`badge badge-${a.estado.toLowerCase()}`}>
                                        {a.estado.replace('_', ' ')}
                                    </span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {modalAbierto && (
                    <Modal titulo="Nueva atención" onClose={() => setModalAbierto(false)}>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label className="form-label">Cliente</label>
                                <select className="form-input" value={clienteSeleccionado}
                                    onChange={e => setClienteSeleccionado(e.target.value)} required>
                                    <option value="">Selecciona un cliente...</option>
                                    {clientes.map(c => <option key={c.clienteId} value={c.clienteId}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mascota *</label>
                                <select className="form-input" name="mascotaId" value={form.mascotaId}
                                    onChange={handleChange} required disabled={!clienteSeleccionado}>
                                    <option value="">Selecciona una mascota...</option>
                                    {mascotas.map(m => <option key={m.mascotaId} value={m.mascotaId}>{m.nombre}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Servicio *</label>
                                <select className="form-input" name="servicioId" value={form.servicioId}
                                    onChange={handleChange} required>
                                    <option value="">Selecciona un servicio...</option>
                                    {servicios.map(s => <option key={s.servicioId} value={s.servicioId}>{s.nombre} — ${s.precio}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Peluquero *</label>
                                <select className="form-input" name="peluqueroId" value={form.peluqueroId}
                                    onChange={handleChange} required>
                                    <option value="">Selecciona un peluquero...</option>
                                    {peluqueros.map(p => <option key={p.usuarioId} value={p.usuarioId}>{p.nombreCompleto}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Fecha *</label>
                                    <input className="form-input" type="date" name="fecha"
                                        value={form.fecha} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Hora *</label>
                                    <input className="form-input" type="time" name="hora"
                                        value={form.hora} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Observaciones</label>
                                <textarea className="form-input form-textarea" name="observaciones"
                                    value={form.observaciones} onChange={handleChange} />
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