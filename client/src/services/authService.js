import { supabase } from "./supabase";

// Default bios for new users
const DEFAULT_BIOS = [
  "🧠 Brain enthusiast | Quiz lover",
  "📚 Forever learning | Knowledge seeker",
  "🎯 Trivia master in the making",
  "🧩 Curious mind | Puzzle solver",
  "🌟 Exploring the world of knowledge",
];

// Default avatars
const DEFAULT_AVATARS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

// Helper function to get random default bio
const getRandomDefaultBio = () => {
  return DEFAULT_BIOS[Math.floor(Math.random() * DEFAULT_BIOS.length)];
};

// Helper function to get random default avatar
const getRandomDefaultAvatar = () => {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
};

export const authService = {
  // Sign up with email and password
  signUp: async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            bio: getRandomDefaultBio(),
            avatar: getRandomDefaultAvatar(),
          },
        },
      });

      if (error) throw error;

      // Create user profile in users table with default values
      if (data.user) {
        const { error: profileError } = await supabase.from("users").upsert({
          id: data.user.id,
          name: name || email.split("@")[0],
          email: email,
          bio: getRandomDefaultBio(),
          avatar: getRandomDefaultAvatar(),
          stats: {
            total_quizzes: 0,
            total_correct: 0,
            total_incorrect: 0,
            best_score: 0,
            average_score: 0,
            total_time: 0,
            total_points: 0,
            riddles_solved: 0,
            read_articles: 0,
            streak: 0,
            longest_streak: 0,
            last_quiz_date: null,
          },
          preferences: {
            theme: "dark",
            notifications: true,
            language: "en",
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }

      return data;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last active timestamp
    if (data.user) {
      await supabase
        .from("users")
        .update({
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.user.id);
    }

    return data;
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Get user profile
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If user doesn't exist in users table, create one
        if (error.code === "PGRST116") {
          // Get auth user
          const { data: authData } = await supabase.auth.getUser();
          if (authData.user) {
            // Create profile with defaults
            const newProfile = {
              id: authData.user.id,
              name:
                authData.user.user_metadata?.name ||
                authData.user.email?.split("@")[0] ||
                "User",
              email: authData.user.email,
              bio: getRandomDefaultBio(),
              avatar: getRandomDefaultAvatar(),
              stats: {
                total_quizzes: 0,
                total_correct: 0,
                total_incorrect: 0,
                best_score: 0,
                average_score: 0,
                total_time: 0,
                total_points: 0,
                riddles_solved: 0,
                read_articles: 0,
                streak: 0,
                longest_streak: 0,
                last_quiz_date: null,
              },
              preferences: {
                theme: "dark",
                notifications: true,
                language: "en",
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            const { data: newData, error: insertError } = await supabase
              .from("users")
              .insert([newProfile])
              .select()
              .single();

            if (insertError) throw insertError;
            return newData;
          }
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      // Remove any fields that shouldn't be updated directly
      const allowedUpdates = {
        name: updates.name,
        bio: updates.bio,
        avatar: updates.avatar,
        preferences: updates.preferences,
        updated_at: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(allowedUpdates).forEach(
        (key) =>
          allowedUpdates[key] === undefined && delete allowedUpdates[key],
      );

      const { data, error } = await supabase
        .from("users")
        .update(allowedUpdates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Update user stats
  updateStats: async (userId, statsData) => {
    try {
      // Get current stats
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("stats")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;
      if (!user) throw new Error("User not found");

      const currentStats = user.stats || {};

      // Calculate streak
      let streak = currentStats.streak || 0;
      const today = new Date().toISOString().split("T")[0];
      const lastQuizDate = currentStats.last_quiz_date;

      if (lastQuizDate) {
        const lastDate = new Date(lastQuizDate).toISOString().split("T")[0];
        const diffDays = Math.floor(
          (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 0) {
          // Already did a quiz today, streak stays the same
          streak = currentStats.streak || 0;
        } else if (diffDays === 1) {
          // Consecutive day, increase streak
          streak = (currentStats.streak || 0) + 1;
        } else {
          // Streak broken, reset to 0
          streak = 0;
        }
      } else if (statsData.totalQuizzes > 0) {
        // First quiz ever
        streak = 1;
      }

      const updatedStats = {
        total_quizzes:
          (currentStats.total_quizzes || 0) + (statsData.totalQuizzes || 0),
        total_correct:
          (currentStats.total_correct || 0) + (statsData.totalCorrect || 0),
        total_incorrect:
          (currentStats.total_incorrect || 0) + (statsData.totalIncorrect || 0),
        best_score: Math.max(
          currentStats.best_score || 0,
          statsData.bestScore || 0,
        ),
        total_time: (currentStats.total_time || 0) + (statsData.totalTime || 0),
        total_points:
          (currentStats.total_points || 0) + (statsData.totalPoints || 0),
        riddles_solved:
          (currentStats.riddles_solved || 0) + (statsData.riddlesSolved || 0),
        read_articles:
          (currentStats.read_articles || 0) + (statsData.readArticles || 0),
        streak: streak,
        longest_streak: Math.max(currentStats.longest_streak || 0, streak || 0),
        last_quiz_date:
          statsData.totalQuizzes > 0
            ? new Date().toISOString()
            : currentStats.last_quiz_date,
      };

      // Calculate average score
      const totalQuizzes = updatedStats.total_quizzes || 1;
      const totalCorrect = updatedStats.total_correct || 0;
      const totalQuestions = totalCorrect + (updatedStats.total_incorrect || 0);
      updatedStats.average_score =
        totalQuestions > 0
          ? Math.round((totalCorrect / totalQuestions) * 100)
          : 0;

      const { data, error } = await supabase
        .from("users")
        .update({
          stats: updatedStats,
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating stats:", error);
      throw error;
    }
  },

  // Update preferences
  updatePreferences: async (userId, preferences) => {
    const { data, error } = await supabase
      .from("users")
      .update({
        preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Upload avatar
  uploadAvatar: async (userId, file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;

      // Update user profile with new avatar URL
      const { data, error } = await supabase
        .from("users")
        .update({
          avatar: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { data, avatarUrl };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  // Get default bios
  getDefaultBios: () => {
    return DEFAULT_BIOS;
  },

  // Get default avatars
  getDefaultAvatars: () => {
    return DEFAULT_AVATARS;
  },

  // Get user's quiz history (for streak calculation)
  getQuizHistory: async (userId, limit = 10) => {
    const { data, error } = await supabase
      .from("quiz_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};

export default authService;
