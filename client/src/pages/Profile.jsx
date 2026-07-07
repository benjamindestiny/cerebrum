import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";

const Profile = () => {
  const auth = useAuth();

  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { currentUser, userProfile, updateProfile } = auth;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setBio(userProfile.bio || "");
      setAvatar(userProfile.avatar || "");
      setStreak(userProfile.stats?.streak || 0);
    }
  }, [userProfile]);

  useEffect(() => {
    const calculateStreak = async () => {
      if (!currentUser) return;
      try {
        const { data: quizHistory, error } = await supabase
          .from("quiz_history")
          .select("created_at")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (quizHistory && quizHistory.length > 0) {
          let currentStreak = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          let lastDate = null;

          for (const record of quizHistory) {
            const recordDate = new Date(record.created_at);
            recordDate.setHours(0, 0, 0, 0);

            if (!lastDate) {
              const daysDiff = Math.floor(
                (today - recordDate) / (1000 * 60 * 60 * 24),
              );
              if (daysDiff <= 1) {
                currentStreak = 1;
                lastDate = recordDate;
              }
            } else {
              const daysDiff = Math.floor(
                (lastDate - recordDate) / (1000 * 60 * 60 * 24),
              );
              if (daysDiff === 1) {
                currentStreak++;
                lastDate = recordDate;
              } else if (daysDiff > 1) {
                break;
              }
            }
          }

          setStreak(currentStreak);
          if (updateProfile) {
            await updateProfile({
              stats: { ...userProfile?.stats, streak: currentStreak },
            });
          }
        }
      } catch (error) {
        console.error("Error calculating streak:", error);
      }
    };

    calculateStreak();
  }, [currentUser, userProfile, updateProfile]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await updateProfile({ name, bio, avatar });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setAvatar(urlData.publicUrl);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-[#1a1a2e] rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

        {/* Streak Badge */}
        <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#6d28d9]/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="text-gray-300">🔥 Current Streak</span>
          <span className="text-2xl font-bold text-[#7c3aed]">
            {streak} days
          </span>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#7c3aed]"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#7c3aed] p-1.5 rounded-full cursor-pointer hover:bg-[#6d28d9] transition-colors">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2d2d44] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#2d2d44] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] resize-none"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex-1 bg-[#7c3aed] text-white px-4 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(userProfile.name || "");
                  setBio(userProfile.bio || "");
                }}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white text-lg">{name || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bio</p>
              <p className="text-gray-300">{bio || "No bio yet"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white">{currentUser?.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-[#7c3aed] text-white px-4 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
