/**
 * Login Form domain object (compound value object) to Credentials Data 
 * 
 * Note: Many objects have no conceptual identity. These objects describe some characteristics of a thing.
 * A Value Object is an immutable type with out id and that is distinguishable only by the state of its properties.
 * Try not to modify the values ​​once it's created or instantiated (to be immutable) and instead replace the entire object.
 * The Value Object can define helper methods (or extensions methods) that assist with such operations. 
 * Generally, validation of Value Objects should not take place in their constructor. Constructors as a rule should not include logic, 
 * but should simply assign values.
 */
export class LoginForm {

    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    };

  };
