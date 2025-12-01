import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { TypingIndicator } from './components/TypingIndicator';
import { ActionPanel } from './components/ActionPanel';
import { Message, TriageData } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [triageData, setTriageData] = useState<TriageData | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat
  useEffect(() => {
    initializeChat();
    setTimeout(() => {
      setMessages([
        {
          id: uuidv4(),
          text: "¡Hola! Soy Sofía de VetHome 🌿. Lamento si tu peludito no se siente bien. Contame, ¿cómo te llamás así veo cómo ayudarte?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }, 600);
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior
      });
    }
  };

  // Scroll logic updates
  useEffect(() => {
    scrollToBottom();
    // Delay to allow layout recalculation (especially when ActionPanel appears)
    const timeoutId = setTimeout(() => scrollToBottom(), 150);
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping, triageData]);

  // Viewport resize handler for mobile keyboard
  useEffect(() => {
    const handleResize = () => {
      // Force immediate scroll to bottom when viewport changes (keyboard opens/closes)
      scrollToBottom('auto');
      
      // Ensure input stays in view
      if (document.activeElement === inputRef.current) {
        setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim() || isTyping || triageData) return;

    const userMsg: Message = {
      id: uuidv4(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => scrollToBottom('smooth'), 50);

    try {
      const { visibleMessage, triageData: resultData } = await sendMessageToGemini(userMsg.text);
      
      if (visibleMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            text: visibleMessage,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }

      if (resultData) {
        setTriageData(resultData);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: "Uy, se me cortó un poquito la conexión. ¿Me lo podrías repetir, por favor?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-center h-full bg-[#f0f2f5] font-sans">
      {/* 
        Flex Column Layout:
        - Header (Fixed height)
        - Chat (Flex-1, takes remaining space, shrinks when footer grows)
        - Footer (Content based height)
      */}
      <div className="w-full h-full md:max-w-md md:h-[90vh] bg-white md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative border border-gray-100 ring-1 ring-black/5">
        
        {/* Header - Flex Shrink 0 */}
        <div className="shrink-0 w-full z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md shadow-indigo-200 text-white">
               <i className="fa-solid fa-paw text-lg"></i>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-tight tracking-tight">VetHome</h1>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Sofía está en línea
              </p>
            </div>
          </div>
          <button 
            onClick={handleRestart} 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300" 
            title="Reiniciar conversación"
          >
            <i className="fa-solid fa-rotate-right text-sm"></i>
          </button>
        </div>

        {/* Chat Area - Flex 1 (Grows/Shrinks) */}
        <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-hide overscroll-contain"
        >
          <div className="space-y-6">
            <div className="text-center text-xs text-gray-400 font-medium my-4">Hoy</div>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </div>

        {/* Footer Area - Flex Shrink 0 (Auto height) */}
        <div className="shrink-0 w-full z-20 bg-white border-t border-gray-100 relative">
          {/* Gradient shadow for depth effect pointing up */}
          <div className="absolute bottom-full left-0 w-full h-6 bg-gradient-to-t from-black/5 to-transparent pointer-events-none opacity-40"></div>
          
          <div className="p-4 pb-6 md:pb-4">
            {!triageData ? (
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setTimeout(() => scrollToBottom('smooth'), 300)}
                  disabled={isTyping}
                  className="w-full bg-gray-100 text-gray-700 border-0 rounded-2xl pl-5 pr-14 py-4 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none placeholder-gray-400 text-[16px] shadow-inner"
                  placeholder="Escribe un mensaje..."
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white w-10 h-10 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center justify-center disabled:opacity-0 disabled:scale-75 transform duration-200"
                >
                  <i className="fa-solid fa-arrow-up text-sm"></i>
                </button>
              </form>
            ) : (
              <ActionPanel data={triageData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;