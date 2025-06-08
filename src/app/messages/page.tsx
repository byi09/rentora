'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // This endpoint needs to exist to get the currently logged-in user
        const response = await fetch('/api/auth/user'); 
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.id);
        } else {
          router.push('/sign-in');
          console.log('Not logged in'); // Redirect if not logged in
        }
      } catch (error) {
        console.error('Error fetching user', error);
        router.push('/sign-in');
        console.log('error fetching user');
      }
    };
    getCurrentUser();
  }, [router]);

  useEffect(() => {
    if (currentUserId) {
      loadConversations();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Real API call to get user's conversations
      const response = await fetch('/api/messaging/conversation', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const conversationsData = await response.json();
      
      // Transform API data to match our component's expected format
      const transformedConversations: Conversation[] = conversationsData.map((conv: any) => ({
        id: conv.id,
        conversationType: conv.conversationType,
        title: conv.title,
        property: conv.property,
        participants: conv.participants || [],
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount || 0
      }));
      
      setConversations(transformedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      // On error, set empty array to show no conversations state
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messaging/message?conversationId=${conversationId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const messagesData = await response.json();
      setMessages(messagesData.reverse()); // reverse to show oldest first
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]); // Clear messages on error
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    
    // Mark conversation as read (update unread count)
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !currentUserId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      senderId: currentUserId,
      messageType: 'text'
    };

    // Optimistically add message
    setMessages(prev => [...prev, newMessage]);

    // Update conversation's last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversationId 
        ? { ...conv, lastMessage: newMessage }
        : conv
    ));

    try {
      // TODO: Send message to API
      console.log('Sending message:', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove message on error
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }
  };

  const handleCreateConversation = async (data: {
    participantIds: string[];
    propertyId?: string;
    conversationType: 'direct' | 'group';
    title?: string;
  }) => {
    try {
      // TODO: Create conversation via API
      console.log('Creating conversation:', data);
      
      // For now, just reload conversations
      await loadConversations();
    } catch (error) {
      console.error('Error creating conversation:', error);
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
        onSelectConversation={handleSelectConversation}
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