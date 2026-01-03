import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChatWindow from '@/components/messaging/ChatWindow';
import {
  useMessages,
  useSendMessage,
  useGetOrCreateConversation,
  useRealtimeMessages,
  useMarkAsRead
} from '@/hooks/useMessages';
import { useProfileById } from '@/hooks/useMatches';

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState(null);

  // Get or create conversation
  const getOrCreateConversation = useGetOrCreateConversation();

  // Fetch other user's profile
  const { data: otherUser, isLoading: loadingProfile } = useProfileById(userId);

  // Fetch messages once we have conversation ID
  const { data: messages = [], isLoading: loadingMessages } = useMessages(conversationId);

  // Send message mutation
  const sendMessage = useSendMessage();

  // Mark as read mutation
  const markAsRead = useMarkAsRead();

  // Subscribe to realtime updates
  useRealtimeMessages(conversationId);

  // Get or create conversation on mount
  useEffect(() => {
    if (userId && user) {
      getOrCreateConversation.mutate(userId, {
        onSuccess: (convId) => {
          setConversationId(convId);
        }
      });
    }
  }, [userId, user]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversationId) {
      markAsRead.mutate(conversationId);
    }
  }, [conversationId, messages.length]);

  const handleSendMessage = (content) => {
    if (!conversationId || !content.trim()) return;

    sendMessage.mutate({
      conversationId,
      content
    });
  };

  const isLoading = loadingProfile || getOrCreateConversation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C46A4A]" />
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">User not found</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F2EB] to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate('/messages')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <Link to={`/profile/${userId}`} className="flex items-center gap-3 flex-1">
              <img
                src={otherUser.photos?.[0] || `https://ui-avatars.com/api/?name=${otherUser.first_name}&background=C46A4A&color=fff`}
                alt={otherUser.first_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{otherUser.first_name}</p>
                <p className="text-xs text-gray-500">{otherUser.city}, {otherUser.state}</p>
              </div>
            </Link>

            <Link to={createPageUrl('Home')}>
              <div className="w-10 h-10 bg-gradient-to-r from-[#C46A4A] to-[#8B2635] rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Window */}
      <main className="flex-1 flex flex-col container mx-auto max-w-2xl bg-white shadow-sm">
        {loadingMessages ? (
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
      </main>
    </div>
  );
}
