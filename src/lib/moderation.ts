/**
 * Banaras Darshan Content Moderation Pipeline
 * 
 * Pipeline:
 * USER MESSAGE -> LEXICAL & SLUR CHECK -> SPAM/SCAM CHECK -> TRAVELER SAFETY CHECK -> TRIAGE (APPROVE / HOLD / REJECT)
 */

export interface ModerationResult {
  isSafe: boolean;
  action: "APPROVE" | "HOLD_FOR_REVIEW" | "REJECT";
  category: "NONE" | "VULGAR" | "ABUSE" | "HARASSMENT" | "SPAM" | "SCAM" | "HATE" | "UNSAFE";
  score: number; // 0.0 (clean) to 1.0 (severe violation)
  reason?: string;
  matchedKeywords?: string[];
}

// Lexical keywords and patterns for abusive/vulgar English and Romanized Hindi/Bhojpuri terms
const PROFANITY_PATTERNS = [
  /\b(chutiya|bhosdike|madarchod|behenchod|gandu|harami|bhenchod|mc|bc|gaand|randi|kutta|saale)\b/i,
  /\b(fuck|shit|bitch|asshole|bastard|dick|pussy|slut|whore|motherfucker)\b/i,
  /\b(scammer|chor|lootere)\b/i,
];

const HATE_SPEECH_PATTERNS = [
  /\b(kill|death to|terrorist|hate all|destroy all|subhuman)\b/i,
];

const SPAM_PATTERNS = [
  /(\+?91[\-\s]?)?[6789]\d{9}/, // Indian phone number dropping in public chat
  /\b(free money|crypto investment|guaranteed profit|earn \$\d+|whatsapp me on|telegram link|t\.me\/|bit\.ly|tinyurl\.com)\b/i,
  /(.)\1{6,}/, // Excessive repeated characters e.g. "aaaaaaa"
];

const UNSAFE_TRAVEL_PATTERNS = [
  /\b(jump in deep ganga|night swimming alone|fake tickets|bribe the priest|sneak inside sanctum|bypass security)\b/i,
];

export function evaluateMessageContent(content: string): ModerationResult {
  const trimmed = content.trim();

  // 1. Length validation
  if (trimmed.length < 2) {
    return {
      isSafe: false,
      action: "REJECT",
      category: "SPAM",
      score: 0.9,
      reason: "Message is too short to be meaningful.",
    };
  }

  if (trimmed.length > 2000) {
    return {
      isSafe: false,
      action: "REJECT",
      category: "SPAM",
      score: 0.8,
      reason: "Message exceeds maximum allowed length of 2000 characters.",
    };
  }

  // 2. Severe Profanity / Abuse Check
  for (const pattern of PROFANITY_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        isSafe: false,
        action: "REJECT",
        category: "VULGAR",
        score: 0.95,
        reason: "Message contains offensive, vulgar, or abusive language.",
        matchedKeywords: [match[0]],
      };
    }
  }

  // 3. Hate Speech Check
  for (const pattern of HATE_SPEECH_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        isSafe: false,
        action: "REJECT",
        category: "HATE",
        score: 1.0,
        reason: "Message contains prohibited hate speech or threat indicators.",
        matchedKeywords: [match[0]],
      };
    }
  }

  // 4. Spam / Scam / Phone Number Harassment Check
  for (const pattern of SPAM_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        isSafe: false,
        action: "HOLD_FOR_REVIEW",
        category: "SPAM",
        score: 0.75,
        reason: "Contains potential advertising, phone numbers, or promotional links. Held for moderator review to safeguard travelers.",
        matchedKeywords: [match[0]],
      };
    }
  }

  // 5. Unsafe Traveler Activities Check
  for (const pattern of UNSAFE_TRAVEL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        isSafe: false,
        action: "HOLD_FOR_REVIEW",
        category: "UNSAFE",
        score: 0.7,
        reason: "Mentions potentially hazardous river activities or security bypass. Held for safety team review.",
        matchedKeywords: [match[0]],
      };
    }
  }

  // Clean and Approved
  return {
    isSafe: true,
    action: "APPROVE",
    category: "NONE",
    score: 0.0,
  };
}
