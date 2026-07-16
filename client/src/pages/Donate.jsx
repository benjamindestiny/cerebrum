import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="max-w-2xl mx-auto px-4 py-6 pb-12  text-white border-[#2A2A4A]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6  text-white border-[#2A2A4A]">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg /5 transition-colors  text-white border-[#2A2A4A]"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400  text-white border-[#2A2A4A]" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3  text-white border-[#2A2A4A]">
            <Heart className="w-7 h-7 text-red-400  text-white border-[#2A2A4A]" />
            Support Cerebrum
          </h1>
          <p className="text-gray-400 text-sm  text-white border-[#2A2A4A]">
            Help us keep learning free and accessible for everyone
          </p>
        </div>
      </div>

      <div className="space-y-6  text-white border-[#2A2A4A]">
        {/* Impact Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3  text-white border-[#2A2A4A]">
          <div className="glass-card p-3 text-center  text-white border-[#2A2A4A]">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-1  text-white border-[#2A2A4A]" />
            <div className="text-lg font-bold text-white  text-white border-[#2A2A4A]">23+</div>
            <div className="text-[10px] text-gray-400  text-white border-[#2A2A4A]">Active Users</div>
          </div>
          <div className="glass-card p-3 text-center  text-white border-[#2A2A4A]">
            <Trophy className="w-5 h-5 text-teal-400 mx-auto mb-1  text-white border-[#2A2A4A]" />
            <div className="text-lg font-bold text-white  text-white border-[#2A2A4A]">50+</div>
            <div className="text-[10px] text-gray-400  text-white border-[#2A2A4A]">Quizzes</div>
          </div>
          <div className="glass-card p-3 text-center  text-white border-[#2A2A4A]">
            <Brain className="w-5 h-5 text-[#3B82F6CC] mx-auto mb-1  text-white border-[#2A2A4A]" />
            <div className="text-lg font-bold text-white  text-white border-[#2A2A4A]">100+</div>
            <div className="text-[10px] text-gray-400  text-white border-[#2A2A4A]">Questions</div>
          </div>
        </div>

        {/* Main Donation Card */}
        <div className="glass-card p-6 border border-white/5  text-white border-[#2A2A4A]">
          <div className="text-center mb-6  text-white border-[#2A2A4A]">
            <div className="inline-block p-3  /20 /20 rounded-full mb-3  text-white border-[#2A2A4A]">
              <Coffee className="w-8 h-8 text-[#3B82F6CC]  text-white border-[#2A2A4A]" />
            </div>
            <h2 className="text-xl font-bold text-white  text-white border-[#2A2A4A]">Buy Us a Coffee ☕</h2>
            <p className="text-gray-400 text-sm mt-1  text-white border-[#2A2A4A]">
              Your support keeps Cerebrum running and improving
            </p>
          </div>

          {/* Amount Selection */}
          <div className="mb-4  text-white border-[#2A2A4A]">
            <p className="text-sm text-gray-400 mb-3  text-white border-[#2A2A4A]">Choose an amount</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2  text-white border-[#2A2A4A]">
              {donationAmounts.map((amount) => (
                <button
                  key={amount.value}
                  onClick={() => {
                    setSelectedAmount(amount.value);
                    setCustomAmount("");
                  }}
                  className={`p-3 rounded-lg transition-all ${
                    selectedAmount === amount.value
                      ? " border-2 border-blue-500"
                      : "bg-white/5 border border-white/10 hover:border-blue-500/50"
                  }`}
                >
                  <div className="text-xl  text-white border-[#2A2A4A]">{amount.emoji}</div>
                  <div className="text-white font-semibold text-sm  text-white border-[#2A2A4A]">
                    {amount.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6  text-white border-[#2A2A4A]">
            <p className="text-sm text-gray-400 mb-2  text-white border-[#2A2A4A]">Or enter custom amount</p>
            <div className="relative  text-white border-[#2A2A4A]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400  text-white border-[#2A2A4A]">
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
                className="w-full pl-8 pr-4 py-2 bg-[#262626] rounded-lg border border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-sm  text-white border-[#2A2A4A]"
              />
            </div>
          </div>

          {/* Donate Button */}
          <button
            
            
            onClick={handleDonate}
            disabled={!selectedAmount && !customAmount}
            className={`w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-white font-medium ${
              selectedAmount || customAmount
                ? "   hover:shadow-lg hover:shadow-blue-500/30"
                : "bg-gray-700 cursor-not-allowed opacity-50"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin  text-white border-[#2A2A4A]" />
                Processing...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400  text-white border-[#2A2A4A]" />
                Thank You! 🎉
              </>
            ) : (
              <>
                <Heart className="w-5 h-5  text-white border-[#2A2A4A]" />
                Donate ${selectedAmount || customAmount || "0"}
              </>
            )}
          </button>
        </div>

        {/* What Your Support Does */}
        <div className="glass-card p-4 border border-white/5  text-white border-[#2A2A4A]">
          <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2  text-white border-[#2A2A4A]">
            <Sparkles className="w-4 h-4 text-teal-400  text-white border-[#2A2A4A]" />
            What Your Support Does
          </h3>
          <div className="space-y-2 text-sm  text-white border-[#2A2A4A]">
            <div className="flex items-start gap-3  text-white border-[#2A2A4A]">
              <CheckCircle className="w-4 h-4 text-[#00C9A7] mt-0.5  text-white border-[#2A2A4A]" />
              <span className="text-gray-400  text-white border-[#2A2A4A]">
                Keep Cerebrum completely free for all users
              </span>
            </div>
            <div className="flex items-start gap-3  text-white border-[#2A2A4A]">
              <CheckCircle className="w-4 h-4 text-[#00C9A7] mt-0.5  text-white border-[#2A2A4A]" />
              <span className="text-gray-400  text-white border-[#2A2A4A]">
                Add new categories and questions regularly
              </span>
            </div>
            <div className="flex items-start gap-3  text-white border-[#2A2A4A]">
              <CheckCircle className="w-4 h-4 text-[#00C9A7] mt-0.5  text-white border-[#2A2A4A]" />
              <span className="text-gray-400  text-white border-[#2A2A4A]">
                Improve the app with new features
              </span>
            </div>
            <div className="flex items-start gap-3  text-white border-[#2A2A4A]">
              <CheckCircle className="w-4 h-4 text-[#00C9A7] mt-0.5  text-white border-[#2A2A4A]" />
              <span className="text-gray-400  text-white border-[#2A2A4A]">
                Cover server and infrastructure costs
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center text-xs text-gray-500  text-white border-[#2A2A4A]">
          <p>Secure payments powered by Stripe</p>
          <div className="flex items-center justify-center gap-4 mt-2  text-white border-[#2A2A4A]">
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
