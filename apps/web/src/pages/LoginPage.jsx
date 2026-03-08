import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { ShieldAlert } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.email || !formData.password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/chat');
    } catch (err) {
      if (err.message === 'unverified') {
        setError('Identidad no verificada. Por favor revisa tu email para el enlace de verificación.');
      } else {
        setError('Autenticación fallida. Credenciales inválidas.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - WZChat</title>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing orb background */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00d4ff] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-md w-full neon-card p-8 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-widest mb-2">
              WZ<span className="neon-text">CHAT</span>
            </h1>
            <p className="text-gray-400 text-sm uppercase tracking-widest">Establecer Conexión</p>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 bg-[#00ff88]/10 border border-[#00ff88]/50 rounded-md flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] mr-3 animate-pulse"></div>
              <p className="text-sm neon-success font-medium">{successMsg}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-[#ff0080]/10 border border-[#ff0080]/50 rounded-md flex items-start">
              <ShieldAlert className="w-5 h-5 text-[#ff0080] mr-3 shrink-0 drop-shadow-[0_0_5px_rgba(255,0,128,0.8)]" />
              <p className="text-sm neon-error font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="neon-input"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contraseña</label>
                <Link to="/reset-password" className="text-xs text-[#00d4ff] hover:text-white transition-colors">
                  ¿Olvidaste?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="neon-input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neon-button mt-8"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'INICIAR SESIÓN'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#00d4ff]/20 pt-6">
            <p className="text-sm text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link to="/signup" className="font-bold text-[#00d4ff] hover:text-white transition-colors drop-shadow-[0_0_5px_rgba(0,212,255,0.5)]">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;