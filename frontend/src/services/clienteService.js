import api from './api'

const clienteService = {
    listarTodos: () => api.get('/clientes'),
    buscarPorNombre: (nombre) => api.get(`/clientes?nombre=${nombre}`),
    buscarPorId: (id) => api.get(`/clientes/${id}`),
    crear: (datos) => api.post('/clientes', datos),
    actualizar: (id, datos) => api.put(`/clientes/${id}`, datos),
}

export default clienteService