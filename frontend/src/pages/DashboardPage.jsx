import { useState, useEffect } from 'react'
import Layout from '../components/common/Layout'
import atencionService from '../services/atencionService'

const ESTADOS = ['Todos', 'PENDIENTE', 'EN_PROCESO', 'FINALIZADO', 'CANCELADO']

const estadoLabel = {
    PENDIENTE: '⏳ Pendiente',
    EN_PROCESO: '🔄 En proceso',
    FINALIZADO: '✅ Finalizado',
    CANCELADO: '❌ Cancelado',
}

export default function DashboardPage() {
    const [atenciones, setAtenciones] = useState([])
    const [filtroEstado, setFiltroEstado] = useState('Todos')
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
    const [cargando, setCargando] = useState(false)

    useEffect(() => { cargar() }, [fecha])

    const cargar = async () => {
        setCargando(true)
        try {
            const res = await atencionService.listarPorFecha(fecha)
            setAtenciones(res.data)
        } catch {
            setAtenciones([])
        } finally { setCargando(false) }
    }

    const cambiarEstado = async (atencion, nuevoEstado) => {
        if (nuevoEstado === 'CANCELADO') {
            if (!window.confirm('¿Estás seguro de cancelar esta atención?')) return
        }
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

    const filtradas = filtroEstado === 'Todos'
        ? atenciones
        : atenciones.filter(a => a.estado === filtroEstado)

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
        return <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>—</span>
    }

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <h1 className="page-titulo">Dashboard</h1>
                    <input className="form-input" type="date" value={fecha}
                        onChange={e => setFecha(e.target.value)} style={{ width: 'auto' }} />
                </div>

                <div className="page-filtros">
                    {ESTADOS.map(e => (
                        <button key={e}
                            className={`btn btn-sm ${filtroEstado === e ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFiltroEstado(e)}>
                            {e === 'Todos' ? 'Todos' : estadoLabel[e] || e}
                        </button>
                    ))}
                </div>

                {cargando ? (
                    <div className="loading-text">
                        <span className="loading-spinner"></span>
                        Cargando atenciones...
                    </div>
                ) : (
                    <div className="tabla-container">
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
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📋</div>
                                            <div className="empty-state-text">No hay atenciones para esta fecha</div>
                                        </div>
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
                                                {estadoLabel[a.estado] || a.estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="tabla-acciones">{accionesPorEstado(a)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    )
}