import React, { useState, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { decryptMessage, getSharedEncryptionKey } from '@/lib/encryption.js';
import { MessageSquare } from 'lucide-react';

const ChatWindow = ({ selectedUser, refreshTrigger }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      
      // Poll for new messages every 1 second
      const interval = setInterval(fetchMessages, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedUser, refreshTrigger]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!selectedUser || !currentUser) return;

    try {
      if (messages.length === 0) {
        setLoading(true);
      }

      const filter = `(sender="${currentUser.id}" && receiver="${selectedUser.id}") || (sender="${selectedUser.id}" && receiver="${currentUser.id}")`;
      
      const records = await pb.collection('messages').getFullList({
        filter,
        sort: 'created',
        $autoCancel: false,
      });

      setMessages(records);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="text-center neon-card p-8 relative z-10 max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-[#00d4ff]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00d4ff]/30 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <MessageSquare className="w-8 h-8 text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          </div>
          <p className="text-lg font-bold text-white tracking-wide mb-2">Selecciona un usuario para chatear</p>
          <p className="text-sm text-gray-400">Tus mensajes están encriptados de extremo a extremo</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_10px_rgba(0,212,255,0.5)]"></div>
          <p className="text-sm font-medium text-[#00d4ff] animate-pulse">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  // Generate shared key for decryption
  const sharedKey = getSharedEncryptionKey(currentUser.id, selectedUser.id);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] relative">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Chat Header */}
      <div className="p-4 border-b border-[#00d4ff]/30 bg-[#1a1a1a]/80 backdrop-blur-md z-10 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="w-10 h-10 rounded-full bg-[#00d4ff] flex items-center justify-center text-black font-bold shadow-[0_0_10px_rgba(0,212,255,0.5)]">
          {(selectedUser.name || selectedUser.email)[0].toUpperCase()}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{selectedUser.name || selectedUser.email}</h3>
          <p className="text-xs text-[#00ff88] font-medium drop-shadow-[0_0_2px_rgba(0,255,136,0.8)]">
            {selectedUser.online_status ? 'En línea' : 'Desconectado'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/30 inline-block px-4 py-2 rounded-full shadow-[0_0_10px_rgba(0,212,255,0.1)]">
              Sin mensajes. ¡Inicia la conversación!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSender = msg.sender === currentUser.id;
            const decryptedContent = decryptMessage(msg.content, sharedKey);

            return (
              <div
                key={msg.id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm relative group ${
                    isSender
                      ? 'bg-[#00d4ff] text-black rounded-br-sm shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                      : 'bg-[#1a1a1a] text-white rounded-bl-sm border border-[#00d4ff]/30 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <p className="break-words leading-relaxed font-medium">{decryptedContent}</p>
                  <div
                    className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                      isSender ? 'text-black/70' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.created)}
                    {isSender && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;