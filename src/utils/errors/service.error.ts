export class ServiceError extends Error {
  service: string;
  message: string;
  reason: Error | undefined;

  constructor(service: string, message: string, reason?: Error) {
    super(`(${service}) - ${message}: ${reason ? reason.message : ''}`);
    this.service = service;
    this.reason = reason;
    this.stack = reason?.stack;
  }
}
