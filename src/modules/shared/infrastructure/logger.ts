export interface StructuredLog {
  job_id: string;
  trace_id: string;
  correlation_id: string;
  state: string;
  duration_ms: number;
  retry_count: number;
  memory_usage: string;
  queue_latency: string;
  error: string | null;
  message?: string;
}

export class PresenceLogger {
  private baseContext: Partial<StructuredLog>;

  constructor(context: Partial<StructuredLog>) {
    this.baseContext = context;
  }

  public info(message: string, contextOverrides?: Partial<StructuredLog>): void {
    this.log('INFO', message, contextOverrides);
  }

  public error(message: string, errorObj?: any, contextOverrides?: Partial<StructuredLog>): void {
    this.log('ERROR', message, { ...contextOverrides, error: errorObj?.message || String(errorObj) });
  }

  public warn(message: string, contextOverrides?: Partial<StructuredLog>): void {
    this.log('WARN', message, contextOverrides);
  }

  private log(level: string, message: string, contextOverrides?: Partial<StructuredLog>): void {
    const timestamp = new Date().toISOString();
    const finalLog: StructuredLog & { level: string; timestamp: string } = {
      level,
      timestamp,
      message,
      job_id: this.baseContext.job_id || '',
      trace_id: this.baseContext.trace_id || '',
      correlation_id: this.baseContext.correlation_id || '',
      state: this.baseContext.state || '',
      duration_ms: this.baseContext.duration_ms || 0,
      retry_count: this.baseContext.retry_count || 0,
      memory_usage: this.baseContext.memory_usage || this.getMemoryUsage(),
      queue_latency: this.baseContext.queue_latency || '',
      error: this.baseContext.error || null,
      ...contextOverrides,
    };

    // Use console for stdout capture, can be shipped to Datadog/ELK later
    if (level === 'ERROR') {
      console.error(JSON.stringify(finalLog));
    } else {
      console.log(JSON.stringify(finalLog));
    }
  }

  private getMemoryUsage(): string {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      return `${Math.round(used * 100) / 100} MB`;
    }
    return 'unknown';
  }
}
