// src/api/services/cuotasService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada

// Ya no necesitas API_URL ni getToken aquí

/**
 * Obtiene todas las cuotas del usuario que ha iniciado sesión.
 * El token se envía automáticamente por el interceptor.
 */
export const obtenerMisCuotas = async () => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get('/cuotas/mis-cuotas');
        return response.data;
    } catch (error) {
        console.error("Error al obtener las cuotas:", error);
        return [];
    }
};

/**
 * Obtiene las cuotas de un alumno específico por su DNI (para Staff).
 * El token se envía automáticamente por el interceptor.
 */
export const obtenerCuotasDeAlumno = async (dni) => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get(`/cuotas/alumno/${dni}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener las cuotas del alumno ${dni}:`, error);
        return [];
    }
};


/**
 * Modifica una cuota existente (ADMIN).
 * Recibe el objeto completo con los datos a actualizar.
 * @param {Number} idCuota 
 * @param {Object} datosCuota 
 */
export const modificarCuota = async (idCuota, datosCuota) => {
    try {
        // Petición PUT a /cuotas/{id}
        const response = await apiClient.put(`/cuotas/${idCuota}`, datosCuota);
        return response.data;
    } catch (error) {
        console.error(`Error al modificar la cuota ${idCuota}:`, error);
        throw error; // Re-lanzamos para manejarlo en el componente
    }
};


/**
 * Elimina una cuota por su ID (ADMIN).
 * @param {Number} idCuota 
 */
export const eliminarCuota = async (idCuota) => {
    try {
        const response = await apiClient.delete(`/cuotas/${idCuota}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la cuota ${idCuota}:`, error);
        throw error;
    }
};





