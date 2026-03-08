import React, { useState } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { encryptMessage, getSharedEncryptionKey } from '@/lib/encryption.js';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const MessageInput = ({ selectedUser, onMessageSent }) => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedUser) {
      return;
    }

    try {
      setSending(true);
      
      // Generate shared key based on both user IDs
      const sharedKey = getSharedEncryptionKey(currentUser.id, selectedUser.id);
      
      // Encrypt message using the shared key
      const encryptedMessage = encryptMessage(message.trim(), sharedKey);
      
      // Save encrypted message to database
      await pb.collection('messages').create({
        sender: currentUser.id,
        receiver: selectedUser.id,
        content: encryptedMessage,
      }, { $autoCancel: false });
      
      setMessage('');
      
      // Notify parent component to refresh messages
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-[#1a1a1a] border-t border-[#00d4ff]/30 relative z-20">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribir mensaje..."
          disabled={!selectedUser || sending}
          className="flex-1 px-4 py-3 text-sm bg-[#0a0a0a] text-white border border-[#00d4ff]/50 rounded-full focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!message.trim() || !selectedUser || sending}
          className="flex items-center justify-center w-12 h-12 bg-[#00d4ff] hover:bg-[#00b8e6] text-black rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,212,255,0.4)] hover:shadow-[0_0_25px_rgba(0,212,255,0.8)] hover:scale-105 active:scale-95"
          title="Enviar"
        >
          {sending ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-5 h-5 ml-1" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;