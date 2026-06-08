// src/api/services/alumnoService.js
import apiClient from '../index'; // Importa la instancia de Axios configurada

/**
 * Reemplaza (PUT) la lista completa de horarios de un alumno activo.
 * Requiere token de staff (gestionado por el interceptor).
 * @param {string} dni - El DNI del alumno a modificar.
 * @param {Array} horarios - El nuevo array de horarios. Ej: [{ dia: "Lunes", nroGrupo: "1" }]
 */

/**
 * Obtiene la lista completa de alumnos.
 * Requiere token de administrador (gestionado por el interceptor).
 */
export const obtenerTodosLosAlumnos = async () => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get('/alumnos/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Acceso no autorizado. Se requieren permisos de administrador.");
        }
        return [];
    }
};

/**
 * Obtiene la información detallada de un alumno por su DNI.
 * Requiere token de staff (gestionado por el interceptor).
 */
export const obtenerAlumnoPorDni = async (dni) => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get(`/alumnos/${dni}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el detalle del alumno ${dni}:`, error);
        return null;
    }
};

/**
 * Obtiene los horarios de un alumno por su DNI.
 * Requiere token de staff (gestionado por el interceptor).
 */
export const obtenerHorariosPorDni = async (dni) => {
    try {
        // Usa apiClient y la ruta relativa
        const response = await apiClient.get(`/alumnos/${dni}/horarios`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los horarios del alumno ${dni}:`, error);
        return [];
    }
};

export const actualizarHorariosAlumno = async (dni, horarios) => {
    try {
        // 1. Prepara el 'body' tal como lo especificaste: { "horarios": [...] }
        const payload = {
        horarios: horarios || [] // Asegura que sea un array, aunque esté vacío
        };

        // 2. Llama al endpoint PUT con la ruta relativa y el payload
        const response = await apiClient.put(`/alumnos/${dni}/horarios`, payload);
        
        // 3. Devuelve la respuesta (probablemente los horarios actualizados o un mensaje de éxito)
        return response.data;

    } catch (error) {
        // 4. Maneja el error
        console.error(`Error al actualizar los horarios del alumno ${dni}:`, error.response?.data || error.message);
        // Vuelve a lanzar el error para que el componente que llama (InfoAlumno.vue)
        // sepa que la actualización falló y pueda mostrar un mensaje al usuario.
        throw error;
    }
};

export const actualizarPerfilAlumno = async (dni, datosModificados) => {
    try {
        const payload = datosModificados || {};

        const response = await apiClient.put(`/alumnos/${dni}`, payload);

        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el perfil del Alumno ${dni}:`, error.response?.data || error.message);
        throw error;
    }
}

export const obtenerDataCurrentUser = async () => {
    try {
        const response = await apiClient.get('/alumnos/mi-perfil');
        return response.data;
    } catch (error) {
        console.error("Error obteniendo datos del alumno:", error.response?.data || error.message);
        return null;
    }
}

export const obtenerHorarioCurrentUser = async () => {
    try {
        const response = await apiClient.get('/alumnos/mi-horario');
        return response.data;
    } catch (error) {
        console.error("Error obteniendo los horarios del alumno:", error.response?.data || error.message);
        return null;
    }
}

/**
 * Actualiza el plan (suscripción, trabajo, nivel) de un alumno.
 * Requiere token de staff (gestionado por el interceptor).
 * @param {string} dni - El DNI del alumno a modificar.
 * @param {object} planData - El objeto con { nombreSuscripcion, nombreTrabajo, nivel }.
 */
export const actualizarPlanAlumno = async (dni, planData) => {
    try {
        const payload = planData || {};
        
        // Llama al endpoint PATCH que devuelve 204 No Content
        const response = await apiClient.patch(`/alumnos/${dni}/plan`, payload);

        // La respuesta exitosa es 204, por lo que response.data estará vacío.
        // Devolvemos la respuesta para confirmar el éxito (o undefined).
        return response.data;

    } catch (error) {
        // Maneja el error
        console.error(`Error al actualizar el plan del alumno ${dni}:`, error.response?.data || error.message);
        // Vuelve a lanzar el error
        throw error;
    }
};



/**
 * Compara dos listas de horarios para ver si son idénticas en contenido.
 * @param {Array} horariosA - Lista de horarios [{ dia: 'Lunes', nroGrupo: '1' }]
 * @param {Array} horariosB - Otra lista de horarios
 * @returns {boolean} - True si son iguales, false si no.
 */
function sonHorariosIguales(horariosA, horariosB) {
    if (!horariosA || !horariosB) {
        // Maneja el caso de que uno sea nulo o undefined
        return !horariosA && !horariosB;
    }

    if (horariosA.length !== horariosB.length) {
        return false; // Diferente cantidad
    }

    // Normaliza y crea un Set para comparación
    // Usamos trim() para limpiar espacios como "4 " -> "4"
    const setA = new Set(
        horariosA.map(h => `${h.dia}|${h.nroGrupo.trim()}`)
    );

    for (const h of horariosB) {
        if (!setA.has(`${h.dia}|${h.nroGrupo.trim()}`)) {
        // Si un horario de B no está en A, no son iguales
        return false;
        }
    }

  return true; // Si pasó todas las pruebas, son iguales
}


// --- 2. Función Orquestadora Principal ---

/**
 * Maneja la lógica completa de guardar modificaciones del plan y horarios.
 *
 * @param {string} dni - DNI del alumno a modificar.
 * @param {object} alumnoOriginal - El objeto del alumno ANTES de las modificaciones 
 * (necesario para comparar si la suscripción cambió).
 * @param {object} nuevosDatos - El JSON del evento con { alumno: ..., horarios: ... }.
 */
export const guardarModificacionesPlanYHorarios = async (dni, alumnoOriginal, nuevosDatos) => {
    
    let planActualizado = false;
    let horariosActualizados = false;

    // --- PASO A: Actualizar el Plan (Suscripción, Trabajo, Nivel) ---
    // Esto lo hacemos siempre, ya que el backend maneja la lógica.
    
    // Mapeamos los datos del evento a lo que espera la API
    const planData = {
        nombreSuscripcion: nuevosDatos.alumno.suscripcion,
        nombreTrabajo: nuevosDatos.alumno.trabajoactual, // Mapeo de 'trabajoactual'
        nivel: nuevosDatos.alumno.nivel
    };

    try {
        await actualizarPlanAlumno(dni, planData);
        planActualizado = true;
        console.log("Plan actualizado exitosamente.");
    } catch (error) {
        console.error("Error crítico al actualizar el plan:", error);
        // Si el plan falla, detenemos todo y lanzamos el error
        throw new Error("Falló la actualización del plan. No se modificaron horarios.");
    }


    // --- PASO B: Decidir si actualizamos los horarios ---

    // 1. Verificamos si la suscripción cambió
    const suscripcionCambio = alumnoOriginal.suscripcion !== nuevosDatos.alumno.suscripcion;

    // 2. Obtenemos los horarios actuales desde la API para comparar
    let horariosActuales = [];
    try {
        // La API devuelve { horarios: [...] }
        const data = await obtenerHorariosPorDni(dni);
        horariosActuales = data.horarios || [];
    } catch (error) {
        console.error("Error al obtener horarios actuales para comparar:", error);
        throw new Error("El plan se actualizó, pero falló la obtención de horarios actuales.");
    }

    const horariosNuevos = nuevosDatos.horarios || [];
    
    // 3. Comparamos los horarios
    const horariosCambiaron = !sonHorariosIguales(horariosActuales, horariosNuevos);

    
    // --- PASO C: Ejecutar la actualización de horarios (si aplica) ---

    // Tu lógica de negocio:
    // Si la suscripción cambió O si los horarios cambiaron, actualizamos.
    
    if (suscripcionCambio || horariosCambiaron) {
        
        if (suscripcionCambio) {
        console.log("La suscripción cambió. Se actualizarán los horarios.");
        } else {
        console.log("La suscripción no cambió, pero los horarios sí. Actualizando...");
        }

        try {
        // Limpiamos los nroGrupo antes de enviar (ej: "4 " -> "4")
        const horariosNuevosLimpios = horariosNuevos.map(h => ({
            dia: h.dia,
            nroGrupo: h.nroGrupo.trim()
        }));

        await actualizarHorariosAlumno(dni, horariosNuevosLimpios);
        horariosActualizados = true;
        console.log("Horarios actualizados exitosamente.");
        } catch (error) {
        console.error("Error al actualizar horarios:", error);
        throw new Error("El plan se actualizó, pero falló la actualización de horarios.");
        }

    } else {
        // Optimización: Ni la suscripción ni los horarios cambiaron.
        console.log("Suscripción y horarios sin cambios. No se requiere actualizar horarios.");
    }

    // Devolvemos un resumen de lo que se hizo
    return { planActualizado, horariosActualizados };
};

/**
 * Elimina un alumno del sistema de forma permanente (y todos sus datos asociados).
 * Requiere permisos de Staff (Admin o Empleado).
 * @param {string} dni - DNI del alumno a eliminar.
 */
export const eliminarAlumnoAPI = async (dni) => {
    try {
        // Llama al endpoint DELETE /alumnos/{dni}
        await apiClient.delete(`/alumnos/${dni}`);
        return true; // Retorna true si la operación fue exitosa (status 204)
    } catch (error) {
        console.error(`Error al eliminar el alumno ${dni}:`, error.response?.data || error.message);
        // Lanzamos el error para que el componente (Alumnos.vue o InfoAlumno.vue) pueda mostrar la alerta
        throw error;
    }
};

/**
 * Pasa un alumno a estado inactivo.
 * Requiere permisos de Staff.
 * @param {string} dni - DNI del alumno.
 */
export const desactivarAlumnoAPI = async (dni) => {
    try {
        // Llama al endpoint POST /alumnos/{dni}/desactivar
        await apiClient.post(`/alumnos/${dni}/desactivar`);
        return true;
    } catch (error) {
        console.error(`Error al desactivar al alumno ${dni}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Reactiva a un alumno (pasa de inactivo a activo).
 * Requiere permisos de Staff.
 * @param {string} dni - DNI del alumno.
 */
export const reactivarAlumnoAPI = async (dni) => {
    try {
        // Llama al endpoint POST /alumnos/{dni}/reactivar
        await apiClient.post(`/alumnos/${dni}/reactivar`);
        return true;
    } catch (error) {
        console.error(`Error al reactivar al alumno ${dni}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Crea un nuevo alumno completo desde cero (Persona + Dirección + Alumno + Plan + Horarios).
 * Requiere permisos de Staff (Admin/Empleado).
 * * @param {object} datosFormulario - Objeto estructurado desde NuevoAlumno.vue
 * {
 * datosPersonales: { ... },
 * suscripcion: "...",
 * trabajo: "...",
 * nivel: "...",
 * horarios: [...]
 * }
 */
export const crearNuevoAlumno = async (datosFormulario) => {
    try {
        // 1. Transformación de Datos (Mapping)
        // Convertimos la estructura anidada del frontend a la estructura plana del backend
        const payloadAPI = {
            // --- Datos Persona ---
            dni: datosFormulario.datosPersonales.dni,
            nombre: datosFormulario.datosPersonales.nombre,
            apellido: datosFormulario.datosPersonales.apellido,
            sexo: datosFormulario.datosPersonales.sexo,
            // usuario: datosFormulario.datosPersonales.usuario,
            email: datosFormulario.datosPersonales.email,
            telefono: datosFormulario.datosPersonales.telefono,

            // --- Datos Dirección (Mapeo de nombres) ---
            nomProvincia: datosFormulario.datosPersonales.provincia, // Frontend: provincia -> Backend: nomProvincia
            nomLocalidad: datosFormulario.datosPersonales.localidad, // Frontend: localidad -> Backend: nomLocalidad
            calle: datosFormulario.datosPersonales.calle,
            numero: datosFormulario.datosPersonales.nro || "S/N",

            // --- Datos del Plan ---
            nombreSuscripcion: datosFormulario.suscripcion,
            nombreTrabajo: datosFormulario.trabajo,
            nivel: datosFormulario.nivel,

            // --- Horarios ---
            // Ya vienen formateados como [{ dia, nroGrupo }] desde el componente
            horarios: datosFormulario.horarios
        };

        // 2. Llamada a la API
        // Endpoint: POST /alumnos/nuevo
        const response = await apiClient.post('/alumnos/nuevo', payloadAPI);
        
        return response.data;

    } catch (error) {
        console.error("Error al crear el nuevo alumno:", error.response?.data || error.message);
        throw error; // Re-lanzamos para que el componente muestre la alerta de error
    }
};

