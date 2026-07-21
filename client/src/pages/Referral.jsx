import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Users,
  Share2,
  Copy,
  Check,
  Award,
  TrendingUp,
  Sparkles,
  Brain,
  Heart,
  MessageCircle,
  Loader2,
  ChevronRight,
  Zap,
  Target,
  UserPlus,
  Clock,
} from "lucide-react";
import { supabase } from "../services/supabase";

const Referral = () => {
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralHistory, setReferralHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState("");
  const [referredBy, setReferredBy] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await loadReferralData(user.id);
      }
    } catch (error) {
      console.error("Error getting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadReferralData = async (userId) => {
    try {
      // Get user's referral data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("referral_code, referral_count, referred_by")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      // Get or generate referral code
      let code = userData?.referral_code;
      if (!code) {
        code = generateReferralCode(userId);
        // Save the code to database
        await supabase
          .from("users")
          .update({ referral_code: code })
          .eq("id", userId);
      }

      setReferralCode(code);
      setReferralCount(userData?.referral_count || 0);
      setReferredBy(userData?.referred_by);

      // Generate referral link
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/auth?ref=${code}`);

      // Load referral history
      await loadReferralHistory(userId);
    } catch (error) {
      console.error("Error loading referral data:", error);
    }
  };

  const loadReferralHistory = async (userId) => {
    try {
      const { data: history, error: historyError } = await supabase
        .from("referrals")
        .select(
          `
          id,
          referred_user_id,
          status,
          created_at,
          referred_user:users!referred_user_id (
            name,
            email
          )
        `,
        )
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false });

      if (historyError) throw historyError;
      setReferralHistory(history || []);
    } catch (error) {
      console.error("Error loading referral history:", error);
    }
  };

  const generateReferralCode = (userId) => {
    // Generate a unique referral code
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Cerebrum - Brain Training Platform",
          text: "🧠 Challenge your mind with quizzes, riddles, and personality tests! Use my referral link to get started:",
          url: referralLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 md:p-8 mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-8 h-8 text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Refer & Earn</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Share Cerebrum with friends and earn rewards for every new player who
          joins!
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="glass-card p-5 text-center"
        >
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-white">{referralCount}</div>
          <div className="text-xs text-gray-400">People Referred</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="glass-card p-5 text-center"
        >
          <Award className="w-6 h-6 text-amber-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-white">
            {referralCount >= 5
              ? "🏆"
              : referralCount >= 3
                ? "⭐"
                : referralCount >= 1
                  ? "🌱"
                  : "🌱"}
          </div>
          <div className="text-xs text-gray-400">
            {referralCount >= 5
              ? "Master Referrer"
              : referralCount >= 3
                ? "Top Referrer"
                : referralCount >= 1
                  ? "First Referral"
                  : "Start Referring"}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass-card p-5 text-center"
        >
          <UserPlus className="w-6 h-6 text-green-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-white">
            {referredBy ? "✅" : "—"}
          </div>
          <div className="text-xs text-gray-400">
            {referredBy ? "Referred by someone" : "Not referred"}
          </div>
        </motion.div>
      </div>

      {/* Referral Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="glass-card p-6 md:p-8 mb-6 border border-amber-500/20 bg-amber-500/5"
      >
        <div className="mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Your Referral Link
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Share this link with friends and earn rewards!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-black/30 rounded-lg px-4 py-3 border border-white/10">
            <code className="text-sm text-gray-300 break-all">
              {referralLink}
            </code>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </button>
            <button
              onClick={shareReferral}
              className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="glass-card p-6 md:p-8 mb-6"
      >
        <h3 className="text-white font-semibold mb-4">What You Get</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <Brain className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white text-sm font-medium">
                Bonus Quiz Access
              </p>
              <p className="text-gray-400 text-xs">
                Get exclusive quizzes for each referral
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white text-sm font-medium">
                Rank Points Boost
              </p>
              <p className="text-gray-400 text-xs">
                Extra points toward leaderboard ranking
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white text-sm font-medium">
                Achievement Badges
              </p>
              <p className="text-gray-400 text-xs">
                Special badges for reaching referral milestones
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white text-sm font-medium">Community Love</p>
              <p className="text-gray-400 text-xs">
                Help grow the Cerebrum community
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="glass-card p-6 md:p-8 mb-6"
      >
        <h3 className="text-white font-semibold mb-4">Referral Milestones</h3>
        <div className="space-y-3">
          {[
            {
              count: 1,
              label: "First Referral",
              icon: "🌱",
              reward: "Exclusive Quiz",
            },
            {
              count: 3,
              label: "Top Referrer",
              icon: "⭐",
              reward: "Rank Boost + Badge",
            },
            {
              count: 5,
              label: "Master Referrer",
              icon: "🏆",
              reward: "All Access + Title",
            },
            { count: 10, label: "Legendary", icon: "👑", reward: "VIP Status" },
          ].map((milestone, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                referralCount >= milestone.count
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-white/5 opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{milestone.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">
                    {milestone.label}
                  </p>
                  <p className="text-gray-400 text-xs">{milestone.reward}</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {referralCount}/{milestone.count}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Referral History */}
      {referralHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass-card p-6 md:p-8 mb-6"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Referral History
          </h3>
          <div className="space-y-2">
            {referralHistory.map((referral, index) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-white text-sm">
                    {referral.referred_user?.name ||
                      referral.referred_user?.email?.split("@")[0] ||
                      "New User"}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {referral.status === "completed" ? "✅" : "⏳"}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">
                  {formatDate(referral.created_at)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cool Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="glass-card p-6 md:p-8 text-center border border-blue-500/20 bg-blue-500/5"
      >
        <div className="flex justify-center mb-3">
          <MessageCircle className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          Your referrals help us grow! 🚀
        </h3>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Every new player you bring in means more quizzes, more challenges, and
          a smarter community. Plus, you unlock exclusive content and boost your
          own brain journey.
        </p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
          <span>🎯 More quizzes</span>
          <span>🧠 More brain challenges</span>
          <span>🏆 Better ranking</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Referral;
