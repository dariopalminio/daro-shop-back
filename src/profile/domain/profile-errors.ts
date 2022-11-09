import { DuplicateError, FormatError, NotFoundError } from "hexa-three-levels";


export class ProfileFormatError extends FormatError {
    constructor(detail?: string, data?: any) {
        const message = 'The Profile has a format error, some attribute is wrong';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ProfileNotFoundError extends NotFoundError {
    constructor(detail?: string, data?: any) {
        const message = 'Profile not found: could not find the indicated user profile.';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ProfileDuplicateError extends DuplicateError {
    constructor(detail?: string, data?: any) {
        const message = 'Duplicate User Profile Error: profile already exists!';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

