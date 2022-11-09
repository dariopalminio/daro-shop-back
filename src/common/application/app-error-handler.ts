import {
    BadRequestException, ConflictException, ForbiddenException, HttpException,
    HttpStatus, InternalServerErrorException, NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { IAppErrorHandler } from "hexa-three-levels";
import { DomainError } from "hexa-three-levels";

/**
 * App Nest Error Handler 
 */
export class AppNestErrorHandler implements IAppErrorHandler<HttpException> {

    /**
     * Create an http exception according to the exception received from the domain.
     */
    public createHttpException(e: Error | DomainError): HttpException {

        if (e instanceof DomainError) {

            const domainError: DomainError = e;
            switch (domainError.getCode()) {
                case HttpStatus.BAD_REQUEST:
                    return new BadRequestException(domainError);

                case HttpStatus.UNAUTHORIZED:
                    return new UnauthorizedException(domainError);

                case HttpStatus.CONFLICT:
                    return new ConflictException(domainError);

                case HttpStatus.FORBIDDEN:
                    return new ForbiddenException(domainError);

                case HttpStatus.NOT_FOUND:
                    return new NotFoundException(domainError);

                default:
                    return new InternalServerErrorException(domainError);
            }
        };

        return new InternalServerErrorException(e);
    };

};




