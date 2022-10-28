export class DomainError extends Error {

  code: number; //the first step in handling errors is to provide a client with a proper status code.
  detail?: string; //message more detailed of error with additional info
  data: any; //JSON object with more data
  traslated?: string; //message traslated

  constructor(code: number, message: string, data: any = null, detail: string = '', traslated: string = '') {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.code = code;
    this.data = data;
    this.traslated = traslated;
    if (detail) this.detail = detail;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    Error.captureStackTrace(this, this.constructor);
  }

};