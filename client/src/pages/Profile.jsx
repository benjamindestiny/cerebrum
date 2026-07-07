import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Camera, Save, ArrowLeft,
  UserCircle, Calendar, Award, Trophy,
  Zap, Flame, BookOpen, CheckCircle,
  Loader2, Edit2, X, AlertCircle,
  LayoutDashboard, Settings, ChevronRight,
  Star, Medal, Target, Brain, Puzzle,
  MapPin, Globe, Lock, LogOut
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { toast } from 'react-toastify';
import AvatarSelector from '../components/Common/AvatarSelector';
import { defaultAvatars, getAvatarById } from '../data/avatars';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar_id: 1,
    bio: '',
    location: '',
    website: ''
  });
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    bestScore: 0,
    averageScore: 0,
    totalPoints: 0,
    streak: 0,
    riddlesSolved: 0,
    readArticles: 0,
    totalTime: 0,
    perfectScores: 0
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      
      const userMeta = user.user_metadata || {};
      setFormData({
        name: userMeta.name || '',
        email: user.email || '',
        avatar_id: userMeta.avatar_id || 1,
        bio: userMeta.bio || '',
        location: userMeta.location || '',
        website: userMeta.website || ''
      });
      
      // Try to get user profile from users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      }
      
      if (profileData) {
        setProfile(profileData);
        const statsData = profileData.stats || {};
        setStats({
          totalQuizzes: statsData.total_quizzes || 0,
          bestScore: statsData.best_score || 0,
          averageScore: statsData.average_score || 0,
          totalPoints: statsData.total_points || 0,
          streak: statsData.streak || 0,
          riddlesSolved: statsData.riddles_solved || 0,
          readArticles: statsData.read_articles || 0,
          totalTime: statsData.total_time || 0,
          perfectScores: statsData.perfect_scores || 0
        });
      } else {
        // If no profile exists, create one
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            name: userMeta.name || user.email?.split('@')[0] || 'User',
            email: user.email,
            avatar_id: userMeta.avatar_id || 1,
            stats: {
              total_quizzes: 0,
              best_score: 0,
              average_score: 0,
              total_points: 0,
              streak: 0,
              riddles_solved: 0,
              read_articles: 0,
              total_time: 0,
              perfect_scores: 0
            }
          });
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({ ...prev, avatar_id: avatar.id }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          avatar_id: formData.avatar_id,
          bio: formData.bio,
          location: formData.location,
          website: formData.website
        }
      });

      if (updateError) throw updateError;

      // Check if user exists in users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Check error:', checkError);
      }

      let upsertError;
      if (existingUser) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({
            name: formData.name,
            email: formData.email,
            avatar_id: formData.avatar_id,
            bio: formData.bio,
            location: formData.location,
            website: formData.website,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        upsertError = error;
      } else {
        // Insert new user
        const { error } = await supabase
          .from('users')
          .insert({
            id: user.id,
            name: formData.name,
            email: formData.email,
            avatar_id: formData.avatar_id,
            bio: formData.bio,
            location: formData.location,
            website: formData.website,
            stats: {
              total_quizzes: 0,
              best_score: 0,
              average_score: 0,
              total_points: 0,
              streak: 0,
              riddles_solved: 0,
              read_articles: 0,
              total_time: 0,
              perfect_scores: 0
            },
            created_at: new Date().toISOString()
          });
        upsertError = error;
      }

      if (upsertError) throw upsertError;

      toast.success('Profile updated successfully! 🎉');
      setEditing(false);
      loadProfile();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getAvatar = () => {
    return getAvatarById(formData.avatar_id) || defaultAvatars[0];
  };

  const currentAvatar = getAvatar();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#7c3aed] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-[#a78bfa]" />
            Profile
          </h1>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  loadProfile();
                }}
                className="btn-secondary text-sm px-4 py-2"
                disabled={saving}
              >
                <X className="w-4 h-4 inline mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary text-sm px-4 py-2 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all duration-300 group-hover:scale-105"
              style={{ backgroundColor: currentAvatar?.bg || '#2d2d5e' }}
            >
              {currentAvatar?.emoji || '🧠'}
            </div>
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="absolute bottom-0 right-0 p-2 bg-[#2d2d5e] rounded-full border-2 border-[#1a1a2e] hover:border-[#7c3aed] transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <Camera className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1">
            {editing ? (
              <div className="space-y-3 w-full">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="input-theme pl-10 w-full"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="input-theme pl-10 w-full"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Short bio (e.g., Lifelong learner 🚀)"
                    className="input-theme pl-10 w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="input-theme pl-10 w-full"
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Website"
                      className="input-theme pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">
                  {profile?.name || user?.user_metadata?.name || 'User'}
                </h2>
                <p className="text-gray-400">{user?.email}</p>
                {profile?.bio && (
                  <p className="text-gray-300 text-sm mt-1">{profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  {profile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {profile.location}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Quick Stats */}
          {!editing && (
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalQuizzes}</div>
                <div className="text-xs text-gray-400">Quizzes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.bestScore}%</div>
                <div className="text-xs text-gray-400">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.streak}</div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.bestScore}%</div>
          <div className="text-xs text-gray-400">Best Score</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Award className="w-6 h-6 text-[#a78bfa] mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.averageScore || 0}%</div>
          <div className="text-xs text-gray-400">Average Score</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.totalPoints || 0}</div>
          <div className="text-xs text-gray-400">Total Points</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.streak || 0}</div>
          <div className="text-xs text-gray-400">Day Streak</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-400/10 rounded-lg">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{stats.riddlesSolved || 0}</div>
            <div className="text-xs text-gray-400">Riddles Solved</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-green-400/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{stats.readArticles || 0}</div>
            <div className="text-xs text-gray-400">Articles Read</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-400/10 rounded-lg">
            <Star className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">{stats.perfectScores || 0}</div>
            <div className="text-xs text-gray-400">Perfect Scores</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-yellow-400" />
          Achievements
        </h3>
        {stats.totalQuizzes === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-gray-400">No achievements yet. Start learning!</p>
            <button
              onClick={() => navigate('/categories')}
              className="btn-primary mt-4 text-sm px-6 py-2"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.totalQuizzes >= 1 && (
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white text-sm font-medium">First Quiz</div>
                  <div className="text-xs text-gray-400">Completed first quiz</div>
                </div>
              </div>
            )}
            {stats.bestScore === 100 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-white text-sm font-medium">Perfect Score</div>
                  <div className="text-xs text-gray-400">Scored 100%</div>
                </div>
              </div>
            )}
            {stats.streak >= 5 && (
              <div className="flex items-center gap-3 p-3 bg-orange-400/10 rounded-lg border border-orange-400/20">
                <Flame className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-white text-sm font-medium">On Fire!</div>
                  <div className="text-xs text-gray-400">5+ day streak</div>
                </div>
              </div>
            )}
            {stats.riddlesSolved >= 5 && (
              <div className="flex items-center gap-3 p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
                <Puzzle className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-white text-sm font-medium">Riddle Master</div>
                  <div className="text-xs text-gray-400">Solved 5+ riddles</div>
                </div>
              </div>
            )}
            {stats.totalQuizzes >= 10 && (
              <div className="flex items-center gap-3 p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                <Star className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-white text-sm font-medium">Quiz Enthusiast</div>
                  <div className="text-xs text-gray-400">Completed 10+ quizzes</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          Account Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) {
                supabase.auth.signOut();
                navigate('/auth');
              }
            }}
            className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Sign Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/50 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500/50 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <AvatarSelector
            currentAvatar={currentAvatar}
            onSelect={handleAvatarSelect}
            onClose={() => setShowAvatarSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
