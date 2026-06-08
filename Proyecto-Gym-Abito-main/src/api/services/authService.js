// src/api/services/authService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada
import { saveUser, removeUser, getUser as getUserFromStorage } from '../storage/userStorage'; // Renombra getUser para evitar conflicto

// Ya no necesitas API_URL aquí

/**
 * Inicia sesión en la API.
 * @param {string} username - El nombre de usuario.
 * @param {string} password - La contraseña.
 */
export const login = async (username, password) => {
    removeUser();
    try {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await apiClient.post('/auth/login', params);
        
        // AQUI ESTABA EL ERROR: No estabas leyendo el refresh_token
        const { access_token, refresh_token } = response.data; 

        const userResponse = await apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        // Pasamos el refresh_token al storage
        saveUser(access_token, refresh_token, userResponse.data);

        return userResponse.data;
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        throw error;
    }
};

/**
 * Cierra la sesión del usuario.
 */
export const logout = () => {
    removeUser();
};

/**
 * Obtiene los datos del usuario actual (si existen en storage).
 * Esta función ahora solo lee del storage.
 */
export const getUser = () => {
    return getUserFromStorage();
};

/**
 * Verifica si el usuario actual es administrador.
 */
export const isAdmin = () => {
    const user = getUser();
    return user && user.esAdmin;
};

/**
 * Paso 1: Enviar datos iniciales y recibir correo
 */
export const registroPaso1 = (data) => {
    // data espera: { email, usuario, contrasenia, confirmar_contrasenia }
    return apiClient.post('/auth/registro-paso1', data);
};

/**
 * Paso 2: Enviar datos personales + el token del correo
 */
export const registroPaso2 = (data, token) => {
    // La API espera el token como query param y los datos en el body
    return apiClient.post(`/auth/registro-paso2?token=${token}`, data);
};

/**
 * Paso 1 Recuperación: Solicita el enlace al correo.
 * @param {string} email - Correo del usuario.
 */
export const forgotPassword = async (email) => {
    try {
        // Endpoint: POST /auth/forgot-password
        await apiClient.post('/auth/forgot-password', { email });
        return true;
    } catch (error) {
        // Si el usuario no existe, la API lanza error (según tu backend actual).
        // Si prefieres seguridad silenciosa, maneja esto en el backend.
        console.error("Error en solicitud de recuperación:", error);
        throw error;
    }
};

/**
 * Paso 2 Recuperación: Establece la nueva contraseña usando el token.
 * @param {string} token - Token recibido por email.
 * @param {string} newPassword - Nueva contraseña elegida.
 */
export const resetPassword = async (token, newPassword) => {
    try {
        // Endpoint: POST /auth/reset-password
        // Backend espera: { token: "...", new_password: "..." }
        const payload = {
            token: token,
            new_password: newPassword 
        };
        await apiClient.post('/auth/reset-password', payload);
        return true;
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        throw error;
    }
};

/**
 * Cambia la contraseña del usuario actualmente logueado.
 * Se usa para el flujo de "requiereCambioClave".
 * @param {string} newPassword - La nueva contraseña.
 */
export const changePassword = async (newPassword) => {
    try {
        // Envia el token automáticamente gracias al interceptor
        // Endpoint: POST /auth/change-password
        await apiClient.post('/auth/change-password', { new_password: newPassword });
        return true;
    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        throw error;
    }
};

