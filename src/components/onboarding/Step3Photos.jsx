import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Camera, X, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const FREE_PHOTO_LIMIT = 3;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function Step3Photos({ data, updateData, onNext, onBack }) {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const photos = data.photos || [];
  const maxPhotos = FREE_PHOTO_LIMIT; // During onboarding, user is always free tier

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !user) return;

    // Validate file types
    const invalidFiles = files.filter(file => !ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()));
    if (invalidFiles.length > 0) {
      toast.error('Please use JPEG or PNG photos only', {
        description: 'Other formats like WebP or HEIC are not supported.'
      });
      return;
    }

    // Check if adding these files would exceed limit
    if (photos.length + files.length > maxPhotos) {
      toast.error(`Free users can upload up to ${maxPhotos} photos`, {
        description: "Upgrade to Premium for up to 6 photos!"
      });
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newPhotos = [...photos, ...uploadedUrls].slice(0, maxPhotos);
      updateData({ photos: newPhotos });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (index) => {
    const photoUrl = photos[index];
    const newPhotos = photos.filter((_, i) => i !== index);
    updateData({ photos: newPhotos });

    // Optionally delete from storage (extract path from URL)
    try {
      const urlParts = photoUrl.split('/profile-photos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('profile-photos').remove([filePath]);
      }
    } catch (error) {
      console.error('Error deleting photo from storage:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (photos.length >= 1) {
      onNext();
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Add Your Photos</h2>
        <p className="text-gray-600">Add 1-{maxPhotos} photos that show the real you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(maxPhotos)].map((_, index) => {
            const photo = photos[index];

            return (
              <div
                key={index}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                {photo ? (
                  <>
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-[#C46A4A] text-white text-xs px-2 py-1 rounded-full">
                        Main Photo
                      </div>
                    )}
                  </>
                ) : (
                  <label className={`flex flex-col items-center justify-center w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#C46A4A] hover:bg-[#C46A4A]/5 transition-all ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="animate-spin w-8 h-8 border-2 border-[#C46A4A] border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Add Photo</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            );
          })}
        </div>

        {/* Guidelines */}
        <div className="bg-[#F9F2EB] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-[#C46A4A] mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-2">Photo Tips</p>
              <ul className="text-gray-600 space-y-1">
                <li>• Use clear, recent photos of your face</li>
                <li>• Avoid heavy filters or group photos</li>
                <li>• Show your personality and interests</li>
                <li>• Smile! It makes a great first impression</li>
              </ul>
            </div>
          </div>
        </div>

        {photos.length === 0 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl p-4">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Please add at least 1 photo to continue</span>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 py-6 text-lg rounded-xl border-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={photos.length === 0}
            className="flex-1 py-6 text-lg rounded-xl bg-gradient-to-r from-[#C46A4A] to-[#8B2635] hover:from-[#B35A3A] hover:to-[#7A2030] group disabled:opacity-50"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}
