export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: Record<string, unknown>,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Requested resource not found', details?: Record<string, unknown>) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Invalid input parameters', details?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class BusinessError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 422, 'BUSINESS_RULE_VIOLATION', details);
  }
}

export class SecurityError extends AppError {
  constructor(message: string = 'Access denied or fraud alert triggered', details?: Record<string, unknown>) {
    super(message, 403, 'SECURITY_VIOLATION', details);
  }
}

export class AIProviderError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 502, 'AI_PROVIDER_ERROR', details);
  }
}
