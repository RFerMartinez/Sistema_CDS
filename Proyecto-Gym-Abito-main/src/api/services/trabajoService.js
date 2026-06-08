// src/api/services/trabajoService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada

/**
 * Obtiene la lista completa de trabajos (metodologías).
 * (Asume que requiere un token, que el interceptor de apiClient maneja).
 */
export const obtenerTrabajos = async () => {
    try {
        // Llama al endpoint GET /trabajo/
        const response = await apiClient.get('/trabajo/');
        
        // Devuelve el array con los datos
        return response.data;
    } catch (error) {
        console.error("Error al obtener los trabajos:", error.response?.data || error.message);
        // Devuelve un array vacío para que la UI no falle
        return []; 
    }
};

/**
 * Elimina un trabajo (metodología) por su nombre.
 * @param {string} jobName - El nombre (ID) del trabajo a eliminar.
 * @returns {boolean} - Devuelve true si la eliminación fue exitosa (status 204).
 * @throws {Error} - Lanza un error si la API falla.
 */
export const eliminarTrabajo = async (jobName) => {
    try {
        // Codifica el nombre para que sea seguro en una URL
        const encodedName = encodeURIComponent(jobName);

        // Llama al endpoint DELETE /trabajo/{jobName}
        const response = await apiClient.delete(`/trabajo/${encodedName}`);
        
        // El éxito en DELETE suele ser 204 (No Content)
        return response.status === 204;

    } catch (error) {
        console.error(`Error al eliminar el trabajo "${jobName}":`, error.response?.data || error.message);
        // Lanza el error para que el componente (UI) lo maneje
        throw error; 
    }
};

/**
 * Crea un nuevo trabajo (metodología).
 * @param {object} datosTrabajo - Objeto con los datos del nuevo trabajo.
 * @example { "nombre": "Crossfit", "descripcion": "Entrenamiento de alta intensidad." }
 * @returns {object} - El objeto del trabajo recién creado.
 * @throws {Error} - Lanza un error si la API falla.
 */
export const crearTrabajo = async (datosTrabajo) => {
    try {
        // Llama al endpoint POST /trabajo/
        // Asume que la API espera un body JSON
        const response = await apiClient.post('/trabajo/', datosTrabajo);
        
        // Devuelve el objeto del trabajo recién creado
        return response.data;

    } catch (error) {
        console.error("Error al crear el nuevo trabajo:", error.response?.data || error.message);
        // Lanza el error para que el componente lo maneje
        throw error; 
    }
};

/**
 * Actualiza un trabajo (metodología) existente.
 * @param {string} jobName - El nombre *original* del trabajo a actualizar (para la URL).
 * @param {object} datosTrabajo - El objeto con los datos *nuevos* (ej: { nombre, descripcion }).
 * @returns {object} - El objeto del trabajo actualizado.
 * @throws {Error} - Lanza un error si la API falla.
 */
export const actualizarTrabajo = async (jobName, datosTrabajo) => {
    try {
        // Codifica el nombre original para que sea seguro en la URL
        const encodedName = encodeURIComponent(jobName);

        // Llama al endpoint PUT /trabajo/{jobName} con los nuevos datos en el body
        const response = await apiClient.put(`/trabajo/${encodedName}`, datosTrabajo);
        
        // Devuelve el objeto del trabajo actualizado (devuelto por la API)
        return response.data;

    } catch (error) {
        console.error(`Error al actualizar el trabajo "${jobName}":`, error.response?.data || error.message);
        // Lanza el error para que el componente lo maneje
        throw error; 
    }
};

