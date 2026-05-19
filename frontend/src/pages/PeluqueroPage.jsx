import { useState, useEffect, useRef } from 'react'
import Layout from '../components/common/Layout'
import { useAuth } from '../context/AuthContext'
import atencionService from '../services/atencionService'

export default function PeluqueroPage() {
    const { user } = useAuth()
    const [atenciones, setAtenciones] = useState([])
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
    const [cargando, setCargando] = useState(true)

    useEffect(() => { cargar() }, [fecha])

    const cargar = async () => {
        if (!user?.usuarioId) return
        setCargando(true)
        try {
            const res = await atencionService.agendaPeluquero(user.usuarioId, fecha)
            setAtenciones(res.data)
        } catch {
            setAtenciones([])
        } finally {
            setCargando(false)
        }
    }

    const cambiarEstado = async (atencionId, nuevoEstado) => {
        try {
            await atencionService.cambiarEstado({ atencionId, nuevoEstado })
            cargar()
        } catch (err) {
            alert(err.response?.data?.message || 'No se pudo cambiar el estado')
        }
    }

    const hoy = new Date().toLocaleDateString('es-CO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <Layout>
            <div className="page">
                <div className="page-header">
                    <div>
                        <h1 className="page-titulo">Mi Agenda 📋</h1>
                        <p className="page-subtitulo" style={{ textTransform: 'capitalize' }}>
                            {user?.nombreCompleto} · {hoy}
                        </p>
                    </div>
                    <input
                        className="form-input"
                        type="date"
                        value={fecha}
                        onChange={e => setFecha(e.target.value)}
                        style={{ width: 'auto' }}
                    />
                </div>

                {cargando ? (
                    <p className="tabla-vacia">Cargando agenda...</p>
                ) : atenciones.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🐶</div>
                        <p className="empty-state-text">No tienes atenciones programadas para este día</p>
                    </div>
                ) : (
                    <div className="peluquero-grid">
                        {atenciones.map(a => (
                            <TarjetaAtencion
                                key={a.atencionId}
                                atencion={a}
                                onCambiarEstado={cambiarEstado}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

// ── Tarjeta individual de atención ─────────────────────────────
function TarjetaAtencion({ atencion: a, onCambiarEstado }) {
    const inputRef = useRef()
    const [subiendo, setSubiendo] = useState(false)

    const colorEstado = {
        PENDIENTE: '#f59e0b',
        EN_PROCESO: '#3b82f6',
        FINALIZADO: '#10b981',
        CANCELADO: '#ef4444',
    }

    const handleSubirEvidencia = async (tipo) => {
        inputRef.current.dataset.tipo = tipo
        inputRef.current.click()
    }

    const handleArchivoSeleccionado = async (e) => {
        const archivo = e.target.files[0]
        if (!archivo) return
        const tipo = e.target.dataset.tipo

        // Validar tamaño: máx 5 MB
        if (archivo.size > 5 * 1024 * 1024) {
            alert('La imagen no puede superar 5 MB')
            return
        }

        setSubiendo(true)
        try {
            const formData = new FormData()
            formData.append('file', archivo)
            formData.append('tipo', tipo)
            formData.append('atencionId', a.atencionId)

            // Llamada directa con fetch para multipart (axios necesita config especial)
            const token = localStorage.getItem('petcare_token')
            const res = await fetch('http://localhost:8080/api/evidencias', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            if (!res.ok) throw new Error('Error al subir')
            alert(`Evidencia ${tipo.toLowerCase()} subida correctamente ✅`)
        } catch {
            alert('No se pudo subir la imagen. Verifica el formato (JPEG/PNG)')
        } finally {
            setSubiendo(false)
            e.target.value = ''
        }
    }

    return (
        <div className="atencion-card" style={{ borderTop: `3px solid ${colorEstado[a.estado] || '#ccc'}` }}>
            {/* Hora y estado */}
            <div className="atencion-card-header">
                <span className="atencion-card-hora">{a.hora}</span>
                <span className={`badge badge-${a.estado.toLowerCase()}`}>
                    {a.estado.replace('_', ' ')}
                </span>
            </div>

            {/* Datos principales */}
            <div className="atencion-card-body">
                <p className="atencion-card-mascota">🐾 {a.nombreMascota}</p>
                <p className="atencion-card-cliente">👤 {a.nombreCliente}</p>
                <p className="atencion-card-servicio">✂️ {a.nombreServicio}</p>
                {a.observaciones && (
                    <p className="atencion-card-obs">📝 {a.observaciones}</p>
                )}
            </div>

            {/* Acciones de estado — solo las permitidas al peluquero */}
            <div className="atencion-card-actions">
                {a.estado === 'PENDIENTE' && (
                    <button
                        className="btn btn-primary btn-full"
                        onClick={() => onCambiarEstado(a.atencionId, 'EN_PROCESO')}
                    >
                        ▶ Iniciar atención
                    </button>
                )}
                {a.estado === 'EN_PROCESO' && (
                    <>
                        <button
                            className="btn btn-success btn-full"
                            onClick={() => onCambiarEstado(a.atencionId, 'FINALIZADO')}
                        >
                            ✓ Finalizar
                        </button>
                        {/* Subir evidencias solo durante EN_PROCESO */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => handleSubirEvidencia('ANTES')}
                                disabled={subiendo}
                            >
                                📷 Antes
                            </button>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                                onClick={() => handleSubirEvidencia('DESPUES')}
                                disabled={subiendo}
                            >
                                📷 Después
                            </button>
                        </div>
                    </>
                )}
                {(a.estado === 'FINALIZADO' || a.estado === 'CANCELADO') && (
                    <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                        {a.estado === 'FINALIZADO' ? '✓ Atención completada' : '✗ Atención cancelada'}
                    </p>
                )}
            </div>

            {/* Input oculto para seleccionar imagen */}
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={handleArchivoSeleccionado}
            />
        </div>
    )
}