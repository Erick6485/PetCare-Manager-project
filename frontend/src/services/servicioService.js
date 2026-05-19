import api from './api'

const servicioService = {
    listarActivos: () => api.get('/servicios?soloActivos=true'),
    listarTodos: () => api.get('/servicios?soloActivos=false'),
    crear: (datos) => api.post('/servicios', datos),
    actualizar: (id, datos) => api.put(`/servicios/${id}`, datos),
    activar: (id) => api.patch(`/servicios/${id}/activar`),
    desactivar: (id) => api.patch(`/servicios/${id}/desactivar`),
}

export default servicioService