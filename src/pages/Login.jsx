/**
 * Login Page
 * Authentication page for users to log in to the application.
 * 
 * Refactored to use:
 * - useLogin hook for state management
 * - authService for authentication
 * 
 * @module pages/Login
 */

import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

/**
 * Login Page Component
 */
const Login = () => {
  const {
    email,
    password,
    rememberMe,
    isLoading,
    error,
    setEmail,
    setPassword,
    setRememberMe,
    handleSubmit,
  } = useLogin();

  const inputClass = "w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-button text-neutral-800 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 via-neutral-100 to-neutral-200 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-brand/25 shadow-lg">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">TalentApp</h1>
          <p className="text-neutral-500 text-sm">Portal de Reclutamiento con IA</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-neutral-200 rounded-card p-8 shadow-premium-lg">
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Iniciar Sesión</h2>
          <p className="text-neutral-500 text-sm mb-6">Ingresa tus credenciales para continuar</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-xl text-danger-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm text-neutral-500 mb-1.5">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className={inputClass}
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm text-neutral-500 mb-1.5">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  autoComplete="current-password"
                />
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-neutral-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-200 text-brand-500 focus:ring-brand-500"
                  />
                  Recordarme
                </label>
                <Link to="#" className="text-sm text-brand-500 hover:text-brand-600 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-linear-to-r from-brand-500 to-brand-600 text-white rounded-button font-medium transition-all hover:shadow-brand/30 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-300 mt-6">
          © 2026 TalentApp. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;
