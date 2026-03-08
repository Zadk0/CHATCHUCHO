import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { ShieldAlert } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength
  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.match(/[A-Z]/)) strength += 25;
    if (pwd.match(/[0-9]/)) strength += 25;
    if (pwd.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-800';
    if (passwordStrength <= 25) return 'bg-[#ff0080] shadow-[0_0_10px_rgba(255,0,128,0.5)]';
    if (passwordStrength <= 50) return 'bg-[#ff9900] shadow-[0_0_10px_rgba(255,153,0,0.5)]';
    if (passwordStrength <= 75) return 'bg-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.5)]';
    return 'bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.5)]';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.name) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (passwordStrength < 50) {
      setError('La contraseña es muy débil. Aumenta la complejidad.');
      return;
    }

    try {
      setLoading(true);
      await signup(formData.email, formData.name, formData.password);
      
      // Redirect to verification page
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. El email podría estar en uso.');
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
        <title>Crear Cuenta - WZChat</title>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glowing orb background */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00d4ff] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-md w-full neon-card p-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-widest mb-2">
              NUEVO <span className="neon-text">AGENTE</span>
            </h1>
            <p className="text-gray-400 text-sm uppercase tracking-widest">Protocolo de Registro</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#ff0080]/10 border border-[#ff0080]/50 rounded-md flex items-start">
              <ShieldAlert className="w-5 h-5 text-[#ff0080] mr-3 shrink-0 drop-shadow-[0_0_5px_rgba(255,0,128,0.8)]" />
              <p className="text-sm neon-error font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Nombre</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="neon-input"
                placeholder="Tu nombre"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="neon-input"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Contraseña</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="neon-input"
                placeholder="••••••••"
              />
              
              {/* Password Strength Indicator */}
              <div className="mt-2 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="neon-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neon-button mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'CREAR CUENTA'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#00d4ff]/20 pt-6">
            <p className="text-sm text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-bold text-[#00d4ff] hover:text-white transition-colors drop-shadow-[0_0_5px_rgba(0,212,255,0.5)]">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;