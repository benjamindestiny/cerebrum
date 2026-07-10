import React, { useState } from "react";
import { generateQuestionsWithGroq } from "../services/groqService";

const TestGroq = () => {
  const [category, setCategory] = useState("General Knowledge");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateQuestionsWithGroq(category, count, "medium");
      setQuestions(result);
      console.log("Generated Questions:", result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Test Groq Quiz Generator
      </h1>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category..."
          className="flex-1 px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white"
        />
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 5)}
          min={1}
          max={20}
          className="w-20 px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">
            Generated {questions.length} Questions
          </h2>
          {questions.map((q, idx) => (
            <div key={idx} className="glass-card p-4">
              <p className="text-white font-medium">
                {idx + 1}. {q.question}
              </p>
              <div className="mt-2 space-y-1">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`text-sm ${opt === q.correct_answer ? "text-green-400" : "text-gray-400"}`}
                  >
                    {i + 1}. {opt} {opt === q.correct_answer && "✅"}
                  </div>
                ))}
              </div>
              {q.explanation && (
                <p className="mt-2 text-sm text-gray-400">💡 {q.explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestGroq;
