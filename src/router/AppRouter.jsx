import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Componente de protección de rutas
import PrivateRoute from './PrivateRoute';

// Páginas públicas
import Login from '../pages/Login';

// Páginas privadas
import Dashboard from '../pages/Dashboard';
import CrearVacante from '../pages/vacantes/CrearVacante';
import DetalleVacante from '../pages/vacantes/DetalleVacante';
import MisVacantes from '../pages/vacantes/MisVacantes';
import PerfilCandidato from '../pages/candidatos/PerfilCandidato';
import Remanente from '../pages/Remanente';

// Página 404
import NotFound from '../pages/NotFound';

/**
 * Configuración principal de rutas de TalentApp
 *
 * Estructura:
 * - Rutas públicas: /login, /
 * - Rutas privadas: Protegidas por PrivateRoute, dentro de DashboardLayout
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============ RUTAS PÚBLICAS ============ */}
        <Route path="/login" element={<Login />} />

        {/* Redirección de raíz a login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ============ RUTAS PRIVADAS ============ */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Dashboard - Listado de vacantes */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Mis Vacantes - Gestión */}
          <Route path="mis-vacantes" element={<MisVacantes />} />

          {/* Vacantes */}
          <Route path="vacantes">
            <Route path="crear" element={<CrearVacante />} />
            <Route path="editar/:id" element={<CrearVacante />} />
            <Route path=":id" element={<DetalleVacante />} />
          </Route>

          {/* Candidatos */}
          <Route path="candidatos">
            <Route path=":id" element={<PerfilCandidato />} />
          </Route>

          {/* Remanente - Pool de candidatos */}
          <Route path="remanente" element={<Remanente />} />
        </Route>

        {/* ============ RUTA 404 ============ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
