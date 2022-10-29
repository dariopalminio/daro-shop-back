import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DomainError } from "src/domain/error/domain-error";

/**
 * Throws an http nestjs exception according to the exception received from the domain.
 */
export function throwAppError(e: Error | DomainError) {

    if (e instanceof DomainError) {

        const domainError: DomainError = e;
        switch (domainError.getCode()) {
            case HttpStatus.BAD_REQUEST:
                throw new BadRequestException(domainError);

            case HttpStatus.UNAUTHORIZED:
                throw new UnauthorizedException(domainError);

            case HttpStatus.CONFLICT:
                throw new ConflictException(domainError);

            case HttpStatus.FORBIDDEN:
                throw new ForbiddenException(domainError);

            case HttpStatus.NOT_FOUND:
                throw new NotFoundException(domainError);

            default:
                throw new InternalServerErrorException(domainError);
        }
    };

    throw new InternalServerErrorException(e);
};



