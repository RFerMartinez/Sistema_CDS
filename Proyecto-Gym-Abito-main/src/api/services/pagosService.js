// src/api/services/pagosService.js
import apiClient from '../index'; // O la ruta donde tengas tu instancia de axios

export default {
  /**
   * Llama al backend para crear la preferencia de pago de una cuota
   * @param {Number} idCuota - El ID de la cuota a pagar
   * @param {Number} montoFinal - El monto final calculado en el front (con recargos si aplica)
   * @returns {Promise<Object>} - Retorna el objeto con init_point y sandbox_init_point
   */
  async iniciarPago(idCuota, montoFinal) {
    try {
        // Preparamos el cuerpo de la petición. 
        // La clave debe ser "monto_final" porque así lo espera el backend (snake_case).
        const payload = {
            monto_final: montoFinal
        };

        // Enviamos el payload en el segundo argumento del post
        const response = await apiClient.post(`/pagos/crear-preferencia/${idCuota}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error al iniciar pago:', error);
        throw error;
    }
  },

  /**
   * Consulta si una cuota ya está pagada
   * @param {Number} idCuota 
   * @returns {Promise<Boolean>}
   */
  async verificarEstadoPago(idCuota) {
    try {
      // Ajusta la ruta si tu endpoint de cuotas tiene otro prefijo (ej: /cuotas)
      // Asumo que tienes un endpoint de cuotas, si no, usa axios directo
      const response = await apiClient.get(`/pagos/${idCuota}/estado`);
      return response.data;
    } catch (error) {
      console.error('Error verificando estado:', error);
      return false;
    }
  }
};

export const verComprobante = async (idCuota) => {
    try {
        const response = await apiClient.get(`/pagos/comprobante/${idCuota}`, {
            responseType: 'blob' // ¡Crucial! Indica que esperamos un archivo
        });
        
        // Crear una URL temporal para el archivo PDF
        const pdfUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        
        // Abrir en nueva pestaña
        window.open(pdfUrl, '_blank');
        
        // Opcional: Liberar memoria después de un tiempo
        // setTimeout(() => window.URL.revokeObjectURL(pdfUrl), 10000);
        
    } catch (error) {
        console.error("Error al descargar comprobante:", error);
        throw error;
    }
};

export const marcarPagadaAdmin = async (idCuota, metodoPago) => {
    try {
        // PUT /pagos/marcar-pagada/{id}
        // Enviamos el body { "metodo_pago": "..." }
        // Nota: la clave debe ser snake_case ("metodo_pago") para coincidir con Python si usas embed=True automático, 
        // o camelCase si configuraste Pydantic diferente. Por defecto FastAPI con Body(embed=True) usa el nombre del argumento.
        const payload = { metodo_pago: metodoPago };
        
        await apiClient.put(`/pagos/marcar-pagada/${idCuota}`, payload);
        return true;
    } catch (error) {
        console.error("Error al marcar pago manual:", error);
        throw error;
    }
};

