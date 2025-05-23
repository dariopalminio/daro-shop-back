import { DuplicateError, FormatError, NotFoundError } from "hexa-three-levels";


export class UserFormatError extends FormatError {
    constructor(detail?: string, data?: any) {
        const message = 'The User has a format error, some attribute is wrong';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class UserNotFoundError extends NotFoundError {
    constructor(detail?: string, data?: any) {
        const message = 'User not found: could not find the indicated user.';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class UserDuplicateError extends DuplicateError {
    constructor(detail?: string, data?: any) {
        const message = 'Duplicate User Error: Username already exists!';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};


