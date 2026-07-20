import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Trophy,
  Check,
  X,
  BookOpen,
  Share,
  RefreshCw,
  Loader2,
  Award,
  ArrowLeft,
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  Star,
  Medal,
  ArrowRight,
} from "lucide-react";
import { supabase } from "../services/supabase";

const ReadAndTestResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadResults();
  }, []);

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadResults = () => {
    const storedResults = sessionStorage.getItem("readTestResults");

    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults);
        setResults(parsed);
      } catch (err) {
        console.error("Error parsing results:", err);
        setError("Failed to parse results data");
      }
    } else if (location.state) {
      setResults(location.state);
    } else {
      setError("No results found. Please complete a quiz first.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]  text-white border-[#2A2A4A]">
        <div className="text-center  text-white border-[#2A2A4A]">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#2A1535] animate-spin mx-auto mb-3 sm:mb-4  text-white border-[#2A2A4A]" />
          <p className="text-gray-400 text-sm sm:text-base  text-white border-[#2A2A4A]">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="text-center py-8 sm:py-12 max-w-md mx-auto px-4  text-white border-[#2A2A4A]">
        <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-600 mx-auto mb-3 sm:mb-4  text-white border-[#2A2A4A]" />
        <h2 className="text-xl sm:text-2xl font-bold text-white  text-white border-[#2A2A4A]">
          No Results Found
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mt-2  text-white border-[#2A2A4A]">
          {error ||
            "Complete a Read & Test quiz first to see your results here."}
        </p>
        <button
          onClick={() => navigate("/read-and-test")}
          className="btn-primary mt-4 sm:mt-6 flex items-center gap-2 mx-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3  text-white border-[#2A2A4A]"
        >
          <BookOpen className="w-4 h-4  text-white border-[#2A2A4A]" /> Browse Articles
        </button>
      </div>
    );
  }

  const {
    score,
    correct,
    total,
    questions,
    answers,
    title,
    category,
    subcategory,
    timeSpent,
    date,
    icon,
    articleId,
  } = results;

  const getGrade = () => {
    if (score >= 90)
      return {
        label: "Outstanding! 🏆",
        color: "text-teal-400",
        emoji: "🏆",
      };
    if (score >= 70)
      return { label: "Great Job! 🌟", color: "text-[#00C9A7]", emoji: "🌟" };
    if (score >= 50)
      return { label: "Good Effort! 💪", color: "text-[#2A1535]", emoji: "💪" };
    return { label: "Keep Learning! 📚", color: "text-gray-400", emoji: "📚" };
  };

  const grade = getGrade();

  const handleShare = () => {
    const shareText = `I scored ${score}% on "${title}" in the Read & Test section on Cerebrum! 🧠 Can you beat my score?`;

    if (navigator.share) {
      navigator
        .share({
          title: "My Read & Test Results",
          text: shareText,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          console.log("Results copied to clipboard!");
        })
        .catch(() => {});
    }
  };

  const handleRetry = () => {
    sessionStorage.removeItem("readTestResults");
    navigate("/read-and-test");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 pb-12  text-white border-[#2A2A4A]">
      <button
        onClick={() => navigate("/read-and-test")}
        className="text-gray-400  transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm  text-white border-[#2A2A4A]"
      >
        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4  text-white border-[#2A2A4A]" /> Back to Articles
      </button>

      <div
        
        
        
        className="glass-card p-5 sm:p-6 md:p-8 text-center  text-white border-[#2A2A4A]"
      >
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4  text-white border-[#2A2A4A]">
          <span className="text-2xl sm:text-3xl  text-white border-[#2A2A4A]">{icon || "📚"}</span>
          <span className="text-[10px] sm:text-xs md:text-sm text-[#2A1535]  text-white border-[#2A2A4A]">
            {category}
          </span>
          <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500  text-white border-[#2A2A4A]">
            • {subcategory}
          </span>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2  text-white border-[#2A2A4A]">
          {title}
        </h2>

        <div className="relative inline-block mb-4 sm:mb-6  text-white border-[#2A2A4A]">
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-8 border-white/10 flex items-center justify-center mx-auto  text-white border-[#2A2A4A]"
            
            
            
          >
            <div className="text-center  text-white border-[#2A2A4A]">
              <div
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white  text-white border-[#2A2A4A]"
                
                
                
              >
                {score}%
              </div>
              <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-400  text-white border-[#2A2A4A]">
                Score
              </div>
            </div>
          </div>
        </div>

        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-bold ${grade.color}`}
        >
          {grade.label}
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-1  text-white border-[#2A2A4A]">
          You got <span className="text-white font-bold  text-white border-[#2A2A4A]">{correct}</span> out of{" "}
          <span className="text-white font-bold  text-white border-[#2A2A4A]">{total}</span> questions
          correct
        </p>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6  text-white border-[#2A2A4A]">
          <div className="bg-white/5 rounded-lg p-2 sm:p-3 md:p-4  text-white border-[#2A2A4A]">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#00C9A7]  text-white border-[#2A2A4A]">
              {correct}
            </div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-400  text-white border-[#2A2A4A]">
              Correct
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 sm:p-3 md:p-4  text-white border-[#2A2A4A]">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-400  text-white border-[#2A2A4A]">
              {total - correct}
            </div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-400  text-white border-[#2A2A4A]">
              Incorrect
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 sm:p-3 md:p-4  text-white border-[#2A2A4A]">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white  text-white border-[#2A2A4A]">
              {total}
            </div>
            <div className="text-[8px] sm:text-[10px] md:text-xs text-gray-400  text-white border-[#2A2A4A]">
              Total
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-[8px] sm:text-[10px] md:text-xs text-gray-500  text-white border-[#2A2A4A]">
          <span className="flex items-center gap-1  text-white border-[#2A2A4A]">
            <Clock className="w-3 h-3  text-white border-[#2A2A4A]" />
            {timeSpent || 0} minutes
          </span>
          <span>•</span>
          <span>{date || new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6 md:mt-8 justify-center  text-white border-[#2A2A4A]">
          <button
            onClick={() => {
              sessionStorage.removeItem("readTestResults");
              navigate("/read-and-test");
            }}
            className="btn-primary flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3  text-white border-[#2A2A4A]"
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4  text-white border-[#2A2A4A]" /> More Articles
          </button>
          <button
            onClick={handleRetry}
            className="btn-secondary flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3  text-white border-[#2A2A4A]"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4  text-white border-[#2A2A4A]" /> Retry Quiz
          </button>
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3  text-white border-[#2A2A4A]"
          >
            <Share className="w-3 h-3 sm:w-4 sm:h-4  text-white border-[#2A2A4A]" /> Share
          </button>
        </div>
      </div>

      {questions && (
        <div
          
          
          
          className="glass-card p-4 sm:p-5 md:p-6  text-white border-[#2A2A4A]"
        >
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2  text-white border-[#2A2A4A]">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A1535]  text-white border-[#2A2A4A]" />
            Answer Review
          </h3>
          <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2  text-white border-[#2A2A4A]">
            {questions.map((q, index) => {
              const userAnswer = answers?.[index];
              const isCorrect = userAnswer === q.correct;

              return (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg border ${
                    isCorrect
                      ? "border-[#00C9A7]/30 bg-[#00C9A7]/5"
                      : "border-red-400/30 bg-red-400/5"
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3  text-white border-[#2A2A4A]">
                    <div className="mt-0.5 sm:mt-1  text-white border-[#2A2A4A]">
                      {isCorrect ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C9A7]  text-white border-[#2A2A4A]" />
                      ) : (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400  text-white border-[#2A2A4A]" />
                      )}
                    </div>
                    <div className="flex-1  text-white border-[#2A2A4A]">
                      <p className="text-white text-xs sm:text-sm md:text-base font-medium  text-white border-[#2A2A4A]">
                        {q.question}
                      </p>
                      <div className="mt-1 text-[10px] sm:text-xs md:text-sm  text-white border-[#2A2A4A]">
                        <span className="text-gray-400  text-white border-[#2A2A4A]">Your answer: </span>
                        <span
                          className={
                            isCorrect ? "text-[#00C9A7]" : "text-red-400"
                          }
                        >
                          {userAnswer !== undefined
                            ? q.options[userAnswer]
                            : "Not answered"}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-[10px] sm:text-xs md:text-sm mt-1  text-white border-[#2A2A4A]">
                          <span className="text-gray-400  text-white border-[#2A2A4A]">
                            Correct answer:{" "}
                          </span>
                          <span className="text-[#00C9A7]  text-white border-[#2A2A4A]">
                            {q.options[q.correct]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        
        
        
        className="glass-card p-4 sm:p-5 md:p-6  /10 /10 border border-blue-500/20  text-white border-[#2A2A4A]"
      >
        <div className="flex items-start gap-3 sm:gap-4  text-white border-[#2A2A4A]">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#2A1535] mt-1  text-white border-[#2A2A4A]" />
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base  text-white border-[#2A2A4A]">
              Recommended for You
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1  text-white border-[#2A2A4A]">
              {score >= 70
                ? "Great job! Try a more challenging article next time."
                : "Keep practicing! Try reading the article again or choose a similar topic."}
            </p>
            <button
              onClick={() => navigate("/read-and-test")}
              className="mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm text-[#2A1535] hover:text-[#3B82F6CC] transition-colors flex items-center gap-1  text-white border-[#2A2A4A]"
            >
              Browse more articles <ArrowRight className="w-3 h-3  text-white border-[#2A2A4A]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadAndTestResults;
