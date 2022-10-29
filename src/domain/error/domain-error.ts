export class DomainError extends Error {

  protected code: number; //the first step in handling errors is to provide a client with a proper status code.
  protected detail: string; //message more detailed of error with additional info
  protected data: any; //JSON object with more data
  //traslated?: string; //message traslated

  constructor(code: number, message: string, detail: string = '', data: any = null) {
    super(message);
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    this.code = code;
    this.data = data;
    //this.traslated = traslated;
    if (detail) this.detail = detail;
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    Error.captureStackTrace(this, this.constructor);
  };

  public getCode(): number {
    return this.code;
  };

  public getDetail(): string {
    return this.detail;
  };

  public getData(): any {
    return this.data;
  };

  public getName(): string {
    return this.name;
  };

  public getMessage(): string {
    return this.message;
  };

};