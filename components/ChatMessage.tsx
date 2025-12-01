import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex w-full message-enter ${isBot ? 'justify-start' : 'justify-end'}`}>
      
      {/* Avatar only for Bot (Sofía) */}
      {isBot && (
        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mr-3 mt-auto mb-1 shadow-sm border border-gray-100 bg-white flex items-center justify-center">
            {/* Using a friendly icon instead of robot */}
            <i className="fa-solid fa-headset text-indigo-500 text-xs"></i>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`relative px-5 py-3.5 max-w-[85%] text-[15px] leading-relaxed shadow-sm transition-all ${
          isBot
            ? 'bg-white text-gray-700 rounded-2xl rounded-bl-none border border-gray-100'
            : 'bg-indigo-600 text-white rounded-2xl rounded-br-none shadow-indigo-200'
        }`}
      >
        <div dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }} />
        
        {/* Timestamp simulation (optional visual detail) */}
        <div className={`text-[10px] mt-1 text-right font-medium opacity-60 ${isBot ? 'text-gray-400' : 'text-indigo-100'}`}>
           {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
