import crypto from 'crypto';

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 - 100
  errors: string[];
}

export class PasswordHasher {
  private static readonly ITERATIONS = 100000;
  private static readonly KEY_LENGTH = 64;
  private static readonly DIGEST = 'sha512';

  /**
   * Generates a cryptographically secure 32-byte salt
   */
  public static generateSalt(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hashes a plain password using PBKDF2-HMAC-SHA512
   */
  public static hashPassword(password: string, salt: string): string {
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      this.ITERATIONS,
      this.KEY_LENGTH,
      this.DIGEST
    );
    return hash.toString('hex');
  }

  /**
   * Verifies a password against stored salt and hash using timing-safe comparison
   */
  public static verifyPassword(password: string, salt: string, storedHash: string): boolean {
    const hashToVerify = this.hashPassword(password, salt);
    const bufA = Buffer.from(hashToVerify, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');

    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }

  /**
   * Enterprise Password Strength Evaluator (OWASP Criteria)
   */
  public static validatePasswordStrength(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let score = 0;

    if (!password || password.length < 10) {
      errors.push('Password must be at least 10 characters long.');
    } else {
      score += 25;
    }

    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      errors.push('Password must contain at least one uppercase letter (A-Z).');
    }

    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      errors.push('Password must contain at least one lowercase letter (a-z).');
    }

    if (/[0-9]/.test(password)) {
      score += 20;
    } else {
      errors.push('Password must contain at least one numerical digit (0-9).');
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 15;
    } else {
      errors.push('Password must contain at least one special character (!@#$%^&*).');
    }

    // Common weak password check
    const weakList = ['password', '12345678', 'admin123', 'commercezon', 'amazon123', 'qwertyuiop'];
    if (weakList.some((w) => password.toLowerCase().includes(w))) {
      errors.push('Password contains easily guessable dictionary words.');
      score = Math.max(0, score - 40);
    }

    return {
      isValid: errors.length === 0,
      score: Math.min(100, score),
      errors,
    };
  }
}
