import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Send,
  Users,
  Loader2,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Settings,
  FileText,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { sendBulkEmail, emailTemplates } from "../services/emailService";
import { toast } from "react-toastify";

const AdminEmailTemplates = () => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState("all");
  const [customUsers, setCustomUsers] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("general");

  // Load templates from database
  useEffect(() => {
    loadTemplates();
    loadUsers();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading templates:", error);
        // Use default templates
        setTemplates(getDefaultTemplates());
      } else if (data && data.length > 0) {
        setTemplates(data);
      } else {
        setTemplates(getDefaultTemplates());
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      setTemplates(getDefaultTemplates());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTemplates = () => {
    return [
      {
        id: "welcome",
        name: "Welcome Email",
        subject: "🎉 Welcome to Cerebrum!",
        body: `
          <h1>Welcome to Cerebrum, {{name}}! 🧠</h1>
          <p>We're thrilled to have you join our community of learners.</p>
          <p>Here's what you can do:</p>
          <ul>
            <li>📝 Take quizzes on various topics</li>
            <li>🧩 Solve challenging riddles</li>
            <li>📚 Read educational articles</li>
            <li>🏆 Compete on the leaderboard</li>
          </ul>
          <p>Start your learning journey now!</p>
          <a href="{{site_url}}/categories" style="background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Start Learning
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Happy learning,<br>The Cerebrum Team
          </p>
        `,
        category: "welcome",
        variables: ["name", "site_url"],
      },
      {
        id: "quiz_results",
        name: "Quiz Results",
        subject: "📊 Your Quiz Results: {{category}}",
        body: `
          <h1>Quiz Results 🎯</h1>
          <p>Hi {{name}},</p>
          <p>You scored <strong>{{score}}%</strong> on the "{{category}}" quiz!</p>
          <p>You earned <strong>{{points}} points</strong>.</p>
          <p>Keep up the great work!</p>
          <a href="{{site_url}}/dashboard" style="background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            View Dashboard
          </a>
        `,
        category: "quiz",
        variables: ["name", "score", "category", "points", "site_url"],
      },
      {
        id: "achievement",
        name: "Achievement Unlocked",
        subject: "🏆 Achievement Unlocked: {{achievement}}",
        body: `
          <h1>🏆 Achievement Unlocked!</h1>
          <p>Congratulations {{name}}!</p>
          <p>You've earned the <strong>{{achievement}}</strong> achievement.</p>
          <p>Keep going to unlock more achievements!</p>
          <a href="{{site_url}}/profile" style="background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            View Profile
          </a>
        `,
        category: "achievement",
        variables: ["name", "achievement", "site_url"],
      },
      {
        id: "weekly_report",
        name: "Weekly Report",
        subject: "📈 Your Weekly Learning Report",
        body: `
          <h1>Weekly Learning Report 📈</h1>
          <p>Hi {{name}},</p>
          <p>Here's your weekly summary:</p>
          <ul>
            <li>📝 Quizzes taken: {{quizzes_taken}}</li>
            <li>✅ Average score: {{avg_score}}%</li>
            <li>🔥 Current streak: {{streak}} days</li>
            <li>🧩 Riddles solved: {{riddles_solved}}</li>
            <li>📚 Articles read: {{articles_read}}</li>
          </ul>
          <p>Keep up the great work!</p>
          <a href="{{site_url}}/dashboard" style="background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            View Dashboard
          </a>
        `,
        category: "report",
        variables: ["name", "quizzes_taken", "avg_score", "streak", "riddles_solved", "articles_read", "site_url"],
      },
      {
        id: "streak",
        name: "Streak Reminder",
        subject: "🔥 Don't Break Your Streak!",
        body: `
          <h1>🔥 You're on Fire!</h1>
          <p>Hi {{name}},</p>
          <p>You've had a <strong>{{streak}}-day streak</strong>!</p>
          <p>Don't break it now. Come take a quiz today!</p>
          <a href="{{site_url}}/categories" style="background: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">
            Take a Quiz
          </a>
        `,
        category: "streak",
        variables: ["name", "streak", "site_url"],
      },
    ];
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, stats, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading users:", error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setCategory(template.category || "general");
    setIsEditing(false);
    setPreviewMode(false);
  };

  const handleTemplateChange = (field, value) => {
    setSelectedTemplate({
      ...selectedTemplate,
      [field]: value,
    });
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      // Check if template exists
      const { data: existing } = await supabase
        .from("email_templates")
        .select("id")
        .eq("id", selectedTemplate.id)
        .maybeSingle();

      let result;
      if (existing) {
        // Update
        const { data, error } = await supabase
          .from("email_templates")
          .update({
            name: templateName,
            subject: selectedTemplate.subject,
            body: selectedTemplate.body,
            category: category,
            variables: selectedTemplate.variables || [],
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedTemplate.id)
          .select();

        if (error) throw error;
        result = data;
      } else {
        // Insert
        const { data, error } = await supabase
          .from("email_templates")
          .insert({
            id: selectedTemplate.id || `template_${Date.now()}`,
            name: templateName,
            subject: selectedTemplate.subject,
            body: selectedTemplate.body,
            category: category,
            variables: selectedTemplate.variables || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select();

        if (error) throw error;
        result = data;
      }

      toast.success("Template saved successfully! ✅");
      setIsEditing(false);
      loadTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedTemplate) return;

    setSending(true);
    try {
      let recipients = [];

      if (selectedUsers === "all") {
        recipients = users.map((u) => ({
          email: u.email,
          name: u.name || u.email?.split("@")[0] || "User",
          data: u,
        }));
      } else if (selectedUsers === "active") {
        // Users with at least 1 quiz
        const { data: activeUsers } = await supabase
          .from("quiz_results")
          .select("user_id")
          .group("user_id");

        const activeIds = activeUsers?.map((u) => u.user_id) || [];
        recipients = users
          .filter((u) => activeIds.includes(u.id))
          .map((u) => ({
            email: u.email,
            name: u.name || u.email?.split("@")[0] || "User",
            data: u,
          }));
      } else if (selectedUsers === "inactive") {
        const { data: activeUsers } = await supabase
          .from("quiz_results")
          .select("user_id")
          .group("user_id");

        const activeIds = activeUsers?.map((u) => u.user_id) || [];
        recipients = users
          .filter((u) => !activeIds.includes(u.id))
          .map((u) => ({
            email: u.email,
            name: u.name || u.email?.split("@")[0] || "User",
            data: u,
          }));
      } else if (selectedUsers === "custom") {
        const emails = customUsers
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e);
        recipients = emails.map((email) => ({
          email,
          name: email.split("@")[0],
          data: { email },
        }));
      }

      if (recipients.length === 0) {
        toast.error("No recipients found!");
        setSending(false);
        return;
      }

      const result = await sendBulkEmail({
        recipients,
        subject: selectedTemplate.subject,
        body: selectedTemplate.body,
        variables: selectedTemplate.variables || [],
      });

      toast.success(`Email sent to ${result.sent} recipients! ✅`);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email: " + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleTestEmail = async () => {
    if (!selectedTemplate || !testEmail) return;

    setSending(true);
    try {
      const result = await sendBulkEmail({
        recipients: [{ email: testEmail, name: "Test User", data: {} }],
        subject: selectedTemplate.subject + " (TEST)",
        body: selectedTemplate.body,
        variables: selectedTemplate.variables || [],
      });

      toast.success(`Test email sent to ${testEmail} ✅`);
      setShowTestModal(false);
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email: " + error.message);
    } finally {
      setSending(false);
    }
  };

  const renderPreview = () => {
    if (!selectedTemplate) return null;

    let previewBody = selectedTemplate.body;
    // Replace variables with sample data
    const sampleData = {
      name: "John Doe",
      site_url: "https://cerebrum.app",
      score: "85",
      category: "General Knowledge",
      points: "25",
      achievement: "Quiz Master",
      quizzes_taken: "12",
      avg_score: "78",
      streak: "7",
      riddles_solved: "15",
      articles_read: "8",
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      previewBody = previewBody.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    return previewBody;
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-7 h-7 text-[#7c3aed]" />
            Email Templates
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and customize email templates
          </p>
        </div>
        <button
          onClick={loadTemplates}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Templates
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                    selectedTemplate?.id === template.id
                      ? "bg-[#7c3aed]/20 border border-[#7c3aed] text-white"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      {template.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                      {template.category || "general"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Users Stats */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              Users
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{users.length}</div>
                <div className="text-[10px] text-gray-400">Total Users</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-400">
                  {users.filter((u) => u.stats?.total_quizzes > 0).length}
                </div>
                <div className="text-[10px] text-gray-400">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">
                    {isEditing ? "Editing" : "Viewing"}: {selectedTemplate.name}
                  </h3>
                  {selectedTemplate.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                      {selectedTemplate.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setPreviewMode(false);
                        }}
                        className="px-3 py-1.5 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center gap-1"
                      >
                        {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {previewMode ? "Hide Preview" : "Preview"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          loadTemplates();
                        }}
                        className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                      <button
                        onClick={handleSaveTemplate}
                        disabled={loading}
                        className="px-3 py-1.5 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-1"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white focus:border-[#7c3aed] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white focus:border-[#7c3aed] focus:outline-none"
                    >
                      <option value="general">General</option>
                      <option value="welcome">Welcome</option>
                      <option value="quiz">Quiz</option>
                      <option value="achievement">Achievement</option>
                      <option value="report">Report</option>
                      <option value="streak">Streak</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={selectedTemplate.subject}
                      onChange={(e) =>
                        handleTemplateChange("subject", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white focus:border-[#7c3aed] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">
                      HTML Body
                      <span className="text-xs text-gray-500 ml-2">
                        Use {{variable}} for dynamic content
                      </span>
                    </label>
                    <textarea
                      value={selectedTemplate.body}
                      onChange={(e) =>
                        handleTemplateChange("body", e.target.value)
                      }
                      rows={12}
                      className="w-full px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white focus:border-[#7c3aed] focus:outline-none font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">
                      Available Variables
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables?.map((varName) => (
                        <span
                          key={varName}
                          className="text-xs px-2 py-1 bg-[#7c3aed]/20 text-[#a78bfa] rounded-lg"
                        >
                          {`{{${varName}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : previewMode ? (
                <div
                  className="prose prose-invert max-w-none p-4 bg-white/5 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: renderPreview() }}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">
                      Subject
                    </label>
                    <div className="px-4 py-2 bg-white/5 rounded-lg text-white">
                      {selectedTemplate.subject}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">
                      Body
                    </label>
                    <div
                      className="p-4 bg-white/5 rounded-lg max-h-[400px] overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: renderPreview() }}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">
                      Variables Used
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables?.map((varName) => (
                        <span
                          key={varName}
                          className="text-xs px-2 py-1 bg-[#7c3aed]/20 text-[#a78bfa] rounded-lg"
                        >
                          {`{{${varName}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Send Email Section */}
              {!isEditing && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#7c3aed]" />
                    Send Email
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">
                        Recipients
                      </label>
                      <select
                        value={selectedUsers}
                        onChange={(e) => setSelectedUsers(e.target.value)}
                        className="w-full px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white focus:border-[#7c3aed] focus:outline-none"
                      >
                        <option value="all">All Users ({users.length})</option>
                        <option value="active">Active Users</option>
                        <option value="inactive">Inactive Users</option>
                        <option value="custom">Custom Emails</option>
                      </select>
                    </div>

                    {selectedUsers === "custom" && (
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">
                          Email Addresses (comma separated)
                        </label>
                        <textarea
                          value={customUsers}
                          onChange={(e) => setCustomUsers(e.target.value)}
                          placeholder="user1@email.com, user2@email.com"
                          className="w-full px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white focus:border-[#7c3aed] focus:outline-none"
                          rows={2}
                        />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowTestModal(true)}
                        className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" /> Test Email
                      </button>
                      <button
                        onClick={handleSendEmail}
                        disabled={sending}
                        className="flex-1 px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {sending ? "Sending..." : "Send to All"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">
                Select a Template
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Choose a template from the list to edit or preview
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Test Email Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Send Test Email</h3>
              <button
                onClick={() => setShowTestModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@email.com"
                  className="w-full px-4 py-2 bg-[#2D2D5E] rounded-lg border border-white/10 text-white focus:border-[#7c3aed] focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTestEmail}
                  disabled={sending}
                  className="flex-1 px-4 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmailTemplates;