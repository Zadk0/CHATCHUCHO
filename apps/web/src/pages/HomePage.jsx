import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Lock, Mail, Shield } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>WZChat - Aplicación de Chat Seguro</title>
        <meta name="description" content="Conecta con otros de forma segura con encriptación de extremo a extremo." />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        
        {/* Glowing orb background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d4ff] rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

        {/* Header */}
        <header className="w-full py-6 px-6 sm:px-12 flex justify-between items-center relative z-20 border-b border-[#00d4ff]/20 bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            <span className="text-2xl font-bold tracking-widest">
              WZ<span className="text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">CHAT</span>
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <button 
              onClick={() => navigate('/signup')}
              className="px-5 py-2 bg-[#00d4ff] text-black text-sm font-bold rounded-md hover:shadow-[0_0_15px_rgba(0,212,255,0.6)] transition-all duration-300 hover:scale-105"
            >
              Registrarse
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative z-10">
          <div className="max-w-4xl w-full text-center space-y-8">
            
            <div className="w-24 h-24 bg-[#00d4ff]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#00d4ff]/30 shadow-[0_0_30px_rgba(0,212,255,0.2)]">
              <MessageSquare className="w-12 h-12 text-[#00d4ff] drop-shadow-[0_0_15px_rgba(0,212,255,0.8)]" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Aplicación de <span className="text-[#00d4ff] drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]">Chat Seguro</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Conecta con otros de forma segura. Tus conversaciones están protegidas con encriptación de extremo a extremo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-10 py-4 bg-[#00d4ff] text-black rounded-md transition-all duration-300 text-lg font-bold shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.8)] hover:scale-105"
              >
                Registrarse Gratis
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-[#00d4ff] text-[#00d4ff] rounded-md transition-all duration-300 text-lg font-bold hover:bg-[#00d4ff]/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="bg-[#1a1a1a] border border-[#00d4ff]/30 p-8 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-6 border border-[#00d4ff]/20 group-hover:border-[#00d4ff]/50 transition-colors">
                  <Lock className="w-7 h-7 text-[#00d4ff]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Mensajes Encriptados</h3>
                <p className="text-gray-400 leading-relaxed">
                  Tus mensajes están protegidos con encriptación de extremo a extremo. Solo tú y el receptor pueden leerlos.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#1a1a1a] border border-[#00d4ff]/30 p-8 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-6 border border-[#00d4ff]/20 group-hover:border-[#00d4ff]/50 transition-colors">
                  <Mail className="w-7 h-7 text-[#00d4ff]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Registro Sin Contraseña</h3>
                <p className="text-gray-400 leading-relaxed">
                  Verificación segura mediante correo electrónico. Accede a tu cuenta sin necesidad de recordar contraseñas complejas.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#1a1a1a] border border-[#00d4ff]/30 p-8 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-6 border border-[#00d4ff]/20 group-hover:border-[#00d4ff]/50 transition-colors">
                  <Shield className="w-7 h-7 text-[#00d4ff]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Privacidad Total</h3>
                <p className="text-gray-400 leading-relaxed">
                  Tu información personal se mantiene confidencial. No compartimos tus datos con terceros bajo ninguna circunstancia.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-[#00d4ff]/20 text-center relative z-10 bg-[#0a0a0a]">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} WZChat. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;