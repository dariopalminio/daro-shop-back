import { DuplicateError, FormatError, NotFoundError } from "./domain-error";

export class PaymentMethodFormatError extends FormatError {
    constructor(detail?: string, data?: any) {
        const message = 'The Payment Method has a format error, some attribute is wrong';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class PaymentMethodNotFoundError extends NotFoundError {
    constructor(detail?: string, data?: any) {
        const message = 'Payment Method not found: could not find the indicated Payment Method.';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class PaymentMethodDuplicateError extends DuplicateError {
    constructor(detail?: string, data?: any) {
        const message = 'PaymentMethod Duplicate Error: PaymentMethod already exists!';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};