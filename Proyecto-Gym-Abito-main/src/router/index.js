import { createRouter, createWebHistory } from 'vue-router'
import PantallaInicio from '../views/PantallaInicio.vue'
import LoginView from '../views/LoginView.vue'
import PantallaUsuario from '../views/PantallaUsuario.vue'
import PantallaAdmin from '@/views/PantallaAdmin.vue'
import PantallaPersona from '@/views/PantallaPersona.vue'
import PantallaEmpleado from '@/views/PantallaEmpleado.vue'
import RegistroFinalView from '@/views/RegistroFinalView.vue'
import RecuperarView from '@/views/RecuperarView.vue'
// Funciones del storage
import { getToken, getUser } from '@/api/storage/userStorage'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: PantallaInicio
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/Usuario',
    name: 'PantallaUsuario',  
    component: PantallaUsuario,
    meta: { requiresAuth: true, role: 'alumno' } // Rol requerido: alumno
  },
  {
    path: '/Admin',
    name: 'PantallaAdmin',
    component: PantallaAdmin,
    meta: { requiresAuth: true, role: 'admin' } // Rol requerido: admin
  },
  {
    path: '/Persona',
    name: 'PantallaPersona',
    component: PantallaPersona,
    meta: { requiresAuth: true, role: 'persona' } // Rol requerido: persona (usuario básico)
  },
  {
    path: '/Empleado',
    name: 'PantallaEmpleado',
    component: PantallaEmpleado,
    meta: { requiresAuth: true, role: 'empleado' } // Rol requerido: empleado
  },
  {
    path: '/completar-registro',
    name: 'CompletarRegistro',
    component: RegistroFinalView,
    // No requiere auth porque viene del email
  },
  {
    path: '/Recuperacion',
    name: 'RecuperarContraseña',
    component: RecuperarView,
    // No requiere auth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation Guard Global
router.beforeEach((to, from, next) => {
  const loggedIn = !!getToken();
  const user = getUser();

  // 1. Si la ruta requiere autenticación y NO estamos logueados -> Login
  if (to.meta.requiresAuth && !loggedIn) {
    return next({ name: 'login' });
  }

  // 2. Si estamos logueados y la ruta tiene restricciones de rol
  if (loggedIn && to.meta.requiresAuth && to.meta.role) {
    const requiredRole = to.meta.role;

    // --- Validar ADMIN ---
    if (requiredRole === 'admin' && !user.esAdmin) {
      if (user.esEmpleado) return next({ name: 'PantallaEmpleado' });
      if (user.esAlumno) return next({ name: 'PantallaUsuario' });
      return next({ name: 'PantallaPersona' });
    }

    // --- Validar EMPLEADO ---
    if (requiredRole === 'empleado' && !user.esEmpleado && !user.esAdmin) {
      // Si no es empleado ni admin
      if (user.esAlumno) return next({ name: 'PantallaUsuario' });
      return next({ name: 'PantallaPersona' });
    }

    // --- Validar ALUMNO ---
    if (requiredRole === 'alumno' && !user.esAlumno && !user.esAdmin && !user.esEmpleado) {
      return next({ name: 'PantallaPersona' });
    }

    // --- Validar PERSONA ---
    // (Opcional) Podríamos restringir que un Admin entre a la pantalla de Persona,
    // pero generalmente no hace daño.
  }

  // 3. Evitar que usuarios logueados vuelvan al login
  if (to.path === '/login' && loggedIn) {
    if (user.esAdmin) return next({ name: 'PantallaAdmin' });
    if (user.esEmpleado) return next({ name: 'PantallaEmpleado' });
    if (user.esAlumno) return next({ name: 'PantallaUsuario' });
    return next({ name: 'PantallaPersona' });
  }

  next();
});

export default router