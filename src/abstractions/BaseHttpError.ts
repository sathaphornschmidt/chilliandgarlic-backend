export class BaseHttpError extends Error {
    statusCode: number;
    message: string;
    data?: any; // Optional: Can be used to store additional error data
  
    constructor(statusCode: number, message: string, data?: any) {
      super(message); // Pass the message to the base Error class
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      
      // Set the prototype explicitly when extending built-in Error
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  export class BadRequestError extends BaseHttpError {
    constructor(message = 'The request could not be understood or was missing required parameters.') {
        super(400, message);
    }
}

export class UnauthorizedError extends BaseHttpError {
    constructor(message = 'Authentication is required or has failed. Please provide valid credentials.') {
        super(401, message);
    }
}

export class ForbiddenError extends BaseHttpError {
    constructor(message = 'You do not have permission to access the requested resource.') {
        super(403, message);
    }
}

export class NotFoundError extends BaseHttpError {
    constructor(message = 'The requested resource could not be found. Please check the URL or resource ID.') {
        super(404, message);
    }
}

export class ConflictError extends BaseHttpError {
    constructor(message = 'The request could not be completed due to a conflict with the current state of the resource.') {
        super(409, message);
    }
}

export class InternalServerError extends BaseHttpError {
    constructor(message = 'An unexpected error occurred on the server. Please try again later or contact support.') {
        super(500, message);
    }
}