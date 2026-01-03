import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, User, MessageCircle, Sparkles, Search, LogOut, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useRealtimeMessages,
  useRealtimeConversations,
  useMarkAsRead
} from '@/hooks/useMessages';
import ChatWindow from '@/components/messaging/ChatWindow';

export default function Messages() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Fetch conversations
  const { data: conversations = [], isLoading: loadingConversations } = useConversations();

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: loadingMessages } = useMessages(selectedConversation?.conversation_id);

  // Send message mutation
  const sendMessage = useSendMessage();

  // Mark as read mutation
  const markAsRead = useMarkAsRead();

  // Subscribe to realtime updates
  useRealtimeConversations();
  useRealtimeMessages(selectedConversation?.conversation_id);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation?.conversation_id && selectedConversation.unread_count > 0) {
      markAsRead.mutate(selectedConversation.conversation_id);
    }
  }, [selectedConversation?.conversation_id]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
  };

  const handleSendMessage = (content) => {
    if (!selectedConversation?.conversation_id || !content.trim()) return;

    sendMessage.mutate({
      conversationId: selectedConversation.conversation_id,
      content
    });
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  // Build other user object for ChatWindow
  const otherUser = selectedConversation ? {
    id: selectedConversation.other_user_id,
    first_name: selectedConversation.other_user_name,
    photos: selectedConversation.other_user_photo ? [selectedConversation.other_user_photo] : [],
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile back button when in chat view */}
            {selectedConversation && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                onClick={handleBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}

            <Link to={createPageUrl('Home')} className={`flex items-center gap-2 ${selectedConversation ? 'hidden md:flex' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">PyarKaSafar</span>
            </Link>

            {/* Show conversation name on mobile when selected */}
            {selectedConversation && (
              <div className="flex items-center gap-2 md:hidden">
                <img
                  src={selectedConversation.other_user_photo || `https://ui-avatars.com/api/?name=${selectedConversation.other_user_name}&background=C46A4A&color=fff`}
                  alt={selectedConversation.other_user_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold">{selectedConversation.other_user_name}</span>
              </div>
            )}

            <nav className="flex items-center gap-2">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('RecommendedProfiles')} className="hidden sm:inline-flex">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Sparkles className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Browse')}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl('Messages')}>
                <Button variant="ghost" size="icon" className="rounded-full bg-[#C46A4A]/10">
                  <MessageCircle className="w-5 h-5 text-[#C46A4A]" />
                </Button>
              </Link>
              <Link to={createPageUrl('Profile')} className="hidden sm:inline-flex">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hidden sm:inline-flex"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto h-[calc(100vh-73px)]">
        <div className="h-full flex">
          {/* Conversation List - hidden on mobile when chat is open */}
          <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            </div>

            {loadingConversations ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#C46A4A]" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-[#C46A4A]" />
                </div>
                <p className="text-gray-600 mb-2">No conversations yet</p>
                <p className="text-sm text-gray-500 mb-4">Match with someone to start chatting!</p>
                <Link to={createPageUrl('Browse')}>
                  <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full">
                    Find Matches
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {conversations.map((conv) => (
                  <button
                    key={conv.conversation_id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      selectedConversation?.conversation_id === conv.conversation_id ? 'bg-[#F9F2EB]' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={conv.other_user_photo || `https://ui-avatars.com/api/?name=${conv.other_user_name}&background=C46A4A&color=fff`}
                        alt={conv.other_user_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conv.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C46A4A] text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unread_count > 9 ? '9+' : conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold text-gray-900 truncate ${conv.unread_count > 0 ? 'font-bold' : ''}`}>
                          {conv.other_user_name}
                        </p>
                        {conv.last_message_at && (
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                            {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false })}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conv.last_message_sender_id === user?.id && 'You: '}
                        {conv.last_message || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col bg-white ${!selectedConversation ? 'hidden md:flex' : ''}`}>
            {!selectedConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#C46A4A]/10 to-[#D4A853]/10 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-[#C46A4A]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h2>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            ) : loadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#C46A4A]" />
              </div>
            ) : (
              <ChatWindow
                messages={messages}
                currentUserId={user?.id}
                otherUser={otherUser}
                onSendMessage={handleSendMessage}
                isSending={sendMessage.isPending}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
