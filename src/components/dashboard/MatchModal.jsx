import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function MatchModal({ isOpen, onClose, matchedProfile, currentUser }) {
  if (!matchedProfile) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-[#C46A4A] to-[#8B2635]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-8 text-center">
          {/* Hearts Animation */}
          <div className="relative flex justify-center mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/10 rounded-full animate-ping" />
            </div>
            <Heart className="w-20 h-20 text-white fill-white animate-pulse relative z-10" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">It's a Match! 🎉</h2>
          <p className="text-white/80 mb-8">
            You and {matchedProfile.first_name} liked each other
          </p>
          
          {/* Profile Photos */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {currentUser?.photos?.[0] ? (
                  <img 
                    src={currentUser.photos[0]} 
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                    {currentUser?.first_name?.[0] || 'Y'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-[#C46A4A] fill-[#C46A4A]" />
            </div>
            
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {matchedProfile.photos?.[0] ? (
                  <img 
                    src={matchedProfile.photos[0]} 
                    alt={matchedProfile.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                    {matchedProfile.first_name?.[0]}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full py-6 bg-white text-[#C46A4A] hover:bg-white/90 rounded-xl text-lg font-medium"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send a Message
            </Button>
            <Button 
              variant="outline"
              onClick={onClose}
              className="w-full py-6 border-2 border-white text-white hover:bg-white/10 rounded-xl text-lg"
            >
              Keep Browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}