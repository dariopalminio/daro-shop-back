export enum ResponseCode {
    INTERNAL_SERVER_ERROR = 500,
    UNKNOWN = 0,
    UNAUTHORIZED = 401,
    CONFLICT = 409, //CONFLICT: Username already exists!
    BAD_REQUEST = 400,
    ERR_CONNECTION_REFUSED = 102, //Network Error
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    REQUEST_TIMEOUT = 408,
    UNSUPPORTED_MEDIA_TYPE = 415,
    NO_CONTENT = 204,
    OK = 200,
};