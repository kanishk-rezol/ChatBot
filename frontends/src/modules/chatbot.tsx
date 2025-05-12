import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<{ role: 'user' | 'assistant'; content: string }[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    const newChat = [...chat, userMessage];
    setChat(newChat);
    setInput('');
    localStorage.setItem('chatHistory', JSON.stringify(newChat));

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: input,
      });

      const botMessage = {
        role: 'assistant' as const,
        content: response.data.reply || 'No response from bot',
      };
      const updatedChat = [...newChat, botMessage];
      setChat(updatedChat);
      localStorage.setItem('chatHistory', JSON.stringify(updatedChat));
    } catch (error) {
      const errorMsg = { role: 'assistant' as const, content: 'Error contacting the bot.' };
      const updatedChat = [...newChat, errorMsg];
      setChat(updatedChat);
      localStorage.setItem('chatHistory', JSON.stringify(updatedChat));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-900 via-black to-black text-white flex flex-col items-center p-6">
      <h2 className="fixed text-2xl bg-transparent max-w-full w-full ml-10 font-bold mb-4 top-4">Chatbot</h2>

      <div className="w-full max-w-3xl flex flex-col space-y-2 bg-transparent mt-20 p-4 rounded-lg overflow-y-auto h-[70vh]">
        {chat.map((line, idx) => (
          <div
            key={idx}
            className={`p-2 rounded text-sm max-w-[70%] ${
              line.role === 'user'
                ? 'bg-blue-600 self-end text-right'
                : 'bg-gray-700 self-start text-left'
            }`}
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
          className="flex-1 px-4 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
