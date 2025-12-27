'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Clock, Check, CheckCheck } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your WhatsApp AI Agent. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
      status: 'read'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const simulateAgentResponse = (userMessage: string) => {
    setIsTyping(true)

    setTimeout(() => {
      let response = ''
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = 'Hello! 👋 Nice to meet you! How can I assist you today?'
      } else if (lowerMessage.includes('help')) {
        response = 'I can help you with:\n• Answering questions\n• Providing information\n• Having conversations\n• And much more! What do you need?'
      } else if (lowerMessage.includes('time')) {
        response = `The current time is ${new Date().toLocaleTimeString()}`
      } else if (lowerMessage.includes('date')) {
        response = `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
      } else if (lowerMessage.includes('how are you')) {
        response = 'I\'m doing great! Thanks for asking. 😊 How about you?'
      } else if (lowerMessage.includes('weather')) {
        response = 'I don\'t have real-time weather data, but I recommend checking a weather app or website for accurate information!'
      } else if (lowerMessage.includes('joke')) {
        const jokes = [
          'Why don\'t scientists trust atoms? Because they make up everything!',
          'What do you call a bear with no teeth? A gummy bear!',
          'Why did the scarecrow win an award? He was outstanding in his field!',
          'What do you call a fake noodle? An impasta!'
        ]
        response = jokes[Math.floor(Math.random() * jokes.length)]
      } else if (lowerMessage.includes('thank')) {
        response = 'You\'re welcome! 😊 Is there anything else I can help you with?'
      } else if (lowerMessage.includes('bye')) {
        response = 'Goodbye! Feel free to message me anytime. Have a great day! 👋'
      } else {
        const responses = [
          `I understand you said: "${userMessage}". How can I help you with that?`,
          `That's interesting! Tell me more about "${userMessage}".`,
          `Got it! Regarding "${userMessage}", I'm here to help. What would you like to know?`,
          `Thanks for sharing that! I'm processing your message about "${userMessage}". What specific help do you need?`
        ]
        response = responses[Math.floor(Math.random() * responses.length)]
      }

      const agentMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date(),
        status: 'sent'
      }

      setMessages(prev => prev.map(msg =>
        msg.sender === 'user' && msg.status !== 'read'
          ? { ...msg, status: 'read' }
          : msg
      ))

      setMessages(prev => [...prev, agentMessage])
      setIsTyping(false)

      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === agentMessage.id ? { ...msg, status: 'delivered' } : msg
        ))
      }, 500)

      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === agentMessage.id ? { ...msg, status: 'read' } : msg
        ))
      }, 1000)
    }, 1000 + Math.random() * 1500)
  }

  const handleSend = () => {
    if (inputText.trim() === '') return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ))
    }, 300)

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ))
    }, 600)

    simulateAgentResponse(inputText)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const MessageStatus = ({ status }: { status: Message['status'] }) => {
    if (status === 'sending') return <Clock className="w-3 h-3 text-gray-400" />
    if (status === 'sent') return <Check className="w-4 h-4 text-gray-400" />
    if (status === 'delivered') return <CheckCheck className="w-4 h-4 text-gray-400" />
    return <CheckCheck className="w-4 h-4 text-blue-400" />
  }

  return (
    <div className="flex flex-col h-screen bg-[#ECE5DD]">
      {/* Header */}
      <div className="bg-[#075E54] text-white p-4 flex items-center gap-3 shadow-md">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-[#075E54]" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-lg">AI Agent</h1>
          <p className="text-xs text-green-200">Online</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxwYXRoIGQ9Ik0gMCw1MCBMIDUwLDAgTCAxMDAsNTAgTCA1MCwxMDAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg p-3 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-[#DCF8C6]'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                {message.sender === 'agent' && (
                  <Bot className="w-4 h-4 text-[#075E54] mt-1 flex-shrink-0" />
                )}
                {message.sender === 'user' && (
                  <User className="w-4 h-4 text-[#075E54] mt-1 flex-shrink-0" />
                )}
                <span className="text-xs font-semibold text-[#075E54]">
                  {message.sender === 'agent' ? 'AI Agent' : 'You'}
                </span>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                {message.text}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
                {message.sender === 'user' && <MessageStatus status={message.status} />}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#075E54]" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#F0F0F0] p-3 flex items-end gap-2 shadow-lg">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 resize-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#25D366] max-h-32 min-h-[40px]"
          rows={1}
          style={{
            height: 'auto',
            overflowY: inputText.split('\n').length > 3 ? 'auto' : 'hidden'
          }}
        />
        <button
          onClick={handleSend}
          disabled={inputText.trim() === ''}
          className="bg-[#25D366] text-white rounded-full p-3 hover:bg-[#20BA5A] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
