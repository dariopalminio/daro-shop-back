export class DomainError extends Error {

  code: number;
  data: any;

    constructor(code: number, message: string, data: any) {
      super(message);
     // Ensure the name of this error is the same as the class name
      this.name = this.constructor.name;
      this.code = code;
      this.data = data;
     // This clips the constructor invocation from the stack trace.
     // It's not absolutely essential, but it does make the stack trace a little nicer.
      Error.captureStackTrace(this, this.constructor);
    }
    
  };