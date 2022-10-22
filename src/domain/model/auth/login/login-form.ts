/**
 * Login Form domain object
 * 
 * Note: The 'domain object' represents core domain model or domain entities. It can have state and business behaviour.
 * The domain object does not have any dependency on the other components except those of other atomic domain components part of model.
 * If you want to make a simple domain object class, you can design domain object without any behavioral methods and 
 * create use cases for each behavior of the domain object, it is up to you.
 */
export class LoginForm {

    constructor(userName: string, password: string) {
        this.userName = userName;
        this.password = password;
    };

    userName: string;
    password: string;
  };
