'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { pusherClient } from '@/src/lib/pusher';
import ConversationList from '@/src/components/messaging/ConversationList';
import ConversationView from '@/src/components/messaging/ConversationView';
import CreateConversationModal from '@/src/components/messaging/CreateConversationModal';

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
      conv.id === selectedConversationId ? { ...conv, lastMessage: optimisticMessage } : conv
    ));

    try {
      await fetch('/api/messaging/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          content: content,
          clientId: clientId, // Send the clientId to the backend
        }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
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
      // Call the actual API endpoint to create the conversation
      const response = await fetch('/api/messaging/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participant_ids: data.participantIds,
          property_id: data.propertyId,
          conversation_type: data.conversationType,
          title: data.title,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Instead of just reloading, we can get the new conversation from the response
      const newConversation = await response.json();

      // For a truly real-time feel, you wouldn't even need the next line,
      // as Pusher would handle it. But for now, this adds it to the list.
      await loadConversations();
      
      // Close the modal and select the new conversation
      setIsCreateModalOpen(false);
      setSelectedConversationId(newConversation.conversation.id);

    } catch (error) {
      console.error('Error creating conversation:', error);
      // You could add user-facing error handling here, e.g., a toast notification
    }
  };

  const handleSearchUsers = async (query: string) => {
    try {
      // Mock API call - replace with actual implementation
      const mockUsers = [
        { id: '1', username: 'sarah_landlord', firstName: 'Sarah', lastName: 'Johnson', role: 'landlord' as const, businessName: 'Johnson Properties' },
        { id: '2', username: 'mike_owner', firstName: 'Mike', lastName: 'Chen', role: 'landlord' as const, businessName: 'Chen Properties' },
        { id: '3', username: 'emma_agent', firstName: 'Emma', lastName: 'Davis', role: 'agent' as const },
        { id: '4', username: 'john_renter', firstName: 'John', lastName: 'Smith', role: 'renter' as const }
      ];
      
      return mockUsers.filter(user => 
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const handleSearchProperties = async (query: string) => {
    try {
      // Mock API call - replace with actual implementation
      const mockProperties = [
        { id: '1', addressLine1: '123 Main St', addressLine2: 'Apt 4B', city: 'San Francisco', state: 'CA', zipCode: '94102' },
        { id: '2', addressLine1: '456 Oak Ave', addressLine2: 'Unit 2', city: 'Oakland', state: 'CA', zipCode: '94601' },
        { id: '3', addressLine1: '789 Pine St', addressLine2: 'Studio', city: 'Berkeley', state: 'CA', zipCode: '94704' }
      ];
      
      return mockProperties.filter(property => 
        property.addressLine1.toLowerCase().includes(query.toLowerCase()) ||
        property.city.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching properties:', error);
      return [];
    }
  };

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
  
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const participant = conv.participants.find(p => p.user.id !== currentUserId);
    const participantName = participant ? `${participant.user.firstName} ${participant.user.lastName}` : '';
    const propertyAddress = conv.property?.addressLine1 || '';
    
    return (
      participantName.toLowerCase().includes(searchLower) ||
      propertyAddress.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Conversation List */}
      <ConversationList
        conversations={filteredConversations}
        selectedConversationId={selectedConversationId}
        currentUserId={currentUserId!}
        onSelectConversation={setSelectedConversationId}
        onCreateConversation={() => setIsCreateModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Conversation View */}
      <div className="flex-1">
        {selectedConversation && currentUserId ? (
          <ConversationView
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            isLoading={isMessagesLoading}
          />
        ) : conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center max-w-md px-4">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-500 mb-6">
                Start your first conversation by reaching out to landlords, renters, or agents. 
                Click the + button to get texting!
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start a conversation
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
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