import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Award,
  Sparkles,
  Loader2,
  RefreshCw,
  Zap,
  Brain,
  BookOpen,
  Target,
  Flame,
} from "lucide-react";
import { supabase } from "../../services/supabase";

const DailyMissions = ({ userId, onMissionComplete }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    points: 0,
    bonusEarned: false,
  });

  useEffect(() => {
    if (userId) {
      loadMissions();
    }
  }, [userId]);

  const loadMissions = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      // Get today's missions
      const { data: missionData, error: missionError } = await supabase
        .from("daily_missions")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today);

      if (missionError) throw missionError;

      // If no missions today, create them
      if (!missionData || missionData.length === 0) {
        await generateDailyMissions();
        return;
      }

      setMissions(missionData);

      // Calculate stats
      const completed = missionData.filter((m) => m.completed).length;
      const total = missionData.length;
      const points = missionData.reduce(
        (sum, m) => sum + (m.completed ? m.points_earned : 0),
        0,
      );

      setStats({
        completed,
        total,
        points,
        bonusEarned: completed === total && total > 0,
      });

      // Check if all missions completed
      if (completed === total && total > 0 && !stats.bonusEarned) {
        await handleAllMissionsComplete();
      }
    } catch (error) {
      console.error("Error loading missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyMissions = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Define missions
      const missionDefinitions = [
        {
          mission_type: "quiz",
          mission_data: { target: 2 },
          points_earned: 100,
          name: "Quiz Master",
          description: "Complete 2 quizzes",
          icon: "📝",
        },
        {
          mission_type: "riddle",
          mission_data: { target: 3 },
          points_earned: 75,
          name: "Riddle Solver",
          description: "Solve 3 riddles",
          icon: "🧩",
        },
        {
          mission_type: "read",
          mission_data: { target: 1 },
          points_earned: 50,
          name: "Knowledge Seeker",
          description: "Read & test 1 article",
          icon: "📖",
        },
        {
          mission_type: "score",
          mission_data: { target: 1 },
          points_earned: 100,
          name: "Perfect Score",
          description: "Score 80%+ on any quiz",
          icon: "🎯",
        },
      ];

      const missionsToInsert = missionDefinitions.map((def) => ({
        user_id: userId,
        mission_type: def.mission_type,
        mission_data: def.mission_data,
        date: today,
        points_earned: def.points_earned,
        completed: false,
        created_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from("daily_missions")
        .insert(missionsToInsert)
        .select();

      if (error) throw error;

      setMissions(data || []);
      setStats({
        completed: 0,
        total: data.length,
        points: 0,
        bonusEarned: false,
      });
    } catch (error) {
      console.error("Error generating missions:", error);
    }
  };

  const handleMissionComplete = async (missionId) => {
    try {
      const { data, error } = await supabase
        .from("daily_missions")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", missionId)
        .select();

      if (error) throw error;

      // Update local state
      const updatedMissions = missions.map((m) =>
        m.id === missionId ? { ...m, completed: true } : m,
      );
      setMissions(updatedMissions);

      const completed = updatedMissions.filter((m) => m.completed).length;
      const total = updatedMissions.length;
      const points = updatedMissions.reduce(
        (sum, m) => sum + (m.completed ? m.points_earned : 0),
        0,
      );

      setStats({ ...stats, completed, points });

      // Callback for parent
      if (onMissionComplete) {
        onMissionComplete({ missionId, completed, points });
      }

      // Check if all missions complete
      if (completed === total && total > 0) {
        await handleAllMissionsComplete();
      }
    } catch (error) {
      console.error("Error completing mission:", error);
    }
  };

  const handleAllMissionsComplete = async () => {
    // Bonus for completing all missions
    const bonusPoints = 50;
    try {
      // Update user stats with bonus
      const { data: userData } = await supabase
        .from("users")
        .select("stats")
        .eq("id", userId)
        .single();

      const currentStats = userData?.stats || {};
      const updatedStats = {
        ...currentStats,
        total_points: (currentStats.total_points || 0) + bonusPoints,
        missions_completed: (currentStats.missions_completed || 0) + 1,
        last_mission_completion: new Date().toISOString(),
      };

      await supabase
        .from("users")
        .update({ stats: updatedStats })
        .eq("id", userId);

      // Update local state
      setStats((prev) => ({
        ...prev,
        points: prev.points + bonusPoints,
        bonusEarned: true,
      }));
    } catch (error) {
      console.error("Error giving mission bonus:", error);
    }
  };

  const refreshMissions = async () => {
    setRefreshing(true);
    await loadMissions();
    setRefreshing(false);
  };

  const getMissionIcon = (type) => {
    const icons = {
      quiz: <Zap className="w-4 h-4 text-blue-400" />,
      riddle: <Brain className="w-4 h-4 text-purple-400" />,
      read: <BookOpen className="w-4 h-4 text-green-400" />,
      score: <Target className="w-4 h-4 text-yellow-400" />,
      streak: <Flame className="w-4 h-4 text-orange-400" />,
    };
    return icons[type] || <Sparkles className="w-4 h-4 text-gray-400" />;
  };

  const getMissionName = (type) => {
    const names = {
      quiz: "Quiz Master",
      riddle: "Riddle Solver",
      read: "Knowledge Seeker",
      score: "Perfect Score",
      streak: "Daily Streak",
    };
    return names[type] || type;
  };

  const getMissionDescription = (mission) => {
    const target = mission.mission_data?.target || 1;
    const descriptions = {
      quiz: `Complete ${target} quiz${target > 1 ? "zes" : ""}`,
      riddle: `Solve ${target} riddle${target > 1 ? "s" : ""}`,
      read: `Read & test ${target} article${target > 1 ? "s" : ""}`,
      score: `Get 80%+ on any quiz`,
      streak: `Complete ${target} missions today`,
    };
    return descriptions[mission.mission_type] || "Complete this mission";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-6 h-6 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Daily Missions</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {stats.completed}/{stats.total} complete
          </span>
          <button
            onClick={refreshMissions}
            disabled={refreshing}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-400 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full"
          />
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-2.5">
        {missions.map((mission, index) => {
          const isCompleted = mission.completed;

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isCompleted
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    !isCompleted && handleMissionComplete(mission.id)
                  }
                  disabled={isCompleted}
                  className={`flex-shrink-0 transition-all ${
                    isCompleted
                      ? "text-green-400"
                      : "text-gray-500 hover:text-[#7c3aed]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex items-center gap-2">
                  {getMissionIcon(mission.mission_type)}
                  <div>
                    <div className="text-sm text-white font-medium">
                      {getMissionName(mission.mission_type)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {getMissionDescription(mission)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-yellow-400">
                  +{mission.points_earned} pts
                </span>
                {isCompleted && (
                  <span className="text-[10px] text-green-400">✅</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>
            🎯 {stats.completed}/{stats.total} done
          </span>
          <span>⭐ +{stats.points} points today</span>
        </div>
        {stats.bonusEarned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-yellow-400 font-medium flex items-center gap-1"
          >
            <Award className="w-4 h-4" />
            All Complete! 🎉
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DailyMissions;
