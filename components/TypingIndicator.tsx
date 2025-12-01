import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full justify-start message-enter items-end mb-4">
      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center shrink-0 mr-2 mb-1">
        <i className="fa-solid fa-robot text-xs"></i>
      </div>
      <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center h-10">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
      </div>
    </div>
  );
};
