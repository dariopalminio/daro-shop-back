import { DuplicateError, FormatError, NotFoundError } from "hexa-three-levels";


export class CategoryFormatError extends FormatError {
    constructor(detail?: string, data?: any) {
        const message = 'The category has a format error, some attribute is wrong';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class CategoryNotFoundError extends NotFoundError {
    constructor(detail?: string, data?: any) {
        const message = 'Category not found: could not find the indicated Category.';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class DuplicateCategoryError extends DuplicateError {
    constructor(detail?: string, data?: any) {
        const message = 'Duplicate Category Error: profile already exists!';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

