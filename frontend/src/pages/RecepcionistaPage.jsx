import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/common/Layout'
import atencionService from '../services/atencionService'

const FILTROS = [
    { key: 'TODOS', label: 'Todos', iconClass: 'stat-card-icon--todos' },
    { key: 'PENDIENTE', label: 'Pendientes', iconClass: 'stat-card-icon--pendiente' },
    { key: 'EN_PROCESO', label: 'En proceso', iconClass: 'stat-card-icon--proceso' },
    { key: 'FINALIZADO', label: 'Finalizados', iconClass: 'stat-card-icon--finalizado' },
    { key: 'CANCELADO', label: 'Cancelados', iconClass: 'stat-card-icon--cancelado' },
]

const iconosSVG = {
    TODOS: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    PENDIENTE: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    EN_PROCESO: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
    ),
    FINALIZADO: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    CANCELADO: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
}

export default function RecepcionistaPage() {
    const navigate = useNavigate()
    const [atenciones, setAtenciones] = useState([])
    const [filtro, setFiltro] = useState('TODOS')
    const [cargando, setCargando] = useState(true)
    const [fecha] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => { cargar() }, [])

    const cargar = async () => {
        setCargando(true)
        try {
            const res = await atencionService.listarPorFecha(fecha)
            setAtenciones(res.data)
        } catch {
            setAtenciones([])
        } finally {
            setCargando(false)
        }
    }

    const cancelarAtencion = async (atencion) => {
        if (!window.confirm(`¿Cancelar la atención de ${atencion.nombreMascota}?`)) return
        try {
            await atencionService.cambiarEstado({
                atencionId: atencion.atencionId,
                nuevoEstado: 'CANCELADO',
            })
            cargar()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al cancelar')
        }
    }

    const conteoPorEstado = (estado) => {
        if (estado === 'TODOS') return atenciones.length
        return atenciones.filter(a => a.estado === estado).length
    }

    const filtradas = filtro === 'TODOS'
        ? atenciones
        : atenciones.filter(a => a.estado === filtro)

    const hoy = new Date().toLocaleDateString('es-CO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <Layout>
            <div className="page">
                {/* Encabezado */}
                <div className="page-header">
                    <div>
                        <h1 className="page-titulo">Bienvenida 👋</h1>
                        <p className="page-subtitulo" style={{ textTransform: 'capitalize' }}>{hoy}</p>
                    </div>
                </div>

                {/* Tarjetas de filtro — igual que el dashboard del admin */}
                <div className="stat-cards">
                    {FILTROS.map(f => (
                        <button
                            key={f.key}
                            className={`stat-card ${filtro === f.key ? 'stat-card--active' : ''}`}
                            onClick={() => setFiltro(f.key)}
                        >
                            <div>
                                <div className="stat-card-label">{f.label}</div>
                                <div className="stat-card-value">{conteoPorEstado(f.key)}</div>
                            </div>
                            <div className={`stat-card-icon ${f.iconClass}`}>
                                {iconosSVG[f.key]}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Accesos rápidos */}
                <div className="section-card" style={{ marginBottom: '24px' }}>
                    <div className="section-card-header">
                        <span className="section-card-icon">⚡</span>
                        Acciones rápidas
                    </div>
                    <div style={{ display: 'flex', gap: '12px', padding: '16px', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/clientes')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                            Nuevo cliente
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate('/mascotas')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                                <circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" />
                                <path d="M12 12c-2 3-6 5-6 8a6 6 0 0 0 12 0c0-3-4-5-6-8z" />
                            </svg>
                            Nueva mascota
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate('/atenciones')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                <line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
                            </svg>
                            Nueva atención
                        </button>
                    </div>
                </div>

                {/* Tabla de atenciones — SIN columna acciones genérica,
                    solo botón Cancelar para atenciones PENDIENTE */}
                <div className="section-card">
                    <div className="section-card-header">
                        <span className="section-card-icon">🐾</span>
                        {filtro === 'TODOS'
                            ? 'Todas las atenciones de hoy'
                            : `Atenciones ${FILTROS.find(f => f.key === filtro)?.label.toLowerCase()} hoy`}
                    </div>
                    {cargando ? (
                        <p className="tabla-vacia">Cargando...</p>
                    ) : (
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Hora</th>
                                    <th>Cliente</th>
                                    <th>Mascota</th>
                                    <th>Servicio</th>
                                    <th>Peluquero</th>
                                    <th>Estado</th>
                                    {/* Solo mostramos columna Cancelar si el filtro incluye PENDIENTE */}
                                    {(filtro === 'TODOS' || filtro === 'PENDIENTE') && (
                                        <th>Cancelar</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filtradas.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={(filtro === 'TODOS' || filtro === 'PENDIENTE') ? 7 : 6}
                                            className="tabla-vacia"
                                        >
                                            No hay atenciones para mostrar
                                        </td>
                                    </tr>
                                ) : filtradas.map(a => (
                                    <tr key={a.atencionId}>
                                        <td>{a.hora}</td>
                                        <td>{a.nombreCliente}</td>
                                        <td>{a.nombreMascota}</td>
                                        <td>{a.nombreServicio}</td>
                                        <td>{a.nombrePeluquero}</td>
                                        <td>
                                            <span className={`badge badge-${a.estado.toLowerCase()}`}>
                                                {a.estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        {/* Botón cancelar solo si aplica */}
                                        {(filtro === 'TODOS' || filtro === 'PENDIENTE') && (
                                            <td>
                                                {a.estado === 'PENDIENTE' ? (
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => cancelarAtencion(a)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                ) : (
                                                    <span style={{ color: 'var(--color-text-light)', fontSize: '12px' }}>—</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    )
}