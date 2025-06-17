"use client";
import "./appChatbot.css";
import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Marquee from "react-fast-marquee";
import AudioMessagePlayer from "./AudioMessagePlayer";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
//const BASE_URL = process.env.NEXT_PUBLIC_API_CHATBOT_URL;

interface Message {
  id: number;
  text: string;
  sender: {
    id: number;
    username: string;
    characterName: string | null;
    Hair: number | null;
  };
  timestamp: string;
  audioBuffer?: BlobPart;
  mimeType?: string;
}

type ChatRoom = 'global' | 'clan';

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
  const [currentRoom, setCurrentRoom] = useState<string>('global');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const quickReplyRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [clanInfo, setClanInfo] = useState<any>(null);
  const { user } = useAuth();
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Add mouse event handlers for scroll locking
  useEffect(() => {
    const handleMouseEnter = () => {
      document.body.style.overflow = 'hidden';
    };

    const handleMouseLeave = () => {
      document.body.style.overflow = 'auto';
    };

    const chatWindow = chatWindowRef.current;
    if (chatWindow) {
      chatWindow.addEventListener('mouseenter', handleMouseEnter);
      chatWindow.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (chatWindow) {
        chatWindow.removeEventListener('mouseenter', handleMouseEnter);
        chatWindow.removeEventListener('mouseleave', handleMouseLeave);
      }
      // Reset body overflow when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      
      
      // Initialize socket connection
      socketRef.current = io('http://localhost:3000');
    

      // Join the selected chat room
      socketRef.current.emit('join_room', currentRoom);

      // Listen for incoming messages
      socketRef.current.on('receive_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for chat history
      socketRef.current.on('chat_history', (history: Message[]) => {
        setMessages(history);
      });

      // Listen for clan info
      socketRef.current.on('clan_info', (info: any) => {
        setClanInfo(info);
      });

      // Listen for errors
      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error);
        toast.error(error.message || 'Có lỗi xảy ra');
      });

      socketRef.current.on('notification', (message: any) => {
        
        setNotification(message);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.emit('leave_room', currentRoom);
          socketRef.current.disconnect();
        }
      };
    }
  }, [isOpen, user, currentRoom]);

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

  // Add audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
  
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
  
        // Convert blob to array buffer
        const arrayBuffer = await audioBlob.arrayBuffer();
  
        // Send audio buffer via WebSocket
        if (socketRef.current) {
          socketRef.current.emit('send_message', {
            roomId: currentRoom,
            message: '',
            audioBuffer: arrayBuffer,
            mimeType: audioBlob.type,
            token: localStorage.getItem('token')
          });
        }
      };
  
      mediaRecorder.start();
      setIsRecording(true);
      isRecordingRef.current = true;

      // Auto stop after 8 seconds
      setTimeout(() => {
        if (isRecordingRef.current && mediaRecorderRef.current) {
          mediaRecorder.stop();
          setIsRecording(false);
          isRecordingRef.current = false;
          toast.info('Đã đạt giới hạn ghi âm 8 giây');
        }
      }, 9000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Không thể truy cập microphone');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      isRecordingRef.current = false;
  
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Modify handleSendMessage to handle audio messages
  const handleSendMessage = async (quickReplyValue: string | null = null) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }
    const messageToSend = quickReplyValue || inputMessage;
    if ((messageToSend.trim() === "" && !audioBlob) || isLoading || !user || !socketRef.current) return;

    setInputMessage("");
    setIsLoading(true);
    setReplyOptions([]);
    setReplyPending(false);

    try {
      socketRef.current.emit('send_message', {
        roomId: currentRoom,
        message: messageToSend,
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
        token: localStorage.getItem('token')
      });
      setAudioBlob(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "⚠️ Đã xảy ra lỗi. Vui lòng thử lại.",
        sender: {
          id: 0,
          username: 'System',
          characterName: null,
          Hair: null
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

  // Modify message rendering to include audio
  const renderMessageContent = (message: Message ) => {
    const parts = parseMessageWithPlainLinks(message.text);
    return (
      <>
        {parts.map((part, index) => {
          if (part.type === 'link') {
            return (
              <a key={index} href={part.url} target="_blank" rel="noopener noreferrer" className="message-link">
                {part.text}
              </a>
            );
          }
          return <span key={index}>{part.content}</span>;
        })}
       {message.mimeType && !message.text && (
            <AudioMessagePlayer audioUrl={URL.createObjectURL(new Blob([message.audioBuffer || ''], { type: message.mimeType || 'audio/webm' }))} />
       )}
        
      </>
    );
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
  

  // Add function to switch chat rooms
  const switchChatRoom = (room: string) => {
    if (room === 'clan' && !user?.character?.clanId) {
      toast.error("Bạn không có clan");
      return;
    }

    let roomId = room;
    if(room === 'clan'){
      roomId = user?.character?.clanId?.toString() || '-1';
    }
    
    if (socketRef.current) {
      socketRef.current.emit('leave_room', currentRoom);
      setMessages([]);
      setCurrentRoom(roomId);
      socketRef.current.emit('join_room', roomId);
     
      
      
      // Reset clan info when switching rooms
      if(roomId === 'global') {
        setClanInfo(null);
      }
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => {
        
        setIsOpen(!isOpen)}}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-window" ref={chatWindowRef}>
          <div className="chatbot-header">
            <div className="header-content">
              <div className="bot-avatar"><span>💬</span></div>
              <div className="header-info">
                <h3>{currentRoom === 'global' ? 'Global Chat' : `${clanInfo?.name || 'Clan Chat'}`}</h3>
                <p>{currentRoom === 'global' ? 'Chat with other players' : ` ${clanInfo?.slogan || 'Chat with your clan'}`}</p>
              </div>
            </div>
            <div className="chat-room-selector z-50">
              <button 
                className={`room-button ${currentRoom === 'global' ? 'active' : ''}`}
                onClick={() => switchChatRoom('global')}
              >
                Global
              </button>
              <button 
                className={`room-button ${currentRoom === user?.character?.clanId?.toString()   ? 'active' : ''}`}
                onClick={() => switchChatRoom('clan')}
              >
                Clan
              </button>
            </div>
          </div>
          
          <Marquee className="text-red-600 font-bold" pauseOnHover={true}>
          
          {notification && new Date().getTime() - notification.time < 300000 && (
            <>
              Thông Báo Admin:       {notification.message}
            </>
          )}

          </Marquee>
        
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message-wrapper ${message.sender.id === user?.id ? 'user' : ''}`}>
                {message.sender.id !== user?.id && (
                  <div className="message-avatar">
                    <img src={`/images/avatar/${message.sender.Hair ? message.sender.Hair : '454'}.png`} alt="" />
                    
                  </div>
                )}
                <div className="message-bubble">
                  <div className="message-sender">{message.sender.characterName || message.sender.username}</div>
                  <div className="message-text">{renderMessageContent(message)}</div>
                  <span className="message-timestamp">{message.timestamp}</span>
                </div>
                {message.sender.id === user?.id && (
                  <div className="message-avatar user-avatar">
                    <img src={`/images/avatar/${message.sender.Hair ? message.sender.Hair : '454'}.png`} alt="" />
                    
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
              className="emoji-button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Add Emoji"
            >
              😊
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <button
              className={`mic-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              🎤
            </button>
            <button
              className="send-button"
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!inputMessage.trim() && !audioBlob)}
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