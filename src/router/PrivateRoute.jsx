import { Navigate, useLocation } from 'react-router-dom';
import { storageService } from '../services';

/**
 * Componente que protege rutas privadas.
 * Verifica si existe un token de autenticación.
 * Si no existe, redirige a /login preservando la ubicación original.
 */
const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const getToken = () => {
    return storageService.getItem(storageService.KEYS.AUTH_TOKEN, null);
  };

  const isAuthenticated = !!getToken();

  if (!isAuthenticated) {
    // Redirige a login, guardando la ruta original para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
