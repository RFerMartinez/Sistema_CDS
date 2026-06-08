// src/api/services/suscripcionesService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada

/**
 * Obtiene la lista completa de suscripciones.
 * (Asume que requiere un token, que el interceptor de apiClient maneja).
 */
export const obtenerSuscripciones = async () => {
    try {
        // Llama al endpoint GET /suscripciones/ de tu API
        const response = await apiClient.get('/suscripciones/');
        
        // Devuelve el array con los datos de las suscripciones
        return response.data;
    } catch (error) {
        console.error("Error al obtener las suscripciones:", error.response?.data || error.message);
        // Devuelve un array vacío en caso de error para que la UI no falle
        return []; 
    }
};

/**
 * Elimina una suscripción por su nombre.
 * @param {string} nombreSuscripcion - El nombre (ID) de la suscripción a eliminar.
 * @returns {boolean} - Devuelve true si la eliminación fue exitosa (status 204).
 * @throws {Error} - Lanza un error si la API falla (ej: 404, 400).
 */
export const eliminarSuscripcion = async (nombreSuscripcion) => {
    try {
        // Codifica el nombre de la suscripción para que sea seguro en una URL
        // (ej: "5 días a la semana" -> "5%20días%20a%20la%20semana")
        const encodedName = encodeURIComponent(nombreSuscripcion);

        // Llama al endpoint DELETE /suscripciones/{nombre_suscripcion}
        const response = await apiClient.delete(`/suscripciones/${encodedName}`);
        
        // Si la API devuelve 204 (No Content), significa que se eliminó con éxito.
        return response.status === 204;

    } catch (error) {
        // Capturamos y mostramos el error
        console.error(`Error al eliminar la suscripción "${nombreSuscripcion}":`, error.response?.data || error.message);
        
        // Lanzamos el error para que el componente pueda manejarlo.
        throw error; 
    }
};

/**
 * Crea una nueva suscripción.
 * @param {object} datosSuscripcion - Objeto con los datos de la nueva suscripción.
 * @example { "nombreSuscripcion": "5 días a la semana", "precio": 30000 }
 * @returns {object} - El objeto de la suscripción recién creada (devuelto por la API).
 * @throws {Error} - Lanza un error si la API falla.
 */
export const crearSuscripcion = async (datosSuscripcion) => {
    try {
        // Llama al endpoint POST /suscripciones/
        // El 'Content-Type: application/json' es el default de apiClient
        const response = await apiClient.post('/suscripciones/', datosSuscripcion);
        
        // Devuelve el objeto de la suscripción recién creada (ej: status 201)
        return response.data;

    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error al crear la nueva suscripción:", error.response?.data || error.message);
        
        // Lanzamos el error para que el componente pueda manejarlo.
        throw error; 
    }
};

/**
 * Actualiza el precio de una suscripción existente.
 * @param {string} nombreSuscripcion - El nombre *actual* de la suscripción (para la URL).
 * @param {number} nuevoPrecio - El nuevo valor del precio.
 * @returns {object} - El objeto de la suscripción actualizada (devuelto por la API).
 * @throws {Error} - Lanza un error si la API falla.
 */
export const actualizarPrecioSuscripcion = async (nombreSuscripcion, nuevoPrecio) => {
    try {
        // 1. Codifica el nombre para que sea seguro en la URL
        const encodedName = encodeURIComponent(nombreSuscripcion);
        
        // 2. Prepara el payload/body tal como lo pide la API
        const payload = {
            precio: nuevoPrecio
        };

        // 3. Llama al endpoint PATCH con la URL y el payload
        const response = await apiClient.patch(`/suscripciones/${encodedName}`, payload);
        
        // 4. Devuelve el objeto actualizado
        return response.data;

    } catch (error) {
        // 5. Maneja el error
        console.error(`Error al actualizar el precio de la suscripción "${nombreSuscripcion}":`, error.response?.data || error.message);
        // Lanza el error para que el componente (Suscripciones.vue) lo maneje
        throw error; 
    }
};

