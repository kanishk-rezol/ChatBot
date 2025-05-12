import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<{ role: 'user' | 'assistant'; content: string }[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [chat, darkMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    const newChat = [...chat, userMessage];
    setChat(newChat);
    setInput('');
    localStorage.setItem('chatHistory', JSON.stringify(newChat));

    try {
      const updatedChat = [...newChat];
      const response = await axios.post('http://localhost:8000/chat', {
        chatHistory: updatedChat,
      });

      const botMessage = {
        role: 'assistant' as const,
        content: response.data.reply || 'No response from bot',
      };
      const finalchat = [...newChat, botMessage];
      setChat(finalchat);
      localStorage.setItem('chatHistory', JSON.stringify(finalchat));
    } catch (error) {
      const errorMsg = { role: 'assistant' as const, content: 'Error contacting the bot.' };
      const finalchat = [...newChat, errorMsg];
      setChat(finalchat);
      localStorage.setItem('chatHistory', JSON.stringify(finalchat));
    }
  };

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-[#212121]' : 'bg-white'} text-white flex flex-col items-center p-6 overflow-auto`}
    >
      <div className={`bg-black h-full w-full left-0 max-w-56 top-0 ${darkMode ? `rounded-xl`:`rounded-none`} fixed`}></div>
      <h2
        className={`fixed text-2xl ${darkMode ? 'text-white' : 'text-white'} bg-transparent max-w-full w-full ml-10 font-bold mb-4 top-4`}
      >
        Chatbot
      </h2>

      <div
        ref={chatContainerRef} 
        className={`w-full max-w-4xl flex flex-col space-y-2 ${darkMode ? 'bg-transparent' : 'bg-white'} ml-64 overflow-y-auto mt-10 p-4 rounded-lg h-[80vh]`}
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE/Edge */
        }}
      >
        {chat.map((line, idx) => (
          <div
            key={idx}
            className={`p-2 rounded text-sm max-w-[70%] ${
              line.role === 'user'
                ? `${darkMode ? 'bg-[#303030]' : 'bg-[#f0f0f0]'} shadow-sm rounded-xl self-end text-right`
                : `${darkMode ? 'bg-transparent' : 'bg-gray-200'} self-start text-left`
            } ${darkMode ? 'text-white' : 'text-black'}`}
          >
            {line.content}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg fixed bottom-4 flex gap-2 px-4 ml-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className={`flex-1 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-200'} text-white border border-gray-700 focus:outline-none`}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className={`bg-[#303030] hover:bg-[#484848] px-4 py-2 rounded-full text-white font-medium`}
        >
          Send
        </button>
      </div>

      {/* Sliding Dark/Light Mode Button with Sun and Moon */}
      <div className="absolute top-4 right-4 flex items-center cursor-pointer select-none" onClick={toggleTheme}>
        <div
          className={`relative flex items-center justify-between w-14 h-7 rounded-full p-1 transition-all duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full transition-all duration-300 transform ${
              darkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            <span className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xl ${darkMode ? 'hidden' : ''}`}>
              🌞
            </span>
            <span className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xl ${darkMode ? '' : 'hidden'}`}>
              🌙
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
