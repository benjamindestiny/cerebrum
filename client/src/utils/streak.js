// utils/streak.js — use this in BOTH places
export function calculateStreak(activityLog) {
  if (!activityLog || activityLog.length === 0) return 0
  
  const sorted = activityLog
    .map(log => new Date(log.date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a))
  
  let streak = 1
  let current = new Date(sorted[0])
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i])
    const diff = (current - prev) / (1000 * 60 * 60 * 24)
    
    if (diff === 1) {
      streak++
      current = prev
    } else if (diff > 1) {
      break
    }
  }
  
  return streak
}