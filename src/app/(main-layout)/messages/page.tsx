'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/src/lib/pusher';
import ConversationList from '@/src/components/messaging/ConversationList';
import ConversationView from '@/src/components/messaging/ConversationView';
import CreateConversationModal from '@/src/components/messaging/CreateConversationModal';
import { ListItemSkeleton } from '@/src/components/ui/LoadingSkeleton';
import { Button } from '@/src/components/ui/button';
import Spinner from '@/src/components/ui/Spinner';

// Mock data types - replace with your actual types
interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  isEdited?: boolean;
  replyToId?: string;
  sender?: User; // Optional sender info for real-time messages
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface Property {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
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
  lastMessage?: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Memoized lookup of the currently selected conversation so we can pass the full
  // object down to the ConversationView component (needed for header info etc.)
  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : undefined;

  // --- 1. Authentication and Initial Load ---
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/user'); 
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.id);
        } else {
          router.push('/sign-in');
        }
      } catch (error) {
        console.error('Error fetching user', error);
        router.push('/sign-in');
      }
    };
    getCurrentUser();
  }, [router]);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/messaging/conversation');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const conversationsData = await response.json();
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadConversations();
    }
  }, [currentUserId, loadConversations]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsMessagesLoading(true);
    try {
      const response = await fetch(`/api/messaging/message?conversationId=${conversationId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const messagesData = await response.json();
      setMessages(messagesData.reverse());
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [selectedConversationId, loadMessages]);


  // --- 2. Real-time Subscriptions ---

  // Effect for handling real-time updates to the conversation list
  useEffect(() => {
    if (!currentUserId) return;

    const userChannel = pusherClient.subscribe(`private-user-${currentUserId}`);

    const handleConversationUpdate = (data: { conversationId: string; lastMessage: Message }) => {
      setConversations(prev => {
        const conversationExists = prev.some(c => c.id === data.conversationId);
        if (!conversationExists) return prev; // Or fetch the new conversation info

        return prev.map(c => 
          c.id === data.conversationId 
            ? { ...c, lastMessage: data.lastMessage }
            : c
        ).sort((a, b) => new Date(b.lastMessage!.createdAt).getTime() - new Date(a.lastMessage!.createdAt).getTime());
      });
    };

    userChannel.bind('conversation-update', handleConversationUpdate);

    return () => {
      userChannel.unbind('conversation-update', handleConversationUpdate);
      pusherClient.unsubscribe(`private-user-${currentUserId}`);
    };
  }, [currentUserId]);

  // Effect for handling new messages in the currently selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    const conversationChannel = pusherClient.subscribe(`private-conversation-${selectedConversationId}`);
    
    const handleNewMessage = (payload: Message & { clientId?: string }) => {
      setMessages(prev => {
        // If a clientId is present in the payload, find the optimistic message and replace it
        if (payload.clientId && prev.some(msg => msg.id === payload.clientId)) {
          return prev.map(msg => msg.id === payload.clientId ? payload : msg);
        }
        
        // If it's a message from another user (no clientId) or we can't find the optimistic one, just add it
        if (!prev.some(msg => msg.id === payload.id)) {
          return [...prev, payload];
        }

        return prev;
      });
    };

    conversationChannel.bind('new-message', handleNewMessage);
    
    return () => {
      conversationChannel.unbind('new-message', handleNewMessage);
      pusherClient.unsubscribe(`private-conversation-${selectedConversationId}`);
    };
  }, [selectedConversationId]);


  // --- 3. User Actions ---
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !currentUserId) return;

    const clientId = crypto.randomUUID();
    const optimisticMessage: Message = {
      id: clientId, // Use the client-generated ID for the optimistic message
      content,
      createdAt: new Date().toISOString(),
      senderId: currentUserId,
      messageType: 'text',
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversationId
        ? { ...conv, lastMessage: optimisticMessage }
        : conv
    ));

    try {
      const response = await fetch('/api/messaging/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          content,
          messageType: 'text',
          clientId, // Send the client ID to the server
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== clientId));
    }
  };

  const handleCreateConversation = async (data: {
    participantIds: string[];
    propertyId?: string;
    conversationType: 'direct' | 'group';
    title?: string;
  }) => {
    try {
      const response = await fetch('/api/messaging/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const newConversation = await response.json();
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversationId(newConversation.id);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSearchUsers = async (query: string) => {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search users');
      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const handleSearchProperties = async (query: string) => {
    try {
      const response = await fetch(`/api/properties/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search properties');
      return await response.json();
    } catch (error) {
      console.error('Error searching properties:', error);
      return [];
    }
  };

  // Loading state for initial authentication check
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner size={40} />
          <p className="text-gray-600">Loading your messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex h-screen">
      <div className="flex h-screen w-full">
        {/* Sidebar - Conversation List */}
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <Button
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-gradient"
              >
                New Chat
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary text-sm"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ListItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                currentUserId={currentUserId!}
                onSelectConversation={setSelectedConversationId}
                onCreateConversation={() => setIsCreateModalOpen(true)}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>

        {/* Main Content - Conversation View */}
        <div className="flex-1 flex flex-col w-full">
          {selectedConversationId && selectedConversation ? (
            <ConversationView
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={currentUserId}
              isLoading={isMessagesLoading}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Conversation Modal */}
      <CreateConversationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateConversation={handleCreateConversation}
        onSearchUsers={handleSearchUsers}
        onSearchProperties={handleSearchProperties}
        currentUserId={currentUserId!}
      />
    </div>
  );
} 