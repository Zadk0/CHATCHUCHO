import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerificationHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      setStatus('error');
      setErrorMessage('Faltan parámetros de verificación. Enlace inválido.');
      return;
    }

    const processVerification = async () => {
      try {
        await verifyEmail(userId, token);
        setStatus('success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { state: { message: 'Email verificado exitosamente. Ya puedes iniciar sesión.' } });
        }, 3000);
      } catch (error) {
        setStatus('error');
        setErrorMessage(error.message || 'Error al verificar el email. El enlace puede haber expirado o ser inválido.');
      }
    };

    processVerification();
  }, [searchParams, verifyEmail, navigate]);

  return (
    <>
      <Helmet>
        <title>Verificando... - WZChat</title>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-md w-full neon-card p-8 relative z-10 text-center">
          
          {status === 'verifying' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-[#00d4ff] animate-spin mb-6 drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
              <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">DESCIFRANDO TOKEN</h2>
              <p className="text-gray-400">Por favor espera mientras verificamos tu identidad...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <CheckCircle className="w-16 h-16 text-[#00ff88] mb-6 drop-shadow-[0_0_15px_rgba(0,255,136,0.8)]" />
              <h2 className="text-2xl font-bold text-white mb-2 tracking-wide neon-success">ACCESO CONCEDIDO</h2>
              <p className="text-gray-300 mb-6">Tu email ha sido verificado exitosamente.</p>
              <p className="text-sm text-[#00d4ff] animate-pulse">Redirigiendo a la secuencia de inicio de sesión...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <XCircle className="w-16 h-16 text-[#ff0080] mb-6 drop-shadow-[0_0_15px_rgba(255,0,128,0.8)]" />
              <h2 className="text-2xl font-bold text-white mb-2 tracking-wide neon-error">VERIFICACIÓN FALLIDA</h2>
              <p className="text-gray-300 mb-8">{errorMessage}</p>
              <button 
                onClick={() => navigate('/login')}
                className="neon-button"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default VerificationHandler;