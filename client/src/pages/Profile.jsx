import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";

// Predefined bios for users to choose from
const DEFAULT_BIOS = [
  "🧠 Brain enthusiast | Quiz lover",
  "📚 Forever learning | Knowledge seeker",
  "🎯 Trivia master in the making",
  "🧩 Curious mind | Puzzle solver",
  "🌟 Exploring the world of knowledge",
  "💡 Lifelong learner | Quiz challenger",
  "🎮 Gaming my way through quizzes",
  "📖 Page turner | Fact collector",
];

// Default avatar options
const DEFAULT_AVATARS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

const Profile = () => {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [selectedBio, setSelectedBio] = useState("");
  const [customBio, setCustomBio] = useState("");
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showBioOptions, setShowBioOptions] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setBio(userProfile.bio || "");
      setAvatar(userProfile.avatar || "");
      setUsername(userProfile.username || "");
      setStreak(userProfile.streak || 0);
      setSelectedBio(userProfile.bio || "");
    }
  }, [userProfile]);

  // Calculate streak based on quiz activity
  useEffect(() => {
    const calculateStreak = async () => {
      if (!currentUser) return;

      try {
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get user's quiz history
        const { data: quizHistory, error } = await supabase
          .from("quiz_history")
          .select("created_at")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (quizHistory && quizHistory.length > 0) {
          let currentStreak = 0;
          let lastDate = null;

          for (const record of quizHistory) {
            const recordDate = new Date(record.created_at);
            recordDate.setHours(0, 0, 0, 0);

            if (!lastDate) {
              // Check if last quiz was today or yesterday
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
          // Update streak in database
          await authService.updateProfile(currentUser.id, {
            streak: currentStreak,
          });
        }
      } catch (error) {
        console.error("Error calculating streak:", error);
      }
    };

    calculateStreak();
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      // Determine final bio (selected or custom)
      const finalBio = selectedBio === "custom" ? customBio : selectedBio;

      const updates = {
        username,
        bio: finalBio,
        avatar,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", currentUser.id);

      if (error) throw error;

      // Update local state
      setUserProfile({ ...userProfile, ...updates });
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
      setUploadingAvatar(true);
      const file = event.target.files[0];

      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      // Upload to Supabase storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;
      setAvatar(avatarUrl);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSelectDefaultAvatar = (avatarUrl) => {
    setAvatar(avatarUrl);
    setShowAvatarOptions(false);
  };

  const handleSelectBio = (bioText) => {
    setSelectedBio(bioText);
    setBio(bioText);
    setShowBioOptions(false);
    if (bioText === "custom") {
      setCustomBio("");
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-[#1a1a2e] rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

        {/* Streak Display */}
        <div className="bg-[#2d2d44] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Current Streak</p>
              <p className="text-3xl font-bold text-[#7c3aed]">{streak} 🔥</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Best Streak</p>
              <p className="text-xl font-bold text-yellow-500">
                {userProfile.best_streak || 0} 👑
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={avatar || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#7c3aed]"
              />
              <button
                onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                className="absolute bottom-0 right-0 bg-[#7c3aed] p-2 rounded-full hover:bg-[#6d28d9] transition-colors"
              >
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
              </button>

              {/* Avatar Options Dropdown */}
              {showAvatarOptions && (
                <div className="absolute top-full mt-2 bg-[#2d2d44] rounded-lg p-4 shadow-xl z-10 w-64">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {DEFAULT_AVATARS.map((avatarUrl, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectDefaultAvatar(avatarUrl)}
                        className="w-16 h-16 rounded-full hover:ring-2 hover:ring-[#7c3aed] transition-all"
                      >
                        <img
                          src={avatarUrl}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploadingAvatar}
                    />
                    <button className="w-full bg-[#7c3aed] text-white px-4 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors text-sm">
                      {uploadingAvatar ? "Uploading..." : "Upload from device"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#2d2d44] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Bio
                  </label>
                  <button
                    onClick={() => setShowBioOptions(!showBioOptions)}
                    className="w-full bg-[#2d2d44] text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-[#7c3aed] transition-colors text-left"
                  >
                    {bio || "Select or write a bio"}
                  </button>

                  {showBioOptions && (
                    <div className="mt-2 bg-[#2d2d44] rounded-lg p-3 shadow-xl">
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {DEFAULT_BIOS.map((bioText, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelectBio(bioText)}
                            className={`w-full text-left px-3 py-2 rounded hover:bg-[#3d3d54] transition-colors ${
                              selectedBio === bioText
                                ? "bg-[#7c3aed]"
                                : "text-gray-300"
                            }`}
                          >
                            {bioText}
                          </button>
                        ))}
                        <button
                          onClick={() => handleSelectBio("custom")}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-[#3d3d54] transition-colors ${
                            selectedBio === "custom"
                              ? "bg-[#7c3aed]"
                              : "text-gray-300"
                          }`}
                        >
                          ✏️ Write custom bio
                        </button>
                      </div>

                      {selectedBio === "custom" && (
                        <div className="mt-2">
                          <textarea
                            value={customBio}
                            onChange={(e) => {
                              setCustomBio(e.target.value);
                              setBio(e.target.value);
                            }}
                            placeholder="Write your bio here..."
                            className="w-full bg-[#1a1a2e] text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                            rows="3"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex-1 bg-[#7c3aed] text-white px-6 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setBio(userProfile.bio || "");
                      setAvatar(userProfile.avatar || "");
                      setUsername(userProfile.username || "");
                    }}
                    className="flex-1 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Username</p>
                  <p className="text-white text-lg">{username || "Not set"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Bio</p>
                  <p className="text-gray-300">{bio || "No bio yet"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{currentUser?.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Member since</p>
                  <p className="text-white">
                    {userProfile.created_at
                      ? new Date(userProfile.created_at).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setBio(userProfile.bio || "");
                    setAvatar(userProfile.avatar || "");
                    setUsername(userProfile.username || "");
                  }}
                  className="w-full bg-[#7c3aed] text-white px-6 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
