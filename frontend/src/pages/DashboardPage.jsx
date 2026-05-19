import { useState, useEffect } from 'react'
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

export default function DashboardPage() {
    const [atenciones, setAtenciones] = useState([])
    const [filtro, setFiltro] = useState('TODOS')
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => { cargar() }, [fecha])

    const cargar = async () => {
        try {
            const res = await atencionService.listarPorFecha(fecha)
            setAtenciones(res.data)
        } catch {
            setAtenciones([])
        }
    }

    const cambiarEstado = async (atencion, nuevoEstado) => {
        try {
            await atencionService.cambiarEstado({
                atencionId: atencion.atencionId,
                nuevoEstado,
            })
            cargar()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al cambiar estado')
        }
    }

    const conteoPorEstado = (estado) => {
        if (estado === 'TODOS') return atenciones.length
        return atenciones.filter(a => a.estado === estado).length
    }

    const filtradas = filtro === 'TODOS'
        ? atenciones
        : atenciones.filter(a => a.estado === filtro)

    const accionesPorEstado = (a) => {
        if (a.estado === 'PENDIENTE') return (
            <>
                <button className="btn btn-sm btn-primary"
                    onClick={() => cambiarEstado(a, 'EN_PROCESO')}>Iniciar</button>
                <button className="btn btn-sm btn-danger"
                    onClick={() => cambiarEstado(a, 'CANCELADO')}>Cancelar</button>
            </>
        )
        if (a.estado === 'EN_PROCESO') return (
            <button className="btn btn-sm btn-success"
                onClick={() => cambiarEstado(a, 'FINALIZADO')}>Finalizar</button>
        )
        return null
    }

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <div>
                        <h1 className="page-titulo">Dashboard</h1>
                        <p className="page-subtitulo">Resumen general del spa de mascotas</p>
                    </div>
                    <input className="form-input" type="date" value={fecha}
                        onChange={e => setFecha(e.target.value)} style={{ width: 'auto' }} />
                </div>

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

                <div className="section-card">
                    <div className="section-card-header">
                        <span className="section-card-icon">🐾</span>
                        Mascotas atendidas hoy
                    </div>
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>Cliente</th><th>Mascota</th><th>Servicio</th>
                                <th>Peluquero</th><th>Hora</th><th>Estado</th><th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtradas.length === 0 ? (
                                <tr><td colSpan={7} className="tabla-vacia">
                                    No hay mascotas programadas para hoy
                                </td></tr>
                            ) : filtradas.map(a => (
                                <tr key={a.atencionId}>
                                    <td>{a.nombreCliente}</td>
                                    <td>{a.nombreMascota}</td>
                                    <td>{a.nombreServicio}</td>
                                    <td>{a.nombrePeluquero}</td>
                                    <td>{a.hora}</td>
                                    <td>
                                        <span className={`badge badge-${a.estado.toLowerCase()}`}>
                                            {a.estado.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="tabla-acciones">{accionesPorEstado(a)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    )
}