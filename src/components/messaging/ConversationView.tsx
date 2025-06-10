import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Paperclip, Smile } from 'lucide-react';
import Spinner from '../ui/Spinner';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  isEdited?: boolean;
  replyToId?: string;
}

interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface Property {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
}

interface Conversation {
  id: string;
  conversationType: 'direct' | 'group' | 'support';
  title?: string;
  property?: Property;
  participants: Array<{
    user: User;
    role: 'landlord' | 'renter' | 'agent';
    businessName?: string;
  }>;
}

interface ConversationViewProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onLoadMoreMessages?: () => void;
  isLoading?: boolean;
}

export default function ConversationView({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onLoadMoreMessages,
  isLoading = false
}: ConversationViewProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getConversationTitle = () => {
    if (conversation.title) return conversation.title;
    
    const otherParticipant = conversation.participants.find(p => p.user.id !== currentUserId);
    return otherParticipant 
      ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}`
      : 'Unknown';
  };

  const getConversationSubtitle = () => {
    const otherParticipant = conversation.participants.find(p => p.user.id !== currentUserId);
    const role = otherParticipant?.role;
    const businessName = otherParticipant?.businessName;
    
    let subtitle = '';
    switch (role) {
      case 'landlord':
        subtitle = businessName || 'Property Manager';
        break;
      case 'agent':
        subtitle = 'Leasing Agent';
        break;
      case 'renter':
        subtitle = 'Renter';
        break;
      default:
        subtitle = 'User';
    }

    return subtitle;
  };

  const getPropertyAddress = () => {
    if (!conversation.property) return '';
    
    return conversation.property.addressLine2 
      ? `${conversation.property.addressLine1}, ${conversation.property.addressLine2}`
      : conversation.property.addressLine1;
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const title = getConversationTitle();
  const subtitle = getConversationSubtitle();
  const propertyAddress = getPropertyAddress();

  return (
    <div className="flex flex-col h-screen bg-white relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 z-10">
        <div className="relative flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mr-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {getInitials(title)}
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-blue-600">{subtitle}</p>
          {propertyAddress && (
            <p className="text-sm text-gray-500">{propertyAddress}</p>
          )}
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && (
          <div className="text-center py-4">
            <Spinner size="md" />
          </div>
        )}
        
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId === currentUserId;
          const sender = conversation.participants.find(p => p.user.id === message.senderId);

          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];

          // Check for exact timestamp matches or close time grouping
          const hasSameTimestamp = prevMessage && prevMessage.createdAt === message.createdAt;
          const isTimeGrouped = 
            prevMessage &&
            prevMessage.senderId === message.senderId &&
            new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() < 5 * 60 * 1000;
          
          const isGrouped = hasSameTimestamp || isTimeGrouped;
          
          const showTimestamp = 
            !nextMessage || 
            nextMessage.senderId !== message.senderId ||
            (nextMessage.createdAt !== message.createdAt && new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime() > 5 * 60 * 1000);

          return (
            <div
              key={message.id}
              className={`flex items-end ${isOwnMessage ? 'justify-end' : 'justify-start'} ${
                isGrouped ? (hasSameTimestamp ? 'mt-1' : '') : 'mt-4'
              }`}
            >
              {!isOwnMessage && (
                <div className="w-8 h-8 rounded-full mr-2 flex-shrink-0">
                  {!isGrouped && sender && (
                    <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                       {sender ? getInitials(`${sender.user.firstName} ${sender.user.lastName}`) : '?'}
                    </div>
                  )}
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                {!isOwnMessage && !isGrouped && (
                  <span className="text-xs text-gray-500 mb-1 ml-2">
                    {sender ? `${sender.user.firstName} ${sender.user.lastName}` : 'Unknown'}
                  </span>
                )}
                
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white rounded-br-lg'
                      : 'bg-gray-100 text-gray-900 rounded-bl-lg'
                  } ${isGrouped ? (isOwnMessage ? 'rounded-tr-lg' : 'rounded-tl-lg') : ''}`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.isEdited && (
                    <span className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'} italic`}>
                      (edited)
                    </span>
                  )}
                </div>
                
                {showTimestamp && (
                  <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {formatMessageTime(message.createdAt)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
              rows={1}
              style={{
                minHeight: '44px',
                height: 'auto'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 