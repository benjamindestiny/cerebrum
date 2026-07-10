// src/services/questionCache.js

// Simple in-memory cache for questions
const cache = new Map();
const MAX_CACHE_SIZE = 50; // Limit to prevent memory issues

export const getCachedQuestions = (category, count) => {
  const key = `${category}-${count}`;
  const cached = cache.get(key);
  
  if (cached) {
    const { questions, timestamp } = cached;
    // Cache expires after 1 hour
    if (Date.now() - timestamp < 3600000) {
      console.log(`✅ Cache hit for ${category}`);
      return questions;
    }
    // Expired, remove from cache
    cache.delete(key);
  }
  return null;
};

export const setCachedQuestions = (category, count, questions) => {
  const key = `${category}-${count}`;
  
  // Limit cache size
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  
  cache.set(key, {
    questions,
    timestamp: Date.now()
  });
};

export const clearCache = () => {
  cache.clear();
};

export default {
  getCachedQuestions,
  setCachedQuestions,
  clearCache
};