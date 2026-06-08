
import api from '../index';

export const obtenerHorariosCompletos = async () => {
    try {
        // Llama al endpoint GET /horarios/ de tu API
        const response = await api.get('/horarios/');
        
        // Devuelve el array con los datos de los horarios
        return response.data;
    } catch (error) {
        console.error("Error al obtener los horarios completos:", error.response?.data || error.message);
        // Devuelve un array vacío en caso de error para que la UI no falle
        return []; 
    }
};

/**
 * Elimina un grupo de horario por su nroGrupo.
 * @param {string|number} nroGrupo - El número del grupo a eliminar.
 * @returns {boolean} - Devuelve true si la eliminación fue exitosa (status 204).
 * @throws {Error} - Lanza un error si la API falla (ej: 404, 400).
 */
export const eliminarHorarioGrupo = async (nroGrupo) => {
    try {
        // Llama al endpoint DELETE /horarios/{nroGrupo}
        const response = await api.delete(`/horarios/${nroGrupo}`);
        
        // Si la API devuelve 204 (No Content), significa que se eliminó con éxito.
        // Devolvemos true para que el componente sepa que la operación funcionó.
        return response.status === 204;

    } catch (error) {
        // Capturamos y mostramos el error
        console.error(`Error al eliminar el grupo ${nroGrupo}:`, error.response?.data || error.message);
        
        // Lanzamos el error para que el componente (quien llamó a esta función)
        // pueda manejarlo y mostrar un mensaje al usuario (ej: "404: Grupo no encontrado").
        throw error; 
    }
};

/**
 * Crea un nuevo grupo de horario completo (con sus días asignados).
 * @param {object} datosGrupo - El objeto completo del grupo a crear.
 * @example
 * {
 * "nroGrupo": "6", // La API podría autogenerarlo, pero seguimos tu ejemplo
 * "horaInicio": "03:00:00",
 * "horaFin": "04:00:00",
 * "dias_asignados": [
 * { "dia": "Lunes", "capacidadMax": 10, "dniEmpleado": null }
 * ]
 * }
 * @returns {object} - El objeto del grupo recién creado (devuelto por la API).
 * @throws {Error} - Lanza un error si la API falla.
 */
export const crearHorarioGrupo = async (datosGrupo) => {
    try {
        // Llama al endpoint POST /horarios/completo
        // El 'Content-Type: application/json' es el default de apiClient
        const response = await api.post('/horarios/completo', datosGrupo);
        
        // Devuelve el objeto del grupo recién creado (ej: status 201)
        return response.data;

    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error al crear el nuevo grupo:", error.response?.data || error.message);
        
        // Lanzamos el error para que el componente pueda manejarlo.
        throw error; 
    }
};

/**
 * Actualiza un grupo de horario completo.
 * La API espera un 'PUT' a /horarios/ con el 'originalNroGrupo' en el body.
 * @param {object} datosGrupoCompletos - El objeto completo del grupo, incluyendo 'originalNroGrupo'.
 * @example
 * {
 * "nroGrupo": "1",
 * "horaInicio": "07:00:00",
 * "horaFin": "09:00:00",
 * "dias_asignados": [...],
 * "originalNroGrupo": "1" // ID original
 * }
 * @returns {object} - El objeto del grupo actualizado.
 * @throws {Error} - Lanza un error si la API falla.
 */
export const actualizarHorarioGrupo = async (datosGrupoCompletos) => {
    try {
        // Llama al endpoint PUT /horarios/
        // El body es el objeto completo, tal como lo espera la API.
        const response = await api.put('/horarios/', datosGrupoCompletos);
        
        // Devuelve el objeto del grupo actualizado
        return response.data;

    } catch (error) {
        const originalId = datosGrupoCompletos?.originalNroGrupo || 'desconocido';
        console.error(`Error al actualizar el grupo (original: ${originalId}):`, error.response?.data || error.message);
        throw error; 
    }
};