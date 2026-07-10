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
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-card p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-8 h-8 text-[#a78bfa]" />
          <h1 className="text-2xl font-bold text-white">Email Campaign</h1>
        </div>

        <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            This will send an email to ALL registered users.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Brevo free tier: 300 emails/day
          </p>
        </div>

        <button
          onClick={sendBulkEmail}
          disabled={loading}
          className="w-full py-3 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {loading ? "Sending..." : "Send Email to All Users"}
        </button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg border ${result.error ? "border-red-500/30 bg-red-500/10" : "border-green-500/30 bg-green-500/10"}`}
          >
            {result.error ? (
              <div className="flex items-start gap-2 text-red-400">
                <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{result.error}</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Sent successfully!</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div className="bg-white/5 p-2 rounded">
                    <p className="text-gray-400">Total Users</p>
                    <p className="text-white font-bold">
                      {result.totalUsers || 0}
                    </p>
                  </div>
                  <div className="bg-white/5 p-2 rounded">
                    <p className="text-gray-400">Sent</p>
                    <p className="text-green-400 font-bold">
                      {result.sentCount || 0}
                    </p>
                  </div>
                </div>
                {result.errors?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-red-400 text-sm">
                      Failed to send to {result.errors.length} users
                    </p>
                    <div className="max-h-40 overflow-y-auto mt-2 space-y-1">
                      {result.errors.map((err, i) => (
                        <div
                          key={i}
                          className="text-xs text-red-400/70 bg-red-500/5 p-1 rounded"
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
