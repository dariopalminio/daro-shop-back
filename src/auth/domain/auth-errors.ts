import { DomainError } from "hexa-three-levels";
import { ErrorCode } from "hexa-three-levels";

export class InvalidCredentialsError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ErrorCode.UNAUTHORIZED;
        const message = 'Invalid Credentials: unauthorized because username or password is incorrect';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    }
};

export class InvalidClientCredentialsError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ErrorCode.UNAUTHORIZED;
        const message = 'Invalid Client Credentials: unauthorized because client_id, client_secret or grant_type is incorrect';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    }
};


export class RefreshTokenMalformedError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ErrorCode.BAD_REQUEST;
        const message = 'Refresh Token Malformed Error. Missing or malformed data.';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    }
};

export class TokensCreationError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ErrorCode.BAD_REQUEST;
        const message = 'An error has occurred in token creation. Some data is wrong.';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    }
};

export class InvalidVerificationCodeError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ErrorCode.BAD_REQUEST;
        const message = 'Failed to check verification code.';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    }
};


//ConfirmationTimeExpiredError: Confirm time expired
//FailedLoginAttemptsError: failed login attempts happen when someone tries to log in the site using the wrong credentials by 3 attempts
//Unconfirmed account error
//RecoveryTimeExpired