import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
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
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      // toast.'Failed to load profile');
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

      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: formData.name,
          email: formData.email,
          avatar_id: formData.avatar_id,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          updated_at: new Date().toISOString()
        });

      if (upsertError) throw upsertError;

      // toast.'Profile updated successfully! 🎉');
      setEditing(false);
      loadProfile();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      // toast.error.message || 'Failed to update profile');
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
      <div className="flex items-center justify-center min-h-[400px]  text-white border-[#2A2A4A]">
        <div className="text-center  text-white border-[#2A2A4A]">
          <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4  text-white border-[#2A2A4A]" />
          <p className="text-gray-400  text-white border-[#2A2A4A]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12  text-white border-[#2A2A4A]">
      {/* Header */}
      <div className="flex items-center justify-between  text-white border-[#2A2A4A]">
        <div className="flex items-center gap-4  text-white border-[#2A2A4A]">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg /5 transition-colors  text-white border-[#2A2A4A]"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400  text-white border-[#2A2A4A]" />
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3  text-white border-[#2A2A4A]">
            <UserCircle className="w-8 h-8 text-[#3B82F6CC]  text-white border-[#2A2A4A]" />
            Profile
          </h1>
        </div>
        <div className="flex gap-3  text-white border-[#2A2A4A]">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  loadProfile();
                }}
                className="btn-secondary text-sm px-4 py-2  text-white border-[#2A2A4A]"
                disabled={saving}
              >
                <X className="w-4 h-4 inline mr-1  text-white border-[#2A2A4A]" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm px-4 py-2 flex items-center gap-2  text-white border-[#2A2A4A]"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin  text-white border-[#2A2A4A]" />
                ) : (
                  <Save className="w-4 h-4  text-white border-[#2A2A4A]" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary text-sm px-4 py-2 flex items-center gap-2  text-white border-[#2A2A4A]"
            >
              <Edit2 className="w-4 h-4  text-white border-[#2A2A4A]" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-8  text-white border-[#2A2A4A]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6  text-white border-[#2A2A4A]">
          {/* Avatar */}
          <div className="relative group  text-white border-[#2A2A4A]">
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all  group-  text-white border-[#2A2A4A]"
              style={{ backgroundColor: currentAvatar?.bg || '#2d2d5e' }}
            >
              {currentAvatar?.emoji || '🧠'}
            </div>
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="absolute bottom-0 right-0 p-2 bg-[#2d2d5e] rounded-full border-2 border-[#1A1A1A] hover:border-blue-500 transition-all  opacity-0 group-hover:opacity-100  text-white border-[#2A2A4A]"
            >
              <Camera className="w-4 h-4 text-gray-400  text-white border-[#2A2A4A]" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1  text-white border-[#2A2A4A]">
            {editing ? (
              <div className="space-y-3 w-full  text-white border-[#2A2A4A]">
                <div className="relative  text-white border-[#2A2A4A]">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="input-theme pl-10 w-full  text-white border-[#2A2A4A]"
                  />
                </div>
                <div className="relative  text-white border-[#2A2A4A]">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="input-theme pl-10 w-full  text-white border-[#2A2A4A]"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1  text-white border-[#2A2A4A]">Email cannot be changed</p>
                </div>
                <div className="relative  text-white border-[#2A2A4A]">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
                  <input
                    type="text"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Short bio (e.g., Lifelong learner 🚀)"
                    className="input-theme pl-10 w-full  text-white border-[#2A2A4A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3  text-white border-[#2A2A4A]">
                  <div className="relative  text-white border-[#2A2A4A]">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="input-theme pl-10 w-full  text-white border-[#2A2A4A]"
                    />
                  </div>
                  <div className="relative  text-white border-[#2A2A4A]">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500  text-white border-[#2A2A4A]" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="Website"
                      className="input-theme pl-10 w-full  text-white border-[#2A2A4A]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">
                  {profile?.name || user?.user_metadata?.name || 'User'}
                </h2>
                <p className="text-gray-400  text-white border-[#2A2A4A]">{user?.email}</p>
                {profile?.bio && (
                  <p className="text-gray-300 text-sm mt-1  text-white border-[#2A2A4A]">{profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500  text-white border-[#2A2A4A]">
                  <span className="flex items-center gap-1  text-white border-[#2A2A4A]">
                    <Calendar className="w-3 h-3  text-white border-[#2A2A4A]" />
                    Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  {profile?.location && (
                    <span className="flex items-center gap-1  text-white border-[#2A2A4A]">
                      <MapPin className="w-3 h-3  text-white border-[#2A2A4A]" />
                      {profile.location}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Quick Stats */}
          {!editing && (
            <div className="flex gap-6  text-white border-[#2A2A4A]">
              <div className="text-center  text-white border-[#2A2A4A]">
                <div className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">{stats.totalQuizzes}</div>
                <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Quizzes</div>
              </div>
              <div className="text-center  text-white border-[#2A2A4A]">
                <div className="text-2xl font-bold text-teal-400  text-white border-[#2A2A4A]">{stats.bestScore}%</div>
                <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Best Score</div>
              </div>
              <div className="text-center  text-white border-[#2A2A4A]">
                <div className="text-2xl font-bold text-orange-400  text-white border-[#2A2A4A]">{stats.streak}</div>
                <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Streak</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4  text-white border-[#2A2A4A]">
        <div className="glass-card p-4 text-center  text-white border-[#2A2A4A]">
          <Trophy className="w-6 h-6 text-teal-400 mx-auto mb-2  text-white border-[#2A2A4A]" />
          <div className="text-xl font-bold text-white  text-white border-[#2A2A4A]">{stats.bestScore}%</div>
          <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Best Score</div>
        </div>
        <div className="glass-card p-4 text-center  text-white border-[#2A2A4A]">
          <Award className="w-6 h-6 text-[#3B82F6CC] mx-auto mb-2  text-white border-[#2A2A4A]" />
          <div className="text-xl font-bold text-white  text-white border-[#2A2A4A]">{stats.averageScore || 0}%</div>
          <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Average Score</div>
        </div>
        <div className="glass-card p-4 text-center  text-white border-[#2A2A4A]">
          <Zap className="w-6 h-6 text-teal-400 mx-auto mb-2  text-white border-[#2A2A4A]" />
          <div className="text-xl font-bold text-white  text-white border-[#2A2A4A]">{stats.totalPoints || 0}</div>
          <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Total Points</div>
        </div>
        <div className="glass-card p-4 text-center  text-white border-[#2A2A4A]">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2  text-white border-[#2A2A4A]" />
          <div className="text-xl font-bold text-white  text-white border-[#2A2A4A]">{stats.streak || 0}</div>
          <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Day Streak</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4  text-white border-[#2A2A4A]">
        <div className="glass-card p-4 flex items-center gap-4  text-white border-[#2A2A4A]">
          <div className="p-3 bg-blue-400/10 rounded-lg  text-white border-[#2A2A4A]">
            <Brain className="w-6 h-6 text-[#3B82F6CC]  text-white border-[#2A2A4A]" />
          </div>
          <div>
            <div className="text-lg font-bold text-white  text-white border-[#2A2A4A]">{stats.riddlesSolved || 0}</div>
            <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Riddles Solved</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4  text-white border-[#2A2A4A]">
          <div className="p-3 bg-green-400/10 rounded-lg  text-white border-[#2A2A4A]">
            <BookOpen className="w-6 h-6 text-green-400  text-white border-[#2A2A4A]" />
          </div>
          <div>
            <div className="text-lg font-bold text-white  text-white border-[#2A2A4A]">{stats.readArticles || 0}</div>
            <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Articles Read</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-4  text-white border-[#2A2A4A]">
          <div className="p-3 bg-purple-400/10 rounded-lg  text-white border-[#2A2A4A]">
            <Star className="w-6 h-6 text-purple-400  text-white border-[#2A2A4A]" />
          </div>
          <div>
            <div className="text-lg font-bold text-white  text-white border-[#2A2A4A]">{stats.perfectScores || 0}</div>
            <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Perfect Scores</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card p-6  text-white border-[#2A2A4A]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2  text-white border-[#2A2A4A]">
          <Medal className="w-5 h-5 text-teal-400  text-white border-[#2A2A4A]" />
          Achievements
        </h3>
        {stats.totalQuizzes === 0 ? (
          <div className="text-center py-8  text-white border-[#2A2A4A]">
            <div className="text-4xl mb-3  text-white border-[#2A2A4A]">🏆</div>
            <p className="text-gray-400  text-white border-[#2A2A4A]">No achievements yet. Start learning!</p>
            <button
              onClick={() => navigate('/categories')}
              className="btn-primary mt-4 text-sm px-6 py-2  text-white border-[#2A2A4A]"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3  text-white border-[#2A2A4A]">
            {stats.totalQuizzes >= 1 && (
              <div className="flex items-center gap-3   text-white border-[#2A2A4A]">
                <CheckCircle className="w-5 h-5 text-green-400  text-white border-[#2A2A4A]" />
                <div>
                  <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">First Quiz</div>
                  <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Completed first quiz</div>
                </div>
              </div>
            )}
            {stats.bestScore === 100 && (
              <div className="flex items-center gap-3 p-3 bg-teal-400/10 rounded-lg border border-teal-400/20  text-white border-[#2A2A4A]">
                <Trophy className="w-5 h-5 text-teal-400  text-white border-[#2A2A4A]" />
                <div>
                  <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">Perfect Score</div>
                  <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Scored 100%</div>
                </div>
              </div>
            )}
            {stats.streak >= 5 && (
              <div className="flex items-center gap-3 p-3 bg-orange-400/10 rounded-lg border border-orange-400/20  text-white border-[#2A2A4A]">
                <Flame className="w-5 h-5 text-orange-400  text-white border-[#2A2A4A]" />
                <div>
                  <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">On Fire!</div>
                  <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">5+ day streak</div>
                </div>
              </div>
            )}
            {stats.riddlesSolved >= 5 && (
              <div className="flex items-center gap-3 p-3 bg-purple-400/10 rounded-lg border border-purple-400/20  text-white border-[#2A2A4A]">
                <Puzzle className="w-5 h-5 text-purple-400  text-white border-[#2A2A4A]" />
                <div>
                  <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">Riddle Master</div>
                  <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Solved 5+ riddles</div>
                </div>
              </div>
            )}
            {stats.totalQuizzes >= 10 && (
              <div className="flex items-center gap-3 p-3 bg-blue-400/10 rounded-lg border border-[#3B82F6CC]/20  text-white border-[#2A2A4A]">
                <Star className="w-5 h-5 text-[#3B82F6CC]  text-white border-[#2A2A4A]" />
                <div>
                  <div className="text-white text-sm font-medium  text-white border-[#2A2A4A]">Quiz Enthusiast</div>
                  <div className="text-xs text-gray-400  text-white border-[#2A2A4A]">Completed 10+ quizzes</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="glass-card p-6  text-white border-[#2A2A4A]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2  text-white border-[#2A2A4A]">
          <Settings className="w-5 h-5 text-gray-400  text-white border-[#2A2A4A]" />
          Account Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3  text-white border-[#2A2A4A]">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) {
                supabase.auth.signOut();
                navigate('/auth');
              }
            }}
            className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg /20 transition-colors group  text-white border-[#2A2A4A]"
          >
            <div className="flex items-center gap-3  text-white border-[#2A2A4A]">
              <LogOut className="w-5 h-5 text-red-400  text-white border-[#2A2A4A]" />
              <span className="text-red-400  text-white border-[#2A2A4A]">Sign Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400/50 group- transition- text-white border-[#2A2A4A]" />
          </button>
          <button
            className="flex items-center justify-between  /15 transition-colors group  text-white border-[#2A2A4A]"
          >
            <div className="flex items-center gap-3  text-white border-[#2A2A4A]">
              <Lock className="w-5 h-5 text-gray-400  text-white border-[#2A2A4A]" />
              <span className="text-gray-400  text-white border-[#2A2A4A]">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500/50 group- transition- text-white border-[#2A2A4A]" />
          </button>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <>
        {showAvatarSelector && (
          <AvatarSelector
            currentAvatar={currentAvatar}
            onSelect={handleAvatarSelect}
            onClose={() => setShowAvatarSelector(false)}
          />
        )}
      </>
    </div>
  );
};

export default Profile;
