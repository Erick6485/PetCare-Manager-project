import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Interceptor de REQUEST — agrega el token en cada llamada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('petcare_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor de RESPUESTA — si el token expiró, limpiar sesión
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('petcare_token')
            localStorage.removeItem('petcare_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)
export default api