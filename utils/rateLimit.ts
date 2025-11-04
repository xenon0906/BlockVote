// Rate limiting and DDoS protection utilities
// Prevents abuse and protects against attacks

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;
  private readonly maxBlockedAttempts: number;

  constructor(
    maxRequests: number = 10,
    windowMs: number = 60000, // 1 minute
    blockDurationMs: number = 300000, // 5 minutes
    maxBlockedAttempts: number = 3
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
    this.maxBlockedAttempts = maxBlockedAttempts;

    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 300000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime < now && (!entry.blocked || (entry.blockUntil && entry.blockUntil < now))) {
        this.limits.delete(key);
      }
    }
  }

  private getKey(identifier: string, action: string): string {
    return `${identifier}:${action}`;
  }

  public checkLimit(identifier: string, action: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    blocked?: boolean;
    blockUntil?: number;
  } {
    const key = this.getKey(identifier, action);
    const now = Date.now();
    const entry = this.limits.get(key);

    // Check if blocked
    if (entry?.blocked && entry.blockUntil && entry.blockUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        blocked: true,
        blockUntil: entry.blockUntil,
      };
    }

    // Reset if window expired
    if (!entry || entry.resetTime < now) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.windowMs,
        blocked: false,
      };
      this.limits.set(key, newEntry);
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: newEntry.resetTime,
      };
    }

    // Increment count
    entry.count++;

    // Block if exceeded max attempts
    if (entry.count > this.maxRequests + this.maxBlockedAttempts) {
      entry.blocked = true;
      entry.blockUntil = now + this.blockDurationMs;
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        blocked: true,
        blockUntil: entry.blockUntil,
      };
    }

    // Check if over limit
    if (entry.count > this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  public reset(identifier: string, action: string) {
    const key = this.getKey(identifier, action);
    this.limits.delete(key);
  }
}

// Create rate limiters for different actions
export const pollCreationLimiter = new RateLimiter(2, 3600000, 3600000); // 2 per hour, 1h block
export const votingLimiter = new RateLimiter(20, 60000, 300000); // 20 per minute, 5min block
export const pollLoadLimiter = new RateLimiter(60, 60000, 60000); // 60 per minute, 1min block

// Get client identifier (IP or wallet address)
export const getClientIdentifier = (walletAddress?: string): string => {
  if (walletAddress) return walletAddress.toLowerCase();

  // Fallback to browser fingerprint
  if (typeof window !== 'undefined') {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
    ].join('|');

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `browser_${hash}`;
  }

  return 'unknown';
};

// Format time remaining
export const formatTimeRemaining = (ms: number): string => {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.ceil(minutes / 60);
  return `${hours} hours`;
};
