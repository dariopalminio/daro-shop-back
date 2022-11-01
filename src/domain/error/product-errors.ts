import { DomainError, DuplicateError, FormatError, NotFoundError } from "./domain-error";
import { ErrorCode } from "./error-code.enum";


export class ProductFormatError extends FormatError {
    constructor(detail?: string, data?: any) {
        const message = 'The Product has a format error, some attribute is wrong';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ProductNotFoundError extends NotFoundError {
    constructor(detail?: string, data?: any) {
        const message = 'Product not found: could not find the indicated product.';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ProductDuplicateError extends DuplicateError {
    constructor(detail?: string, data?: any) {
        const message = 'Duplicate Product Error: product already exists!';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class DuplicateSkuError extends DomainError {
    constructor(detail?: string, data?: any, code?: number) {
        const codeErr = code ? code : ErrorCode.CONFLICT;
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
        const codeErr = code ? code : ErrorCode.BAD_REQUEST;
        const message = 'Some of the attributes needed to generate a SKU are empty or do not exist.';
        const detailed = detail ? detail : message;
        const dat = data ? data : {};
        super(codeErr, message, detailed, dat);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};


