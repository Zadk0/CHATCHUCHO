import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requestEmailVerification } = useAuth();
  
  const email = location.state?.email || 'tu correo electrónico';
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    if (email === 'tu correo electrónico') {
      setError('Email no encontrado. Por favor intenta registrarte de nuevo.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      await requestEmailVerification(email);
      
      setMessage('Email de verificación reenviado exitosamente. Por favor revisa tu bandeja de entrada.');
    } catch (err) {
      setError('Error al reenviar el email de verificación. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verifica tu email - WZChat</title>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing orb background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00d4ff] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

        <div className="max-w-md w-full neon-card p-8 relative z-10 text-center">
          <div className="w-20 h-20 bg-[#00d4ff]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00d4ff]/30 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            <Mail className="w-10 h-10 text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3 tracking-wider">VERIFICA TU EMAIL</h2>
          
          <p className="text-gray-400 mb-6 leading-relaxed">
            Hemos enviado un enlace de verificación seguro a<br/>
            <span className="text-white font-medium neon-text">{email}</span>
          </p>

          <div className="bg-black/50 border border-[#00d4ff]/30 rounded-lg p-4 mb-8 text-sm text-gray-400 text-left">
            <p className="flex items-start">
              <AlertCircle className="w-5 h-5 text-[#00d4ff] mr-2 shrink-0" />
              <span>Revisa tu correo electrónico y carpeta de spam. Haz clic en el enlace del email para activar tu cuenta.</span>
            </p>
          </div>

          {message && (
            <div className="mb-6 p-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-md">
              <p className="text-sm neon-success font-medium">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-[#ff0080]/10 border border-[#ff0080]/30 rounded-md">
              <p className="text-sm neon-error font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={loading}
              className="neon-button"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Reenviar email de verificación'
              )}
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="neon-button-secondary group"
            >
              Volver a Iniciar Sesión
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerificationPage;