import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Coffee,
  Gift,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Zap,
  Sparkles,
  Users,
  Trophy,
  Brain,
} from "lucide-react";

const Donate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const donationAmounts = [
    { value: 5, label: "$5", emoji: "☕" },
    { value: 10, label: "$10", emoji: "🧠" },
    { value: 25, label: "$25", emoji: "⭐" },
    { value: 50, label: "$50", emoji: "🏆" },
    { value: 100, label: "$100", emoji: "👑" },
  ];

  const handleDonate = async () => {
    if (!selectedAmount && !customAmount) return;
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }, 2000);
  };

  // Donation page is ready but not linked anywhere yet
  // To enable: Uncomment the route in App.jsx

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Heart className="w-7 h-7 text-red-400" />
            Support Cerebrum
          </h1>
          <p className="text-gray-400 text-sm">
            Help us keep learning free and accessible for everyone
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Impact Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="glass-card p-3 text-center">
            <Users className="w-5 h-5 text-[#7c3aed] mx-auto mb-1" />
            <div className="text-lg font-bold text-white">23+</div>
            <div className="text-[10px] text-gray-400">Active Users</div>
          </div>
          <div className="glass-card p-3 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">50+</div>
            <div className="text-[10px] text-gray-400">Quizzes</div>
          </div>
          <div className="glass-card p-3 text-center">
            <Brain className="w-5 h-5 text-[#a78bfa] mx-auto mb-1" />
            <div className="text-lg font-bold text-white">100+</div>
            <div className="text-[10px] text-gray-400">Questions</div>
          </div>
        </div>

        {/* Main Donation Card */}
        <div className="glass-card p-6 border border-white/5">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-gradient-to-r from-[#7c3aed]/20 to-[#8B5CF6]/20 rounded-full mb-3">
              <Coffee className="w-8 h-8 text-[#a78bfa]" />
            </div>
            <h2 className="text-xl font-bold text-white">Buy Us a Coffee ☕</h2>
            <p className="text-gray-400 text-sm mt-1">
              Your support keeps Cerebrum running and improving
            </p>
          </div>

          {/* Amount Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-3">Choose an amount</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {donationAmounts.map((amount) => (
                <button
                  key={amount.value}
                  onClick={() => {
                    setSelectedAmount(amount.value);
                    setCustomAmount("");
                  }}
                  className={`p-3 rounded-lg transition-all ${
                    selectedAmount === amount.value
                      ? "bg-[#7c3aed]/20 border-2 border-[#7c3aed]"
                      : "bg-white/5 border border-white/10 hover:border-[#7c3aed]/50"
                  }`}
                >
                  <div className="text-xl">{amount.emoji}</div>
                  <div className="text-white font-semibold text-sm">
                    {amount.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">Or enter custom amount</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Donate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDonate}
            disabled={!selectedAmount && !customAmount}
            className={`w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-white font-medium ${
              selectedAmount || customAmount
                ? "bg-gradient-to-r from-[#7c3aed] to-[#8B5CF6] hover:shadow-lg hover:shadow-[#7c3aed]/30"
                : "bg-gray-700 cursor-not-allowed opacity-50"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                Thank You! 🎉
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Donate ${selectedAmount || customAmount || "0"}
              </>
            )}
          </motion.button>
        </div>

        {/* What Your Support Does */}
        <div className="glass-card p-4 border border-white/5">
          <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            What Your Support Does
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#00C9A7] mt-0.5" />
              <span className="text-gray-400">
                Keep Cerebrum completely free for all users
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#00C9A7] mt-0.5" />
              <span className="text-gray-400">
                Add new categories and questions regularly
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#00C9A7] mt-0.5" />
              <span className="text-gray-400">
                Improve the app with new features
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#00C9A7] mt-0.5" />
              <span className="text-gray-400">
                Cover server and infrastructure costs
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center text-xs text-gray-500">
          <p>Secure payments powered by Stripe</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span>💳 Credit Card</span>
            <span>🏦 Bank Transfer</span>
            <span>📱 Mobile Money</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
