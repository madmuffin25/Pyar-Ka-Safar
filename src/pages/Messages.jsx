import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ConversationList from '@/components/messaging/ConversationList';
import ChatWindow from '@/components/messaging/ChatWindow';

export default function Messages() {
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Get current user's profile
  const { data: userProfiles, isLoading: loadingUser } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.UserProfile.filter({ created_by: user.email });
    }
  });

  const currentUserProfile = userProfiles?.[0];

  // Get conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations', currentUserProfile?.id],
    queryFn: async () => {
      const convs1 = await base44.entities.Conversation.filter({ participant_1: currentUserProfile.id });
      const convs2 = await base44.entities.Conversation.filter({ participant_2: currentUserProfile.id });
      return [...convs1, ...convs2].sort((a, b) => 
        new Date(b.last_message_date || b.created_date) - new Date(a.last_message_date || a.created_date)
      );
    },
    enabled: !!currentUserProfile
  });

  // Get all profiles for conversation list
  const { data: allProfiles = [] } = useQuery({
    queryKey: ['allProfiles'],
    queryFn: () => base44.entities.UserProfile.list(),
    enabled: !!currentUserProfile
  });

  // Get messages for selected conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedConversation?.id],
    queryFn: () => base44.entities.Message.filter({ conversation_id: selectedConversation.id }),
    enabled: !!selectedConversation,
    refetchInterval: 3000 // Poll for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const otherUserId = selectedConversation.participant_1 === currentUserProfile.id 
        ? selectedConversation.participant_2 
        : selectedConversation.participant_1;

      await base44.entities.Message.create({
        sender_id: currentUserProfile.id,
        receiver_id: otherUserId,
        content,
        conversation_id: selectedConversation.id
      });

      await base44.entities.Conversation.update(selectedConversation.id, {
        last_message: content,
        last_message_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation?.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  const getOtherUser = () => {
    if (!selectedConversation || !currentUserProfile) return null;
    const otherId = selectedConversation.participant_1 === currentUserProfile.id 
      ? selectedConversation.participant_2 
      : selectedConversation.participant_1;
    return allProfiles.find(p => p.id === otherId);
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#C46A4A] animate-spin" />
      </div>
    );
  }

  if (!currentUserProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center p-4">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-[#C46A4A] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Profile</h2>
          <p className="text-gray-600 mb-6">You need a profile to message others</p>
          <Link to={createPageUrl('Onboarding')}>
            <Button className="bg-gradient-to-r from-[#C46A4A] to-[#8B2635] px-8 py-6 rounded-full">
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedConversation ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              ) : (
                <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 hidden sm:block">Messages</span>
                </Link>
              )}
            </div>
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="rounded-full">
                Back to Browse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Conversations List */}
        <div className={`w-full lg:w-80 border-r border-gray-100 ${selectedConversation ? 'hidden lg:block' : ''}`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
          </div>
          {loadingConversations ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-[#C46A4A] animate-spin" />
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              profiles={allProfiles}
              currentUserId={currentUserProfile.id}
              selectedId={selectedConversation?.id}
              onSelect={setSelectedConversation}
            />
          )}
        </div>

        {/* Chat Window */}
        <div className={`flex-1 ${!selectedConversation ? 'hidden lg:flex' : 'flex'} flex-col`}>
          {selectedConversation ? (
            <ChatWindow
              messages={messages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date))}
              currentUserId={currentUserProfile.id}
              otherUser={getOtherUser()}
              onSendMessage={(content) => sendMessageMutation.mutate(content)}
              isSending={sendMessageMutation.isPending}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}