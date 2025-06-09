import { Send, Sparkles, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

const AIAssistantPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "我是您的AI写作助手。我可以帮助您改进报告，包括建议内容、优化语言或回答有关知识库的问题。您需要什么帮助？",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    setIsTyping(true);
    setTimeout(() => {
      const aiResponses = [
        "我分析了您的报告，发现第三部分可以通过添加更多来自监管合规数据库的数据点来加强。您想要我建议具体的参考资料吗？",
        "查看您当前的内容，我建议扩展市场趋势分析部分。您的知识库中有几份最新的行业报告可以提供有价值的见解。",
        "您的执行摘要可以更有影响力。考虑以监管变化及其财务影响的关键发现作为开头，这样可以更好地突出决策者需要的关键信息。",
        "我发现您的分析中可能缺少关于国际合规要求的内容。您想要我起草一段关于跨境考虑因素的内容吗？"
      ];
      
      const aiMessage: Message = {
        id: messages.length + 2,
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const suggestedPrompts = [
    "改进执行摘要",
    "添加更多监管细节",
    "建议额外参考资料",
    "检查一致性"
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-medium text-gray-900">AI写作助手</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center">
                  {message.sender === 'user' ? (
                    <User className="mr-2 h-4 w-4 text-primary-600" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4 text-indigo-600" />
                  )}
                  <span className="text-xs font-medium">
                    {message.sender === 'user' ? '您' : 'AI助手'}
                  </span>
                </div>
                <p className="mt-1 text-sm">{message.content}</p>
                <p className="mt-1 text-right text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2">
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-medium">AI助手</span>
                </div>
                <div className="mt-2 flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setNewMessage(prompt)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="提出问题或请求帮助..."
            className="form-input flex-1"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isTyping}
            className="btn-primary"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPanel;