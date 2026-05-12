import { useState, useEffect } from 'react'
import Layout from '../components/common/Layout'
import Modal from '../components/common/Modal'
import clienteService from '../services/clienteService'

const formInicial = {
    nombre: '',
    documentoIdentidad: '',
    telefono: '',
    correo: '',
}

export default function ClientesPage() {
    const [clientes, setClientes] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [modalAbierto, setModalAbierto] = useState(false)
    const [clienteEditando, setClienteEditando] = useState(null)
    const [form, setForm] = useState(formInicial)
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const [cargandoLista, setCargandoLista] = useState(true)

    useEffect(() => {
        cargarClientes()
    }, [])

    const cargarClientes = async () => {
        setCargandoLista(true)
        try {
            const res = await clienteService.listarTodos()
            setClientes(res.data)
        } catch {
            setError('Error al cargar los clientes')
        } finally {
            setCargandoLista(false)
        }
    }

    const buscar = async (e) => {
        setBusqueda(e.target.value)
        if (e.target.value.trim()) {
            const res = await clienteService.buscarPorNombre(e.target.value)
            setClientes(res.data)
        } else {
            cargarClientes()
        }
    }

    const abrirCrear = () => {
        setClienteEditando(null)
        setForm(formInicial)
        setError('')
        setModalAbierto(true)
    }

    const abrirEditar = (cliente) => {
        setClienteEditando(cliente)
        setForm({
            nombre: cliente.nombre,
            documentoIdentidad: cliente.documentoIdentidad,
            telefono: cliente.telefono || '',
            correo: cliente.correo || '',
        })
        setError('')
        setModalAbierto(true)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setError('')
        try {
            if (clienteEditando) {
                await clienteService.actualizar(clienteEditando.clienteId, form)
            } else {
                await clienteService.crear(form)
            }
            setModalAbierto(false)
            cargarClientes()
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el cliente')
        } finally {
            setCargando(false)
        }
    }

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1 className="page-titulo">Clientes</h1>
                    <button id="btn-nuevo-cliente" className="btn btn-primary" onClick={abrirCrear}>
                        + Nuevo cliente
                    </button>
                </div>

                <div className="page-filtros">
                    <input
                        id="buscar-cliente"
                        className="form-input"
                        type="text"
                        placeholder="🔍 Buscar por nombre..."
                        value={busqueda}
                        onChange={buscar}
                        style={{ maxWidth: '320px' }}
                    />
                </div>

                {cargandoLista ? (
                    <div className="loading-text">
                        <span className="loading-spinner"></span>
                        Cargando clientes...
                    </div>
                ) : (
                    <div className="tabla-container">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Documento</th>
                                    <th>Teléfono</th>
                                    <th>Correo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.length === 0 ? (
                                    <tr><td colSpan={5} className="tabla-vacia">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">👥</div>
                                            <div className="empty-state-text">No hay clientes registrados</div>
                                        </div>
                                    </td></tr>
                                ) : (
                                    clientes.map((c) => (
                                        <tr key={c.clienteId}>
                                            <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                                            <td>{c.documentoIdentidad}</td>
                                            <td>{c.telefono || '—'}</td>
                                            <td>{c.correo || '—'}</td>
                                            <td>
                                                <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(c)}>
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {modalAbierto && (
                    <Modal
                        titulo={clienteEditando ? 'Editar cliente' : 'Nuevo cliente'}
                        onClose={() => setModalAbierto(false)}
                    >
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label className="form-label">Nombre completo *</label>
                                <input className="form-input" name="nombre" value={form.nombre}
                                    onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Documento de identidad *</label>
                                <input className="form-input" name="documentoIdentidad"
                                    value={form.documentoIdentidad} onChange={handleChange}
                                    disabled={!!clienteEditando} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Teléfono</label>
                                    <input className="form-input" name="telefono" value={form.telefono}
                                        onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Correo</label>
                                    <input className="form-input" type="email" name="correo"
                                        value={form.correo} onChange={handleChange} />
                                </div>
                            </div>
                            {error && <p className="form-error">⚠ {error}</p>}
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