import { v4 as uuid } from 'uuid';
import { Base64 } from 'js-base64';

/**
 * Encode Token
 * Encode the token for the email confirmation link
 * as `email|createdTimestamp` -> Base64 encoded
 * @param token 
 * @returns 
 */
export const encodeToken = (email: string, createdTimestamp: string): string => {
    const concatenated = email + '|' + createdTimestamp;
    const encodedToken = Base64.encode(concatenated);
    return encodedToken;
};

/**
 * Encode Link
 * Create a url made up of the union between the url of the confirmation page and the token.
 * The result is similar to: 'http://localhost:3000/confirm/ZGFyaW9wYWxtaW5pb0BnbWFpbC5jb218MTYzMTkzNDkxODgxNw=='
 * @param token 
 * @returns string with formatt follow app_url/confirm/token
 */
export const createTokenLink = (link: string, token: string): string => {
    const url = `${link}:${token}`;
    return url;
};

/**
 * Generate an Universally Unique IDentifier 
 * 
 * @returns String with 32 hexadecimal digits divided into five groups separated by hyphens 
 * of the form 550e8400-e29b-41d4-a716-446655440000 which gives a total of 36 characters
 */
export const generateToken = (): string => {
    return uuid();
};

/**
 * Decode Token
 * Decode process: Base64 encoded --> `email|createdTimestamp` --> [email,createdTimestamp]
 *         const partsArray = decodeToken(token);
    const decodedEmail = partsArray[0];
    const decodedCode = partsArray[1];
 * @param token Base64 encoded string
 * @returns string[]
 */
export const decodeToken = (token: string): string[] => {
    const dencodedToken = Base64.decode(token);
    var partsArray = dencodedToken.split('|');
    return partsArray;
};


