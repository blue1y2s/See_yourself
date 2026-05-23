import { PostCategory } from '../types';

const POSITIVE_WORDS = ['happy', 'good', 'great', 'love', 'excited', 'proud', 'achieved', 'won', 'success', 'beautiful', 'thanks', 'grateful', 'fun', 'joy', 'smile', 'laugh', '开心', '快乐', '棒', '爱', '兴奋', '骄傲', '成就', '成功', '美丽', '感恩', '感谢', '好', '喜', '笑', '顺'];
const NEGATIVE_WORDS = ['sad', 'bad', 'hate', 'angry', 'tired', 'fail', 'stupid', 'annoying', 'hurt', 'cry', 'worst', 'boring', 'stress', 'anxious', 'scared', 'pain', '伤心', '难过', '坏', '恨', '生气', '累', '失败', '愚蠢', '烦', '哭', '差', '无聊', '压力', '焦虑', '怕', '痛'];

const HEDGING_WORDS = ['maybe', 'i think', 'sort of', 'kind of', 'guess', 'probably', 'might', 'just', '也许', '可能', '大概', '觉得', '估计', '或许', '应该'];
const ABSOLUTE_WORDS = ['always', 'never', 'everyone', 'nobody', 'totally', 'completely', 'forever', '总是', '永远', '所有人', '没有人', '完全', '绝对'];
const SELF_DEPRECATION_WORDS = ['stupid', 'idiot', 'fail', 'useless', 'mess', 'trash', 'dumb', 'clown', '傻', '笨', '没用', '废物', '白痴', '垃圾'];

const CATEGORY_KEYWORDS: Record<PostCategory, string[]> = {
  rant: ['hate', 'annoying', 'stupid', 'worst', 'tired of', 'cant believe', 'angry', 'wtf', 'hell', '讨厌', '烦', '笨', '垃圾', '气死', '凭什么', '无语', '死', '糟', '累'],
  achievement: ['won', 'finished', 'completed', 'promotion', 'graduated', 'goal', 'finally', 'success', '赢', '完成', '结束', '升职', '毕业', '目标', '终于', '成功', '拿到', '达成'],
  relationship: ['friend', 'mom', 'dad', 'boyfriend', 'girlfriend', 'partner', 'husband', 'wife', 'family', 'parents', 'love', 'miss', 'we ', 'us ', '朋友', '妈', '爸', '男友', '女友', '对象', '老公', '老婆', '家人', '父母', '爱', '想念', '我们'],
  reflection: ['think', 'feel', 'wonder', 'maybe', 'realize', 'learned', 'understand', 'mind', 'life', '觉得', '想', '感觉', '也许', '意识到', '学习', '明白', '理解', '心', '生命', '人生'],
  daily: ['today', 'morning', 'coffee', 'gym', 'work', 'lunch', 'dinner', 'slept', 'traffic', 'weather', '今天', '早上', '咖啡', '慢跑', '工作', '午餐', '晚餐', '睡觉', '堵车', '天气', '日常'],
  other: []
};

/**
 * Calculates a sentiment score between -1 and 1
 */
function calculateSentiment(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Basic word count matching
  POSITIVE_WORDS.forEach(word => {
    if (lowerText.includes(word)) score += 0.3;
  });
  NEGATIVE_WORDS.forEach(word => {
    if (lowerText.includes(word)) score -= 0.3;
  });

  // Clamp between -1 and 1
  return Math.max(-1, Math.min(1, score));
}

/**
 * Calculates intensity based on length and punctuation
 */
function calculateIntensity(text: string): number {
  let intensity = 1;
  if (text.length > 50) intensity += 1;
  if (text.length > 100) intensity += 1;
  if (text.includes('!')) intensity += 1;
  if (text.includes('!!')) intensity += 1;
  return Math.min(5, intensity);
}

/**
 * Determines category based on keywords
 */
function determineCategory(text: string): PostCategory {
  const lowerText = text.toLowerCase();
  
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (cat === 'other') continue;
    if (keywords.some(k => lowerText.includes(k))) {
      return cat as PostCategory;
    }
  }
  return 'other'; // Default
}

export function analyzeTextRuleBased(text: string, index: number): {
  sentimentScore: number;
  intensity: number;
  category: PostCategory;
} {
  const sentimentScore = calculateSentiment(text);
  const intensity = calculateIntensity(text);
  const category = determineCategory(text);

  return { sentimentScore, intensity, category };
}

// --- Helpers for Phase 2 Insights ---

export function countHedgingWords(text: string): number {
  return HEDGING_WORDS.filter(w => text.toLowerCase().includes(w)).length;
}

export function countAbsolutes(text: string): number {
  return ABSOLUTE_WORDS.filter(w => text.toLowerCase().includes(w)).length;
}

export function countSelfDeprecation(text: string): number {
  return SELF_DEPRECATION_WORDS.filter(w => text.toLowerCase().includes(w)).length;
}
