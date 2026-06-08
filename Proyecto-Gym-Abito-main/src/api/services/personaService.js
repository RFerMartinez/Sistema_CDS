// src/api/services/personaService.js
import apiClient from '../index'; // <--- CORREGIDO: Usamos apiClient para mantener consistencia

/**
 * Activa a una persona como alumno en el sistema.
 * Requiere token de staff.
 * @param {object} datosActivacion - Objeto con los datos para la activación.
 */
export const activarAlumno = async (datosActivacion) => {
    try {
        // CORREGIDO: Usamos apiClient
        const response = await apiClient.post('/alumnos/activar', datosActivacion);
        return response.data;
    } catch (error) {
        console.error("Error al activar el alumno:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene la lista de personas.
 * Requiere token de staff.
 */
export const listarPersonas = async () => {
    try {
        // CORREGIDO: Usamos apiClient
        const response = await apiClient.get('/personas/');
        return response.data;
    } catch (error) {
        console.error("Error al listar las personas:", error.response?.data || error.message);
        return []; 
    }
};

/**
 * Obtiene los detalles completos de una persona específica por su DNI.
 * Requiere token de staff.
 * @param {string} dni - DNI de la persona a buscar.
 */
export const obtenerPersonaPorDni = async (dni) => {
    try {
        // CORREGIDO: Usamos apiClient
        const response = await apiClient.get(`/personas/${dni}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los detalles de la persona ${dni}:`, error.response?.data || error.message);
        
        if (error.response && error.response.status === 404) {
            console.warn(`Persona con DNI ${dni} no encontrada.`);
            return null;
        }
        return null; 
    }
};

/**
 * Elimina a una persona del sistema (solo si no es alumno, empleado o admin).
 * Requiere token de administrador.
 * @param {string} dni - DNI de la persona a eliminar.
 */
export const eliminarPersona = async (dni) => {
    try {
        // CORREGIDO: Usamos apiClient
        const response = await apiClient.delete(`/personas/${dni}`);
        return response.data; 
    } catch (error) {
        console.error(`Error al eliminar la persona ${dni}:`, error.response?.data || error.message);
        throw error; 
    }
};

/**
 * Obtiene el perfil de la persona autenticada.
 */
export const getMiPerfilPersona = async () => {
    try {
        const response = await apiClient.get('/personas/mi-perfil');
        return response.data; // <--- ¡AQUÍ ESTÁ LA CLAVE! Devolver .data
    } catch (error) {
        console.error("Error al obtener perfil de persona:", error);
        // Es buena práctica devolver null o lanzar el error para que el componente lo sepa
        throw error; 
    }
};