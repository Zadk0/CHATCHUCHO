import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Search, Circle } from 'lucide-react';

const UserList = ({ selectedUser, onSelectUser }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('users').getFullList({
        sort: '-online_status,-last_seen',
        $autoCancel: false,
      });
      
      // Filter out current user
      const filteredUsers = records.filter(user => user.id !== currentUser?.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1a1a1a] border-r border-[#00d4ff]/30">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_10px_rgba(0,212,255,0.5)]"></div>
          <p className="text-sm text-[#00d4ff] animate-pulse">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] border-r border-[#00d4ff]/30">
      {/* Search Bar */}
      <div className="p-4 border-b border-[#00d4ff]/30 bg-[#0a0a0a]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#00d4ff]/70" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#1a1a1a] text-white border border-[#00d4ff]/30 rounded-md focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_10px_rgba(0,212,255,0.3)] transition-all duration-200"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">Sin usuarios encontrados</p>
          </div>
        ) : (
          <div className="divide-y divide-[#00d4ff]/10">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={`w-full p-4 flex items-center gap-3 transition-all duration-200 ${
                  selectedUser?.id === user.id 
                    ? 'bg-[#00d4ff]/10 border-l-4 border-[#00d4ff] shadow-[inset_0_0_20px_rgba(0,212,255,0.05)]' 
                    : 'hover:bg-[#00d4ff]/5 border-l-4 border-transparent'
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-sm ${
                    selectedUser?.id === user.id ? 'bg-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.5)]' : 'bg-gray-600 text-white'
                  }`}>
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  {user.online_status && (
                    <Circle className="absolute -bottom-1 -right-1 w-3.5 h-3.5 fill-[#00ff88] text-[#1a1a1a] border-2 border-[#1a1a1a] rounded-full drop-shadow-[0_0_5px_rgba(0,255,136,0.8)]" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-left">
                  <p className={`text-sm font-medium truncate ${
                    selectedUser?.id === user.id ? 'text-[#00d4ff] drop-shadow-[0_0_2px_rgba(0,212,255,0.5)]' : 'text-gray-200'
                  }`}>
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;