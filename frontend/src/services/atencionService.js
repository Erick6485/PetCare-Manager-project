import api from './api'

const atencionService = {
    listarPorFecha: (fecha) => api.get(`/atenciones?fecha=${fecha}`),
    agendaPeluquero: (id, fecha) => api.get(`/atenciones/peluquero/${id}?fecha=${fecha}`),
    crear: (datos) => api.post('/atenciones', datos),
    cambiarEstado: (datos) => api.patch('/atenciones/estado', datos),
}

export default atencionService