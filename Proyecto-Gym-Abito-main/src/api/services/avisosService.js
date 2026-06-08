// src/api/services/avisosService.js
import apiClient from '../index';

/**
 * Obtiene la lista de avisos.
 * Accesible para todos los usuarios autenticados.
 */
export const listarAvisos = async () => {
    try {
        const response = await apiClient.get('/avisos/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los avisos:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Crea un nuevo aviso.
 * Requiere permisos de Staff (Admin/Empleado).
 * @param {object} datosAviso - { descripcion: "Texto..." }
 */
export const crearAviso = async (datosAviso) => {
    try {
        const response = await apiClient.post('/avisos/', datosAviso);
        return response.data;
    } catch (error) {
        console.error("Error al crear el aviso:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Actualiza un aviso existente.
 * Requiere permisos de Staff.
 * @param {number} idAviso - ID del aviso a editar.
 * @param {object} datosAviso - { descripcion: "Texto nuevo..." }
 */
export const actualizarAviso = async (idAviso, datosAviso) => {
    try {
        const response = await apiClient.put(`/avisos/${idAviso}`, datosAviso);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el aviso ${idAviso}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Elimina un aviso.
 * Requiere permisos de Staff.
 * @param {number} idAviso - ID del aviso a eliminar.
 */
export const eliminarAviso = async (idAviso) => {
    try {
        await apiClient.delete(`/avisos/${idAviso}`);
        return true;
    } catch (error) {
        console.error(`Error al eliminar el aviso ${idAviso}:`, error.response?.data || error.message);
        throw error;
    }
};