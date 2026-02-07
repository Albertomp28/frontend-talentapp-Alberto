import { Navigate, useLocation } from 'react-router-dom';

/**
 * Componente que protege rutas privadas.
 * Verifica si existe un token de autenticación.
 * Si no existe, redirige a /login preservando la ubicación original.
 */
const PrivateRoute = ({ children }) => {
  const location = useLocation();

  // Simulación de verificación de token
  // TODO: Reemplazar con lógica real de autenticación (Context, Redux, etc.)
  const getToken = () => {
    return localStorage.getItem('auth_token');
  };

  const isAuthenticated = !!getToken();

  if (!isAuthenticated) {
    // Redirige a login, guardando la ruta original para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
