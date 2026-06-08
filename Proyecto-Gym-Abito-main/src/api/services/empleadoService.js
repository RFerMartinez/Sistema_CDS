// src/api/services/empleadoService.js
import apiClient from '../index';

/**
 * Crea un nuevo empleado (Persona + Datos + Horarios).
 * Requiere permisos de Administrador.
 * @param {object} datosEmpleado - Objeto con estructura { dni, nombre, ..., horarios: [] }
 */
export const crearEmpleado = async (datosEmpleado) => {
    try {
        // Llama al endpoint POST /empleados/ que creamos en el backend
        const response = await apiClient.post('/empleados/', datosEmpleado);
        return response.data;
    } catch (error) {
        console.error("Error al crear el empleado:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene la lista de todos los empleados.
 * Requiere permisos de Administrador.
 */
export const listarEmpleados = async () => {
    try {
        // Llama al endpoint GET /empleados/
        const response = await apiClient.get('/empleados/');
        return response.data;
    } catch (error) {
        console.error("Error al listar empleados:", error.response?.data || error.message);
        // Devolvemos array vacío para evitar que la UI explote
        return [];
    }
};

/**
 * Obtiene el detalle completo de un empleado (Datos personales + Horarios).
 * Requiere permisos de Administrador.
 * @param {string} dni - DNI del empleado a buscar.
 */
export const obtenerEmpleadoPorDni = async (dni) => {
    try {
        // Llama al endpoint GET /empleados/{dni}
        const response = await apiClient.get(`/empleados/${dni}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener detalle del empleado ${dni}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Actualiza los horarios asignados a un empleado.
 * Requiere permisos de Admin.
 * @param {string} dni - DNI del empleado.
 * @param {object} payload - Objeto { horarios: [ { dia, nroGrupo } ] }
 */
export const actualizarHorariosEmpleado = async (dni, payload) => {
    try {
        await apiClient.put(`/empleados/${dni}/horarios`, payload);
        return true;
    } catch (error) {
        console.error(`Error al actualizar horarios del empleado ${dni}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Da de baja a un empleado.
 * Requiere permisos de Admin.
 * @param {string} dni - DNI del empleado a eliminar.
 */
export const eliminarEmpleado = async (dni) => {
    try {
        await apiClient.delete(`/empleados/${dni}`);
        return true;
    } catch (error) {
        console.error(`Error al eliminar empleado ${dni}:`, error.response?.data || error.message);
        throw error;
    }
};

