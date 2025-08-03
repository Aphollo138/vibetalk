import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx';
import { Send, MessageCircle, LogOut, Smile, Mic, Volume2, Menu, X } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export default function ChatScreen({ user, onLogout }) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [globalMessages, setGlobalMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [unreadNotifications, setUnreadNotifications] = useState({});
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChat, setActiveChat] = useState('global'); // 'global' ou user_id para chat privado
  const [userId] = useState(uuidv4());
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

useEffect(() => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://vibetalk-server.onrender.com';
  const newSocket = io(socketUrl);
  setSocket(newSocket);

    // Registrar usuário
    newSocket.emit('user_join', {
      user_id: userId,
      username: user.username,
      avatar: user.avatar
    });

    // Listeners para eventos do socket
    newSocket.on("online_users_update", (users) => {
      setOnlineUsers(users.filter(u => u.user_id !== userId));
    });

    newSocket.on("global_messages_history", (messages) => {
      setGlobalMessages(messages);
    });

    newSocket.on("global_message", (message) => {
      setGlobalMessages(prev => [...prev, message]);
    });

    newSocket.on("private_message", (message) => {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      setPrivateMessages(prev => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), message]
      }));
      // Se a mensagem não for do usuário atual e o chat privado não estiver ativo com o remetente
      if (message.sender_id !== userId && activeChat !== message.sender_id) {
        setUnreadNotifications(prev => ({
          ...prev,
          [message.sender_id]: (prev[message.sender_id] || 0) + 1
        }));
      }
    });

    newSocket.on("private_messages_history", (data) => {
      const { messages } = data;
      if (messages.length > 0) {
        const otherUserId = messages[0].sender_id === userId ? messages[0].receiver_id : messages[0].sender_id;
        setPrivateMessages(prev => ({
          ...prev,
          [otherUserId]: messages
        }));
      }
    });

    newSocket.on("unread_notifications", (notifications) => {
      setUnreadNotifications(notifications);
    });

    newSocket.on("private_notification", (data) => {
      setUnreadNotifications(prev => ({
        ...prev,
        [data.sender_id]: data.count
      }));
    });

    newSocket.on("private_notification_cleared", (data) => {
      setUnreadNotifications(prev => {
        const newNotifications = { ...prev };
        delete newNotifications[data.sender_id];
        return newNotifications;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [globalMessages, privateMessages, activeChat]);

  const sendMessage = () => {
    if (!currentMessage.trim() || !socket) return;

    if (activeChat === 'global') {
      socket.emit('global_message', {
        user_id: userId,
        username: user.username,
        avatar: user.avatar,
        message: currentMessage.trim()
      });
    } else {
      socket.emit('private_message', {
        sender_id: userId,
        receiver_id: activeChat,
        sender_username: user.username,
        sender_avatar: user.avatar,
        message: currentMessage.trim()
      });
    }

    setCurrentMessage('');
  };

  const startPrivateChat = (targetUser) => {
    setActiveChat(targetUser.user_id);
    
    // Solicitar histórico de mensagens privadas
    if (socket) {
      socket.emit("get_private_messages", {
        user1_id: userId,
        user2_id: targetUser.user_id
      });
      // Marcar mensagens como lidas
      socket.emit("mark_private_messages_read", {
        user_id: userId,
        sender_id: targetUser.user_id
      });
    }
  };

  const getCurrentMessages = () => {
    if (activeChat === 'global') {
      return globalMessages;
    }
    return privateMessages[activeChat] || [];
  };

  const getCurrentChatTitle = () => {
    if (activeChat === 'global') {
      return 'Chat Global';
    }
    const targetUser = onlineUsers.find(u => u.user_id === activeChat);
    return targetUser ? `Chat com ${targetUser.username}` : 'Chat Privado';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setCurrentMessage(prev => prev + emoji);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result;
          // Enviar mensagem de áudio
          if (activeChat === 'global') {
            socket.emit('global_message', {
              user_id: userId,
              username: user.username,
              avatar: user.avatar,
              message: '[Mensagem de áudio]',
              type: 'audio',
              audio_data: base64data
            });
          } else {
            socket.emit('private_message', {
              sender_id: userId,
              receiver_id: activeChat,
              sender_username: user.username,
              sender_avatar: user.avatar,
              message: '[Mensagem de áudio]',
              type: 'audio',
              audio_data: base64data
            });
          }
        };

        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 relative">
      {/* Overlay para mobile quando sidebar está aberto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar com usuários online */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative z-50 lg:z-auto
        w-80 h-full bg-gray-800 border-r border-gray-700 flex flex-col
        transition-transform duration-300 ease-in-out
      `}>
        {/* Header do sidebar */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">VibeTalk</h2>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsSidebarOpen(false)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Usuário atual */}
          <div className="flex items-center space-x-3 p-2 bg-gray-700 rounded-lg">
            <img 
              src={user.avatar} 
              alt="Seu avatar" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-medium">{user.username}</p>
              <p className="text-green-400 text-sm">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Global */}
        <div className="p-4 border-b border-gray-700">
          <Button
            onClick={() => {
              setActiveChat('global');
              setIsSidebarOpen(false);
            }}
            variant={activeChat === 'global' ? 'default' : 'ghost'}
            className="w-full justify-start text-left"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat Global
          </Button>
        </div>

        {/* Lista de usuários online */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-gray-400 text-sm font-medium mb-3">
              Usuários Online ({onlineUsers.length})
            </h3>
            <div className="space-y-2">
              {onlineUsers.map((onlineUser) => (
                <div
                  key={onlineUser.user_id}
                  className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={onlineUser.avatar} 
                      alt={onlineUser.username} 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white text-sm">{onlineUser.username}</span>
                    {unreadNotifications[onlineUser.user_id] > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadNotifications[onlineUser.user_id]}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      startPrivateChat(onlineUser);
                      setIsSidebarOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header do chat */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <h3 className="text-white font-semibold">{getCurrentChatTitle()}</h3>
            </div>
            {activeChat !== 'global' && (
              <Button
                onClick={() => setActiveChat('global')}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Voltar ao Global
              </Button>
            )}
          </div>
        </div>

        {/* Área de mensagens com background do WhatsApp */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#0f172a'
          }}
        >
          {getCurrentMessages().map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.user_id === userId || message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.user_id === userId || message.sender_id === userId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {(message.user_id !== userId && message.sender_id !== userId) && (
                  <div className="flex items-center space-x-2 mb-1">
                    <img 
                      src={message.avatar || message.sender_avatar} 
                      alt="Avatar" 
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs font-medium text-gray-300">
                      {message.username || message.sender_username}
                    </span>
                  </div>
                )}
                {message.type === 'audio' ? (
                  <audio controls src={message.audio_data} className="w-full"></audio>
                ) : (
                  <p className="text-sm">{message.message}</p>
                )}
                <p className="text-xs text-gray-300 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Área de input */}
        <div className="bg-gray-800 border-t border-gray-700 p-4 relative">
          <EmojiPicker 
            isOpen={isEmojiPickerOpen}
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setIsEmojiPickerOpen(false)}
          />
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            >
              <Smile className="w-5 h-5" />
            </Button>
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${isRecording ? 'text-red-500 bg-red-900/20' : 'text-gray-400 hover:text-white'}`}
              onClick={toggleRecording}
            >
              {isRecording ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button 
              onClick={sendMessage}
              disabled={!currentMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {isRecording && (
            <div className="mt-2 text-center">
              <span className="text-red-400 text-sm animate-pulse">🔴 Gravando áudio...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

