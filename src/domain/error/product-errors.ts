import { DomainError } from "./domain-error";
import { ResponseCode } from "./response-code.enum";

export class DuplicateProductError extends DomainError {

    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ResponseCode.CONFLICT;
        const message = 'Duplicate Product Error: product already exists!';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class DuplicateSkuError extends DomainError {

    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ResponseCode.CONFLICT;
        const message = 'Duplicate Product SKU Error: SKU already exists!';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class SkuGenerationError extends DomainError {

    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ResponseCode.BAD_REQUEST;
        const message = 'Some of the attributes needed to generate a SKU are empty or do not exist.';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};


