
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, User, Message } from '../types';

interface MessagingCenterProps {
  user: User;
  conversations: Conversation[];
  onSendMessage: (convoId: string, text: string) => void;
  onClose: () => void;
  initialActiveId?: string;
}

const MessagingCenter: React.FC<MessagingCenterProps> = ({ 
  user, 
  conversations, 
  onSendMessage, 
  onClose,
  initialActiveId 
}) => {
  const [activeId, setActiveId] = useState<string | null>(initialActiveId || (conversations.length > 0 ? conversations[0].id : null));
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConvo = conversations.find(c => c.id === activeId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConvo?.messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeId) return;
    onSendMessage(activeId, inputText);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white">
        <h2 className="font-bold">Messages</h2>
        <button onClick={onClose} className="p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-stone-200 flex flex-col ${activeId && 'hidden md:flex'}`}>
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-900">Conversations</h2>
          <button onClick={onClose} className="hidden md:block text-stone-400 hover:text-stone-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map(convo => (
              <button 
                key={convo.id}
                onClick={() => setActiveId(convo.id)}
                className={`w-full p-4 flex gap-3 text-left border-b border-stone-50 transition-colors ${
                  activeId === convo.id ? 'bg-emerald-50 border-r-4 border-r-emerald-900' : 'hover:bg-stone-50'
                }`}
              >
                <img 
                  src={user.role === 'hunter' ? convo.participants.landownerAvatar : `https://picsum.photos/seed/${convo.participants.hunterId}/100/100`} 
                  className="w-12 h-12 rounded-full object-cover bg-stone-100" 
                  alt="" 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900 truncate">
                    {user.role === 'hunter' ? convo.participants.landownerName : convo.participants.hunterName}
                  </p>
                  <p className="text-xs text-stone-500 truncate mb-1">{convo.listingTitle}</p>
                  <p className="text-xs text-stone-400 truncate">
                    {convo.messages[convo.messages.length - 1]?.text || 'No messages yet'}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-stone-400">No active conversations</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeId && 'hidden md:flex'}`}>
        {activeConvo ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveId(null)} className="md:hidden p-1 text-stone-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h3 className="font-bold text-stone-900 leading-none mb-1">
                    {user.role === 'hunter' ? activeConvo.participants.landownerName : activeConvo.participants.hunterName}
                  </h3>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Regarding: {activeConvo.listingTitle}</p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50">
              {activeConvo.messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
                      isMe 
                        ? 'bg-emerald-900 text-white rounded-tr-none' 
                        : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-2 ${isMe ? 'text-emerald-200' : 'text-stone-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-stone-200 bg-white">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-900 outline-none"
                />
                <button 
                  onClick={handleSend}
                  className="bg-emerald-900 text-white p-3 rounded-xl hover:bg-stone-900 transition-all shadow-md"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-stone-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">Select a conversation to start chatting</p>
            <p className="text-sm">Paid hunters can message any landowner to ask about property details or scheduling.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingCenter;
