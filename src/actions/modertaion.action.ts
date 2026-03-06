
/**
 * List of prohibited words that promote negativity, bullying, or harmful content
 * This list can be expanded based on your community guidelines
 */
const PROHIBITED_WORDS = [
  // Negative words
  'stupid', 'idiot', 'dumb', 'moron', 'fool', 'loser', 'pathetic','bad','worst',
  'worthless', 'useless', 'trash', 'garbage', 'rubbish', 'crap',
  
  // Bullying/harassment terms
  'hate', 'ugly', 'disgusting', 'gross', 'freak', 'weirdo',
  'creep', 'stalker', 'psycho', 'crazy', 'insane',
  
  // Offensive terms
  'shut up', 'kill yourself', 'kys', 'die', 'death',
  
  // Profanity (add more as needed)
  'damn', 'hell', 'bastard', 'bitch', 'ass', 'fuck', 
  'shit', 'dick', 'cock', 'pussy', 'asshole',
  
  // Slurs and derogatory terms (add carefully)
  'retard', 'retarded', 'gay' // when used as insult
];

/**
 * Checks if content contains prohibited words
 * Returns an object with validation result and found prohibited words
 */
export function moderateContent(content: string): {
  isValid: boolean;
  prohibitedWords: string[];
  message?: string;
} {
  if (!content || !content.trim()) {
    return { isValid: true, prohibitedWords: [] };
  }

  const normalizedContent = content.toLowerCase();
  const foundWords: string[] = [];

  // Check for each prohibited word
  for (const word of PROHIBITED_WORDS) {
    // Use word boundaries to match whole words only
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
    if (regex.test(normalizedContent)) {
      foundWords.push(word);
    }
  }

  if (foundWords.length > 0) {
    return {
      isValid: false,
      prohibitedWords: foundWords,
      message: `Your content contains words that don't align with our positive community values. Please rephrase your message.`
    };
  }

  return { isValid: true, prohibitedWords: [] };
}

/**
 * Alternative: Filter and replace prohibited words with asterisks
 * This can be used if you want to auto-sanitize content instead of rejecting it
 */
export function sanitizeContent(content: string): string {
  let sanitized = content;

  for (const word of PROHIBITED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '*'.repeat(word.length));
  }

  return sanitized;
}

/**
 * Get a user-friendly message about content moderation
 */
export function getModerationMessage(): string {
  return `We're building a positive and supportive community. Please ensure your posts and comments promote kindness and respect. Content with negative, vulgar, or bullying language will not be allowed.`;
}