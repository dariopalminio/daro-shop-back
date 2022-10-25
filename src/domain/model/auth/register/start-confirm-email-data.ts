/**
 * StartConfirmEmailData value object
 * 
 * Note: A Value Object is an immutable type with out id and that is distinguishable only by the state of its properties.
 * Try not to modify the values ​​once it's created or instantiated (to be immutable) and instead replace the entire object.
 * The Value Object can define helper methods (or extensions methods) that assist with such operations. 
 * Generally, validation of Value Objects should not take place in their constructor. Constructors as a rule should not include logic, 
 * but should simply assign values.
 */
export class StartConfirmEmailData {
    name: string;
    userName: string;
    email: string;
    verificationPageLink: string;
};