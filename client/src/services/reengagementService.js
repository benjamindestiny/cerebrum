import { supabase } from './supabase';
import { sendEmail } from './emailService';
import { emailTemplates } from './emailTemplates';

// Get all users
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, stats, created_at');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get inactive users (haven't played in 7+ days)
export const getInactiveUsers = async (days = 7) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, stats')
      .or(`stats->>last_quiz_date is null, stats->>last_quiz_date < '${cutoffDate.toISOString()}'`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching inactive users:', error);
    return [];
  }
};

// Get users with no activity (never took a quiz)
export const getNewUsersNoActivity = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, stats')
      .filter('stats->>total_quizzes', 'eq', '0');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching new users:', error);
    return [];
  }
};

// Send re-engagement email to a user
export const sendReengagementEmail = async (user, type = 'missYou') => {
  try {
    const name = user.name || user.email?.split('@')[0] || 'Learner';
    const stats = user.stats || {};
    const streak = stats.streak || 0;
    const points = stats.total_points || 0;

    let template;
    switch (type) {
      case 'missYou':
        template = emailTemplates.weMissYou(name, streak, points);
        break;
      case 'newFeatures':
        template = emailTemplates.newFeatures(name);
        break;
      case 'comeback':
        template = emailTemplates.comebackChallenge(name);
        break;
      case 'simple':
      default:
        template = emailTemplates.simpleMissYou(name);
        break;
    }

    const result = await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    // Log the email sent
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email: user.email,
      template_type: type,
      sent_at: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
    return { success: false, error: error.message };
  }
};

// Send bulk re-engagement emails
export const sendBulkReengagement = async (users, type = 'missYou', batchSize = 50) => {
  const results = [];
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    const promises = batch.map(async (user) => {
      const result = await sendReengagementEmail(user, type);
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
      return result;
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);

    // Delay between batches to avoid rate limits
    if (i + batchSize < users.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return {
    total: users.length,
    sent,
    failed,
    results,
  };
};

// Send "We Miss You" to all users
export const sendMissYouToAll = async () => {
  const users = await getAllUsers();
  return sendBulkReengagement(users, 'missYou');
};

// Send "We Miss You" to inactive users
export const sendMissYouToInactive = async (days = 7) => {
  const users = await getInactiveUsers(days);
  if (users.length === 0) {
    return { total: 0, sent: 0, failed: 0, message: 'No inactive users found' };
  }
  return sendBulkReengagement(users, 'missYou');
};

// Send "Come Back Challenge" to users
export const sendComebackChallenge = async () => {
  const users = await getInactiveUsers(3);
  if (users.length === 0) {
    return { total: 0, sent: 0, failed: 0, message: 'No users found for challenge' };
  }
  return sendBulkReengagement(users, 'comeback');
};

// Send "New Features" announcement
export const sendNewFeaturesAnnouncement = async () => {
  const users = await getAllUsers();
  return sendBulkReengagement(users, 'newFeatures');
};

export default {
  getAllUsers,
  getInactiveUsers,
  getNewUsersNoActivity,
  sendReengagementEmail,
  sendBulkReengagement,
  sendMissYouToAll,
  sendMissYouToInactive,
  sendComebackChallenge,
  sendNewFeaturesAnnouncement,
};
