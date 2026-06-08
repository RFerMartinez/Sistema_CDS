import axios from 'axios';
import { getToken, getRefreshToken, saveUser, removeUser, getUser } from './storage/userStorage';
import router from '@/router'; // Importar el router para redirigir si falla todo

export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Añade un interceptor para incluir el token automáticamente en las cabeceras
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
        // Asegúrate de que config.headers exista
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Para el login (que usa 'application/x-www-form-urlencoded')
        if (config.url === '/auth/login' && config.method === 'post') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y NO es un reintento previo
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            
            // Si el error viene del login, no intentamos refrescar, simplemente falló
            if (originalRequest.url.includes('/auth/login')) {
                return Promise.reject(error);
            }

            originalRequest._retry = true; // Marcar para no entrar en bucle infinito

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error("No hay refresh token");
                }

                // Intentar obtener nuevo token
                // Nota: Usamos axios puro para evitar pasar por los interceptores de apiClient
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
                    params: { refresh_token: refreshToken } // O body, segun como definas tu endpoint
                });

                const { access_token, refresh_token: newRefreshToken } = response.data;
                const userData = getUser(); // Recuperar datos de usuario actuales

                // Guardar los nuevos tokens
                saveUser(access_token, newRefreshToken, userData);

                // Actualizar el header de la petición original y reintentar
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                return apiClient(originalRequest);

            } catch (refreshError) {
                // Si falla el refresh (token expirado o inválido)
                console.error("La sesión ha expirado completamente.");
                removeUser();
                
                // OPCIÓN A: Redirección directa
                // router.push('/login');

                // OPCIÓN B (Lo que pediste): Disparar el Modal
                // Aquí puedes emitir un evento del DOM que tu App.vue escuche
                window.dispatchEvent(new CustomEvent('session-expired'));
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Exporta la instancia configurada para usarla en los servicios
export default apiClient;

// También puedes exportar las constantes de storage si quieres centralizar todo
export * from './storage/userStorage';