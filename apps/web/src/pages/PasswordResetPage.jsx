import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';

const PasswordResetPage = () => {
  const { requestPasswordReset } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Inválido');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset(email);
      setEmailSent(true);
      
      toast({
        title: 'Enviado',
        description: 'Revisa tu correo para las instrucciones.',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el correo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <Helmet>
          <title>Correo Enviado - SecureChat</title>
        </Helmet>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#34C759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Revisa tu correo</h2>
            <p className="text-sm text-gray-600 mb-8">
              Hemos enviado las instrucciones a <strong className="text-gray-900">{email}</strong>
            </p>
            <Link to="/login" className="inline-block w-full py-3 bg-[#007AFF] hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-all duration-200 shadow-md">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Recuperar Contraseña - SecureChat</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#007AFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#007AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h2>
            <p className="text-sm text-gray-500 mt-2">Ingresa tu correo para recibir instrucciones</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all duration-200 text-sm ${
                  error ? 'border-[#FF3B30]' : 'border-gray-200'
                }`}
                placeholder="tu@correo.com"
              />
              {error && <p className="mt-1 text-xs font-medium text-[#FF3B30]">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-[#007AFF] hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Enviar Instrucciones'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="font-medium text-[#007AFF] hover:text-blue-700 transition-colors text-sm">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetPage;