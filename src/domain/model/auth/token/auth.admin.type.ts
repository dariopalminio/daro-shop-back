export type NewAdminTokenRequestType = {
    client_id: string,
    grant_type: string,
    username: string,
    password: string,
    scope: string,
    client_secret: string,
  };