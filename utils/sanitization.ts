// Input sanitization and XSS protection
// Prevents injection attacks and malicious scripts

export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .trim();
};

export const sanitizeHTML = (html: string): string => {
  if (!html) return '';

  // Remove all HTML tags
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<link\b[^<]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim();
};

export const sanitizePollInput = (input: string): string => {
  let sanitized = sanitizeInput(input);

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  // Limit length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }

  // Remove excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
};

export const sanitizeQuestionInput = (input: string): string => {
  let sanitized = sanitizePollInput(input);

  // Remove SQL injection attempts
  const sqlPatterns = [
    /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bUNION\b|\bEXEC\b)/gi,
    /--/g,
    /\/\*/g,
    /\*\//g,
  ];

  for (const pattern of sqlPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }

  return sanitized;
};

export const isValidAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false;

  // Ethereum address validation
  const addressPattern = /^0x[a-fA-F0-9]{40}$/;
  return addressPattern.test(address);
};

export const sanitizeArray = (arr: string[]): string[] => {
  return arr
    .filter(item => item && typeof item === 'string')
    .map(item => sanitizePollInput(item))
    .filter(item => item.length > 0);
};

// Check for suspicious patterns
export const detectSuspiciousPatterns = (input: string): boolean => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
    /import\s*\(/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(input));
};

// Validate URL if present in input
export const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Extract and validate URLs from text
export const validateURLsInText = (text: string): boolean => {
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  const urls = text.match(urlPattern);

  if (!urls) return true;

  // Check each URL
  for (const url of urls) {
    if (!isValidURL(url)) return false;
  }

  return true;
};
