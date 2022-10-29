import { DomainError } from "./domain-error";
import { ResponseCode } from "./response-code.enum";

export class DuplicateShippingPriceError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ResponseCode.CONFLICT;
        const message = 'Duplicate ShippingPrice Error: profile already exists!';
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

export class ShippingPriceFormatError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ResponseCode.BAD_REQUEST;
        const message = 'ShippingPrice Format Error: This error is caused when you attempt to enter a badly formatted attribute.';
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

export class ShippingPriceNotFoundError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ResponseCode.BAD_REQUEST;
        const message = 'ShippingPrice not found: could not find the indicated ShippingPrice.';
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