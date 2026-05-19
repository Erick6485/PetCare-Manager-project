import api from './api'

const authService = {
    login: (nombreUsuario, contrasena) =>
        api.post('/auth/login', { nombreUsuario, contrasena })
}

export default authService
