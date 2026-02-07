/**
 * useLogin Hook
 * Custom hook for managing login form state and authentication.
 *
 * @module hooks/useLogin
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, storageService } from '../services';
import { validateLoginCredentials } from '../utils/validators';

/**
 * Custom hook for Login page
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Limpiar tokens al cargar la página de login
  useEffect(() => {
    storageService.clearAll();
  }, []);

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate credentials
        const validation = validateLoginCredentials({ email, password });
        if (!validation.isValid) {
            setError(validation.errors[0]);
            return;
        }

        setIsLoading(true);

        try {
            const result = await authService.login({ email, password });

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Credenciales inválidas');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // State
        email,
        password,
        rememberMe,
        isLoading,
        error,

        // Setters
        setEmail,
        setPassword,
        setRememberMe,

        // Actions
        handleSubmit,
    };
};

export default useLogin;
