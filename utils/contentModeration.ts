// Content moderation utility for poll questions and options
// Blocks inappropriate, adult, or offensive content

const INAPPROPRIATE_KEYWORDS = [
  // Adult content
  'porn', 'sex', 'xxx', 'nsfw', 'nude', 'naked', 'explicit',
  // Hate speech
  'racist', 'nazi', 'hate', 'kill', 'death',
  // Profanity (common ones)
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell',
  'cock', 'dick', 'pussy', 'cunt',
  // Illegal activities
  'drug', 'cocaine', 'meth', 'heroin', 'illegal',
  'scam', 'fraud', 'steal',
  // Spam patterns
  'click here', 'buy now', 'free money', 'crypto giveaway',
  'airdrop', 'double your',
];

const INAPPROPRIATE_PATTERNS = [
  /\b(porn|sex|xxx|nsfw)\b/i,
  /\b(nazi|hitler|genocide)\b/i,
  /\b(fuck|shit|bitch|damn)\b/i,
  /\b(scam|fraud|ponzi)\b/i,
  /(click\s+here|buy\s+now)/i,
  /\d+x\s+your\s+(money|crypto)/i,
  /(free\s+(money|crypto|eth|btc))/i,
];

export interface ModerationResult {
  isAllowed: boolean;
  reason?: string;
  flaggedWords?: string[];
}

export const moderateContent = (text: string): ModerationResult => {
  const lowerText = text.toLowerCase().trim();

  // Check if empty or too short
  if (!lowerText || lowerText.length < 3) {
    return {
      isAllowed: false,
      reason: 'Content is too short. Please provide meaningful text.',
    };
  }

  // Check for spam (all caps with length > 20)
  if (text.length > 20 && text === text.toUpperCase() && /[A-Z]{10,}/.test(text)) {
    return {
      isAllowed: false,
      reason: 'Excessive use of capital letters is not allowed.',
    };
  }

  // Check for excessive special characters
  const specialCharCount = (text.match(/[!@#$%^&*()]/g) || []).length;
  if (specialCharCount > text.length * 0.3) {
    return {
      isAllowed: false,
      reason: 'Excessive use of special characters is not allowed.',
    };
  }

  // Check for inappropriate keywords
  const flaggedWords: string[] = [];
  for (const keyword of INAPPROPRIATE_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      flaggedWords.push(keyword);
    }
  }

  if (flaggedWords.length > 0) {
    return {
      isAllowed: false,
      reason: 'Content contains inappropriate or prohibited words.',
      flaggedWords,
    };
  }

  // Check for inappropriate patterns
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isAllowed: false,
        reason: 'Content violates community guidelines.',
      };
    }
  }

  // Check for URL spam
  const urlCount = (text.match(/https?:\/\//gi) || []).length;
  if (urlCount > 1) {
    return {
      isAllowed: false,
      reason: 'Multiple URLs are not allowed in polls.',
    };
  }

  return { isAllowed: true };
};

export const moderatePoll = (
  question: string,
  options: string[]
): ModerationResult => {
  // Check question
  const questionResult = moderateContent(question);
  if (!questionResult.isAllowed) {
    return questionResult;
  }

  // Check all options
  for (let i = 0; i < options.length; i++) {
    const optionResult = moderateContent(options[i]);
    if (!optionResult.isAllowed) {
      return {
        isAllowed: false,
        reason: `Option ${i + 1}: ${optionResult.reason}`,
        flaggedWords: optionResult.flaggedWords,
      };
    }
  }

  return { isAllowed: true };
};
