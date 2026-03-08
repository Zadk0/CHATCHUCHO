import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import UserList from '@/components/UserList.jsx';
import ChatWindow from '@/components/ChatWindow.jsx';
import MessageInput from '@/components/MessageInput.jsx';

const ChatApp = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMessageSent = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <Helmet>
        <title>Chats - WZChat</title>
      </Helmet>

      <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
        <Header />
        
        <div className="flex-1 flex overflow-hidden">
          {/* User List Sidebar */}
          <div className="w-80 flex-shrink-0 border-r border-[#00d4ff]/30 bg-[#1a1a1a]">
            <UserList selectedUser={selectedUser} onSelectUser={setSelectedUser} />
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-[#0a0a0a]">
            <div className="flex-1 overflow-hidden">
              <ChatWindow selectedUser={selectedUser} refreshTrigger={refreshTrigger} />
            </div>
            <MessageInput selectedUser={selectedUser} onMessageSent={handleMessageSent} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatApp;