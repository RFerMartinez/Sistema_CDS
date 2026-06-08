import axios from 'axios';

const GEOREF_API_URL = process.env.VUE_APP_GEOREF_API_URL

/**
 * Obtiene todas las provincias de Argentina.
 */
export const obtenerProvinciasArg = async () => {
    try {
        const response = await axios.get(`${GEOREF_API_URL}/provincias?orden=nombre`);
        return response.data.provincias; // Retorna un array de objetos { id, nombre }
    } catch (error) {
        console.error("Error al obtener provincias:", error);
        return [];
    }
};

/**
 * Obtiene las localidades de una provincia específica.
 * @param {string|number} idProvincia - El ID de la provincia seleccionada.
 */
export const obtenerLocalidadesArg = async (idProvincia) => {
    try {
        // Pedimos max=1000 para asegurarnos de traer todas, ordenadas por nombre
        const response = await axios.get(`${GEOREF_API_URL}/localidades?provincia=${idProvincia}&orden=nombre&max=1000`);
        return response.data.localidades; // Retorna array de objetos { id, nombre, ... }
    } catch (error) {
        console.error("Error al obtener localidades:", error);
        return [];
    }
};

