import { DomainError, DuplicateError, FormatError, NotFoundError } from "hexa-three-levels";
import { ErrorCode } from "hexa-three-levels";

export class OrderFormatError extends FormatError {
    constructor(detail?: string, data?: any) {
        const message = 'The Order has a format error, some attribute is wrong';
        super(message, detail, data);
        // Ensure the name of this error is the same as the class name
        this.name = this.constructor.name;
        // This clips the constructor invocation from the stack trace.
        // It's not absolutely essential, but it does make the stack trace a little nicer.
        Error.captureStackTrace(this, this.constructor);
    }
};

export class OrderNotFoundError extends NotFoundError {
    constructor(detail?: string, data?: any) {
        const message = 'Order not found: could not find the indicated order.';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class OrderDuplicateError extends DuplicateError {
    constructor(detail?: string, data?: any) {
        const message = 'Duplicate Order Error: Order already exists!';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class OutOfStockError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ErrorCode.BAD_REQUEST;
        const message = 'There is no stock of the product';
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

