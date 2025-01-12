export class BaseApplicationError extends Error {
  type: string;
  message: string;
  code?: number;
  metadata?: any;

  constructor(message: string, code?: number, metadata?: any) {
    super(message); // Initialize base Error class with the message
    this.type = new.target.name;
    this.message = message;
    this.code = code;
    this.metadata = metadata;

    // Ensure the stack trace is captured correctly (if supported)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseApplicationError);
    }

    // Correct the prototype chain so instanceof works properly
    Object.setPrototypeOf(this, new.target.prototype);
  }
}