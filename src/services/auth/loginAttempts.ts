interface LoginAttempt {
  timestamp: number;
  email: string;
}

class LoginAttemptTracker {
  private attempts: Map<string, LoginAttempt[]>;
  private readonly maxAttempts: number;
  private readonly timeWindow: number; // millisekunteina

  constructor(maxAttempts: number = 5, timeWindowMinutes: number = 15) {
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  private cleanupOldAttempts(email: string): void {
    const now = Date.now();
    const userAttempts = this.attempts.get(email) || [];
    const validAttempts = userAttempts.filter(
      attempt => now - attempt.timestamp < this.timeWindow
    );
    this.attempts.set(email, validAttempts);
  }

  public canAttemptLogin(email: string): boolean {
    this.cleanupOldAttempts(email);
    const userAttempts = this.attempts.get(email) || [];
    return userAttempts.length < this.maxAttempts;
  }

  public recordAttempt(email: string): void {
    this.cleanupOldAttempts(email);
    const userAttempts = this.attempts.get(email) || [];
    userAttempts.push({ timestamp: Date.now(), email });
    this.attempts.set(email, userAttempts);
  }

  public getRemainingAttempts(email: string): number {
    this.cleanupOldAttempts(email);
    const userAttempts = this.attempts.get(email) || [];
    return Math.max(0, this.maxAttempts - userAttempts.length);
  }

  public getTimeUntilReset(email: string): number {
    this.cleanupOldAttempts(email);
    const userAttempts = this.attempts.get(email) || [];
    if (userAttempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...userAttempts.map(a => a.timestamp));
    const resetTime = oldestAttempt + this.timeWindow;
    return Math.max(0, resetTime - Date.now());
  }
}

export const loginAttemptTracker = new LoginAttemptTracker(); 