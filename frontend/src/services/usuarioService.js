import api from './api'

const usuarioService = {
    listarTodos: () => api.get('/usuarios'),
    listarPeluqueros: () => api.get('/usuarios/peluqueros'),
    crear: (datos) => api.post('/usuarios', datos),
    activar: (id) => api.patch(`/usuarios/${id}/activar`),
    desactivar: (id) => api.patch(`/usuarios/${id}/desactivar`),
}

export default usuarioService