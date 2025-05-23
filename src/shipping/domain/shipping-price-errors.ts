import { DuplicateError, FormatError, NotFoundError } from "hexa-three-levels";


export class ShippingPriceFormatError extends FormatError {
    constructor(detail?: string, data?: any) {
        const message = 'The ShippingPrice has a format error, some attribute is wrong';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ShippingPriceNotFoundError extends NotFoundError {
    constructor(detail?: string, data?: any) {
        const message = 'ShippingPrice not found: could not find the indicated ShippingPrice.';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

export class ShippingPriceDuplicateError extends DuplicateError {
    constructor(detail?: string, data?: any) {
        const message = 'Duplicate ShippingPrice Error: ShippingPrice already exists!';
        super(message, detail, data);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};

