
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export default function extractTokenFromHeader(headers: any): string {

    console.log('extractTokenFromHeader process...');
    console.log('extractTokenFromHeader headers:',headers);

    if (!headers.authorization || !headers.authorization.startsWith("Bearer ")) {
        const e = new Error("Can't extract token string from Bearer token!");
        throw e;
    }

console.log('extractTokenFromHeader process...');
    const token =  headers.authorization.substring(7, headers.authorization.length);
    console.log('extractTokenFromHeader token:',token);
    return token;
};
