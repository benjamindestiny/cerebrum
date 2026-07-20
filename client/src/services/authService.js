import { supabase } from "./supabase";
import { getRandomAvatar } from "../data/avatars";

// Default bios for new users
const DEFAULT_BIOS = [
  "🧠 Brain enthusiast | Quiz lover",
  "📚 Forever learning | Knowledge seeker",
  "🎯 Trivia master in the making",
  "🧩 Curious mind | Puzzle solver",
  "🌟 Exploring the world of knowledge",
];

const getRandomDefaultBio = () => {
  return DEFAULT_BIOS[Math.floor(Math.random() * DEFAULT_BIOS.length)];
};

export const authService = {
  signUp: async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            bio: getRandomDefaultBio(),
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // ✅ Assign random avatar on signup
        const randomAvatar = getRandomAvatar();
        
        const { error: profileError } = await supabase.from("users").upsert({
          id: data.user.id,
          name: name || email.split("@")[0],
          email: email,
          bio: getRandomDefaultBio(),
          avatar_id: randomAvatar.id,
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

  // ... rest of your authService functions
};

export default authService;
