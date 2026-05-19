import api from './api'

const mascotaService = {
    listarPorCliente: (clienteId) => api.get(`/mascotas/cliente/${clienteId}`),
    buscarPorId: (id) => api.get(`/mascotas/${id}`),
    crear: (datos) => api.post('/mascotas', datos),
    actualizar: (id, datos) => api.put(`/mascotas/${id}`, datos),
}

export default mascotaService