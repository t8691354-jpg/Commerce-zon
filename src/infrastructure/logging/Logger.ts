export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'AUDIT' | 'METRIC';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  meta?: Record<string, unknown>;
}

class EnterpriseLogger {
  private static instance: EnterpriseLogger;

  private constructor() {}

  public static getInstance(): EnterpriseLogger {
    if (!EnterpriseLogger.instance) {
      EnterpriseLogger.instance = new EnterpriseLogger();
    }
    return EnterpriseLogger.instance;
  }

  private formatLog(level: LogLevel, message: string, context?: string, meta?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      meta,
    };
  }

  private print(entry: LogEntry) {
    const formatted = `[${entry.timestamp}] [${entry.level}] ${entry.context ? `[${entry.context}] ` : ''}${entry.message}`;
    
    switch (entry.level) {
      case 'ERROR':
        console.error(formatted, entry.meta || '');
        break;
      case 'WARN':
        console.warn(formatted, entry.meta || '');
        break;
      case 'AUDIT':
        console.info(`🔒 AUDIT: ${formatted}`, entry.meta || '');
        break;
      case 'METRIC':
        console.info(`📊 METRIC: ${formatted}`, entry.meta || '');
        break;
      case 'DEBUG':
        console.debug(formatted, entry.meta || '');
        break;
      default:
        console.log(formatted, entry.meta || '');
        break;
    }
  }

  public info(message: string, context?: string, meta?: Record<string, unknown>) {
    this.print(this.formatLog('INFO', message, context, meta));
  }

  public warn(message: string, context?: string, meta?: Record<string, unknown>) {
    this.print(this.formatLog('WARN', message, context, meta));
  }

  public error(message: string, context?: string, meta?: Record<string, unknown>) {
    this.print(this.formatLog('ERROR', message, context, meta));
  }

  public audit(message: string, context?: string, meta?: Record<string, unknown>) {
    this.print(this.formatLog('AUDIT', message, context, meta));
  }

  public metric(message: string, context?: string, meta?: Record<string, unknown>) {
    this.print(this.formatLog('METRIC', message, context, meta));
  }

  public debug(message: string, context?: string, meta?: Record<string, unknown>) {
    this.print(this.formatLog('DEBUG', message, context, meta));
  }
}

export const logger = EnterpriseLogger.getInstance();
