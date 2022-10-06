export type TokensDTO = {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    refresh_expires_in: number,
    token_type: string, //Bearer
    "not-before-policy": number,
    session_state: string,
    scope: string //"profile email"
};