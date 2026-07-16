import React, { useState } from "react";
import { Mail, Send, Users, Loader2, CheckCircle, XCircle } from "lucide-react";

const AdminEmail = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sendBulkEmail = async () => {
    const secret = prompt("Enter admin secret key:");
    if (!secret) return;

    if (!confirm("Send email to ALL users? This cannot be undone.")) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/send-bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6  text-white border-[#2A2A4A]">
      <div className="glass-card p-6 border border-white/5  text-white border-[#2A2A4A]">
        <div className="flex items-center gap-3 mb-6  text-white border-[#2A2A4A]">
          <Mail className="w-8 h-8 text-[#3B82F6CC]  text-white border-[#2A2A4A]" />
          <h1 className="text-2xl font-bold text-white  text-white border-[#2A2A4A]">Email Campaign</h1>
        </div>

        <div className="bg-teal-400/10 border border-teal-400/20 rounded-lg p-4 mb-6  text-white border-[#2A2A4A]">
          <p className="text-teal-400 text-sm flex items-center gap-2  text-white border-[#2A2A4A]">
            <Users className="w-4 h-4  text-white border-[#2A2A4A]" />
            This will send an email to ALL registered users.
          </p>
          <p className="text-gray-400 text-xs mt-1  text-white border-[#2A2A4A]">
            Brevo free tier: 300 emails/day
          </p>
        </div>

        <button
          onClick={sendBulkEmail}
          disabled={loading}
          className="w-full py-3 bg-blue-500 text-white rounded-lg  transition-colors flex items-center justify-center gap-2 disabled:opacity-50  text-white border-[#2A2A4A]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin  text-white border-[#2A2A4A]" />
          ) : (
            <Send className="w-5 h-5  text-white border-[#2A2A4A]" />
          )}
          {loading ? "Sending..." : "Send Email to All Users"}
        </button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg border ${result.error ? "border-red-500/30 bg-red-500/10" : "border-green-500/30 bg-green-500/10"}`}
          >
            {result.error ? (
              <div className="flex items-start gap-2 text-red-400  text-white border-[#2A2A4A]">
                <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0  text-white border-[#2A2A4A]" />
                <div>
                  <p className="font-medium  text-white border-[#2A2A4A]">Error</p>
                  <p className="text-sm  text-white border-[#2A2A4A]">{result.error}</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-green-400  text-white border-[#2A2A4A]">
                  <CheckCircle className="w-5 h-5  text-white border-[#2A2A4A]" />
                  <span className="font-medium  text-white border-[#2A2A4A]">Sent successfully!</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm  text-white border-[#2A2A4A]">
                  <div className="bg-white/5 p-2 rounded  text-white border-[#2A2A4A]">
                    <p className="text-gray-400  text-white border-[#2A2A4A]">Total Users</p>
                    <p className="text-white font-bold  text-white border-[#2A2A4A]">
                      {result.totalUsers || 0}
                    </p>
                  </div>
                  <div className="bg-white/5 p-2 rounded  text-white border-[#2A2A4A]">
                    <p className="text-gray-400  text-white border-[#2A2A4A]">Sent</p>
                    <p className="text-green-400 font-bold  text-white border-[#2A2A4A]">
                      {result.sentCount || 0}
                    </p>
                  </div>
                </div>
                {result.errors?.length > 0 && (
                  <div className="mt-3  text-white border-[#2A2A4A]">
                    <p className="text-red-400 text-sm  text-white border-[#2A2A4A]">
                      Failed to send to {result.errors.length} users
                    </p>
                    <div className="max-h-40 overflow-y-auto mt-2 space-y-1  text-white border-[#2A2A4A]">
                      {result.errors.map((err, i) => (
                        <div
                          key={i}
                          className="text-xs text-red-400/70 bg-red-500/5 p-1 rounded  text-white border-[#2A2A4A]"
                        >
                          {err.email}: {err.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmail;
