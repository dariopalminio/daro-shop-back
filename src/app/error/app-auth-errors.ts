export class HeadersAuthorizationError extends Error {

    code: number; //the first step in handling errors is to provide a client with a proper status code.
    detail: string; //message more detailed of error with additional info
    data: any; //JSON object with more data
    //traslated?: string; //message traslated

    constructor(detail?: string) {
        super("The headers Authorization in HTTP Request has a format error.");
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        this.code = 400;
        this.detail = detail? detail : "Not authorized by the Auth Guard Middleware because no authorization data in Header.";
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    };

};

export class UnauthorizedJwtError extends Error {

    code: number; //the first step in handling errors is to provide a client with a proper status code.
    detail: string; //message more detailed of error with additional info
    data: any; //JSON object with more data
    //traslated?: string; //message traslated

    constructor(detail?: string) {
        super("Unauthorized, invalid JWT signature in HTTP headers.");
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        this.code = 401;
        this.detail = detail? detail : "Not authorized by the Auth Guard Middleware because invalid token.";
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    };

};