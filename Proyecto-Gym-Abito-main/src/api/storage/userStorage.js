
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'userData';

/**
 * Guarda el token de acceso y los datos del usuario en el localStorage.
 */
export const saveUser = (token, refreshToken, userData) => { // Agregamos refreshToken
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken); // Guardamos
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getRefreshToken = () => { // Nueva función
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Obtiene el token de acceso del localStorage.
 */
export const getToken = () => {
    return sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Obtiene los datos del usuario del localStorage.
 */
export const getUser = () => {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

/**
 * Elimina el token y los datos del usuario del localStorage.
 */
export const removeUser = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY); // Limpiamos
    sessionStorage.removeItem(USER_KEY);
};