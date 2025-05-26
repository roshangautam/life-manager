import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function LangGraphChat() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Temporary mock response until API is ready
    setMessages([...messages, {role: 'user', content: input}]);
    setMessages(prev => [...prev, {role: 'assistant', content: 'I\'m your LangGraph assistant. The API integration will be added soon!'}]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.role === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-l-lg border border-gray-300 dark:border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            placeholder="Ask your assistant..."
          />
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
