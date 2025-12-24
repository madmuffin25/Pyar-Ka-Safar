import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function ConversationList({ conversations, profiles, currentUserId, selectedId, onSelect }) {
  const getOtherParticipant = (conv) => {
    const otherId = conv.participant_1 === currentUserId ? conv.participant_2 : conv.participant_1;
    return profiles.find(p => p.id === otherId);
  };

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Match with someone to start chatting!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conv) => {
        const otherUser = getOtherParticipant(conv);
        if (!otherUser) return null;
        
        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
              selectedId === conv.id ? 'bg-[#F9F2EB]' : ''
            }`}
          >
            <img
              src={otherUser.photos?.[0] || `https://ui-avatars.com/api/?name=${otherUser.first_name}&background=C46A4A&color=fff`}
              alt={otherUser.first_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 text-left min-w-0">
              <p className="font-semibold text-gray-900 truncate">{otherUser.first_name}</p>
              <p className="text-sm text-gray-500 truncate">{conv.last_message || 'No messages yet'}</p>
            </div>
            {conv.last_message_date && (
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(conv.last_message_date), { addSuffix: false })}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}