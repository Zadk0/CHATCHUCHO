import React from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-[#00d4ff]/30 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,212,255,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            <span className="text-xl font-bold text-white tracking-widest">
              WZ<span className="text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">CHAT</span>
            </span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-300">
              {currentUser?.name || currentUser?.email}
            </span>
            
            <button
              onClick={handleLogout}
              className="text-sm font-bold text-[#00d4ff] border border-[#00d4ff]/50 hover:bg-[#00d4ff]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] px-4 py-2 rounded-md transition-all duration-300"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;