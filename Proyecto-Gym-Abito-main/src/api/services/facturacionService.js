// src/api/services/facturacionService.js
import api from '../index'; // O la ruta donde tengas tu instancia de axios configurada

export default {
    // GET /facturacion/
    obtenerFacturaciones() {
        return api.get('/facturacion/');
    },

    // GET /facturacion/reporte/{id}/pdf
    // Importante: responseType 'blob' para manejar archivos binarios
    obtenerReportePdf(idFacturacion) {
        return api.get(`/facturacion/reporte/${idFacturacion}/pdf`, {
        responseType: 'blob'
        });
    }
};

