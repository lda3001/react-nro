"use client";
import "./appChatbot.css";
import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";

//const BASE_URL = process.env.NEXT_PUBLIC_API_CHATBOT_URL;

interface Message {
  id: number;
  text: string;
  sender: {
    id: number;
    username: string;
    characterName: string | null;
  };
  timestamp: string;
}

interface ReplyOption {
  label: string;
  value: string;
}

export default function AppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [replyPending, setReplyPending] = useState(false);
  const [replyOptions, setReplyOptions] = useState<ReplyOption[]>([]);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const quickReplyRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      // Initialize socket connection
      socketRef.current = io('http://localhost:3000');

      // Join the global chat room
      socketRef.current.emit('join_room', 'global');

      // Listen for incoming messages
      socketRef.current.on('receive_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for errors
      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Error: ${error.message}`,
          sender: {
            id: 0,
            username: 'System',
            characterName: null
          },
          timestamp: new Date().toLocaleTimeString()
        }]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.emit('leave_room', 'global');
          socketRef.current.disconnect();
        }
      };
    }
  }, [isOpen, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // if (isOpen && messages.length === 0) {
    //   setMessages([{
    //     id: Date.now(),
    //     text: "Chào mừng bạn đến với Kênh Thế Giới và Chat Bằng Hội! Tôi có thể giúp gì cho bạn?",
    //     sender: "bot",
    //     timestamp: new Date().toLocaleTimeString(),
    //   }]);
    // }
  }, [isOpen]);

  useEffect(() => {
    // Reset focused option when options change
    setFocusedOptionIndex(0);
    quickReplyRefs.current = quickReplyRefs.current.slice(0, replyOptions.length);

    // Set up auto-reset timer
    if (replyOptions.length > 0) {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = setTimeout(() => {
        setReplyOptions([]);
        setReplyPending(false);
      }, 30000); // 30 seconds
    }

    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [replyOptions]);

  const parseBotResponse = (text: string) => {
    try {
      const jsonResponse = JSON.parse(text);
      return jsonResponse.message || text;
    } catch (e) {
      return text;
    }
  };

  const parseMessageWithPlainLinks = (text: string) => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'link', text: match[0], url: match[0] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts;
  };

  const getEndpoint = () => replyPending ? "/api/ask/reply" : "/api/ask";

  const handleSendMessage = async (quickReplyValue: string | null = null) => {
    const messageToSend = quickReplyValue || inputMessage;
    if (messageToSend.trim() === "" || isLoading || !user || !socketRef.current) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageToSend,
      sender: {
        id: user.id,
        username: user.username,
        characterName: null
      },
      timestamp: new Date().toLocaleTimeString()
    };

    //setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setReplyOptions([]);
    setReplyPending(false);

    try {
      socketRef.current.emit('send_message', {
        roomId: 'global',
        message: messageToSend,
        userId: user.id
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "⚠️ Đã xảy ra lỗi. Vui lòng thử lại.",
        sender: {
          id: 0,
          username: 'System',
          characterName: null
        },
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (value: string) => {
    handleSendMessage(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (replyOptions.length > 0) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedOptionIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : replyOptions.length - 1;
            quickReplyRefs.current[newIndex]?.focus();
            return newIndex;
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedOptionIndex(prev => {
            const newIndex = prev < replyOptions.length - 1 ? prev + 1 : 0;
            quickReplyRefs.current[newIndex]?.focus();
            return newIndex;
          });
          break;
        case 'Tab':
          e.preventDefault();
          setFocusedOptionIndex(prev => {
            const newIndex = prev < replyOptions.length - 1 ? prev + 1 : 0;
            quickReplyRefs.current[newIndex]?.focus();
            return newIndex;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedOptionIndex >= 0 && focusedOptionIndex < replyOptions.length) {
            handleQuickReply(replyOptions[focusedOptionIndex].value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setReplyOptions([]);
          setReplyPending(false);
          break;
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (text: string) => {
    const parts = parseMessageWithPlainLinks(text);
    return parts.map((part, index) => {
      if (part.type === 'link') {
        return (
          <a key={index} href={part.url} target="_blank" rel="noopener noreferrer" className="message-link">
            {part.text}
          </a>
        );
      }
      return <span key={index}>{part.content}</span>;
    });
  };

  const cancelQuickReply = () => {
    setReplyOptions([]);
    setReplyPending(false);
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
  };
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (replyOptions.length === 0) return;
  
      const total = replyOptions.length + 1; // thêm 1 cho nút ✕
  
      let newIndex = focusedOptionIndex;
  
      switch (e.key) {
        case "Tab":
        case "ArrowRight":
          e.preventDefault();
          newIndex = (focusedOptionIndex + 1) % total;
          break;
  
        case "ArrowLeft":
          e.preventDefault();
          newIndex = (focusedOptionIndex - 1 + total) % total;
          break;
  
        case "Enter":
          e.preventDefault();
          if (quickReplyRefs.current[focusedOptionIndex]) {
            quickReplyRefs.current[focusedOptionIndex].click();
          }
          return;
  
        case "Escape":
          e.preventDefault();
          cancelQuickReply();
          return;
      }
  
      setFocusedOptionIndex(newIndex);
      quickReplyRefs.current[newIndex]?.focus();
    };
  
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [replyOptions, focusedOptionIndex]);
  

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <div className="bot-avatar"><span>💬</span></div>
              <div className="header-info">
                <h3>Global Chat</h3>
                <p>Chat with other players</p>
              </div>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message-wrapper ${message.sender.id === user?.id ? 'user' : ''}`}>
                {message.sender.id !== user?.id && (
                  <div className="message-avatar">
                    <span>{message.sender.characterName ? message.sender.characterName[0] : message.sender.username[0]}</span>
                  </div>
                )}
                <div className="message-bubble">
                  <div className="message-sender">{message.sender.characterName || message.sender.username}</div>
                  <div className="message-text">{message.text}</div>
                  <span className="message-timestamp">{message.timestamp}</span>
                </div>
                {message.sender.id === user?.id && (
                  <div className="message-avatar user-avatar">
                    <span>{message.sender.username[0]}</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper">
                <div className="message-avatar"><span>💬</span></div>
                <div className="message-bubble">
                  <div className="typing-indicator"><span></span><span></span><span></span></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {replyOptions.length > 0 && (
            <div className="quick-reply-container">
              {replyOptions.map((opt, i) => (
                <button
                  key={i}
                  className={`quick-reply-button ${i === focusedOptionIndex ? 'focused' : ''}`}
                  onClick={() => handleQuickReply(opt.value)}
                  ref={el => quickReplyRefs.current[i] = el}
                  tabIndex={0}
                >
                  {opt.label}
                </button>
              ))}
              <button
                aria-label="Hủy chọn"
                title="Hủy chọn"
                className={`quick-reply-cancel ${focusedOptionIndex === replyOptions.length ? 'focused' : ''}`}
                onClick={cancelQuickReply}
                ref={(el) => quickReplyRefs.current[replyOptions.length] = el}
              >
                ✕
              </button>
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}