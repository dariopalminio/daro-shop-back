import { IMarshable } from "../marshable.interface";
import { IClient } from "./client.interface";

/**
 * Client Value Object
 * 
 * Note: Value Object is a small object that represents a simple entity with no identity (no id) and depends on a main 'Entity' or 'Root Entity'.
 */
export class Client implements IMarshable<Client> {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    docType: string;  //docType (RUT|DNI)
    document: string; //RUT number or DNI number
    telephone: string;

    /**
     * Set all attributes from variable can be of any type 'any'.
     * It is used to convert (casting) and validate an input data type, such as a DTO, to the data type of this class.
     * @param prod any is used to tell TypeScript that a variable can be of any type such as DTO or json object
     */
    public setFromAny(clientObj: any) {
        this.setEmail(clientObj.email);
        this.userId = clientObj.userId ? clientObj.userId : '';
        this.firstName = clientObj.firstName ? clientObj.firstName : '';
        this.lastName = clientObj.lastName ? clientObj.lastName : '';
        this.docType = clientObj.docType ? clientObj.docType : '';
        this.document = clientObj.document ? clientObj.document : '';
        this.telephone = clientObj.telephone ? clientObj.telephone : '';

    }

    public createFromAny(unmarshalled: any): Client {
        let c: Client = new Client();
        c.setFromAny(unmarshalled);
        return c;
    };

    /**
     * Unmarshal: convert class object to unmarshalled any
     */
     public convertToAny(): any {
        const unmarshalled: IClient = {
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            docType: this.docType,
            document: this.document,
            telephone: this.telephone
        };
        return unmarshalled;
    };

    /**
     * Setter method with Attributes/Properties Validation
     */
    public setEmail(email: string) {
        if (email===undefined || email.length === 0) throw new Error('Field email has invalid format becuse is undefined or empty!');
        const expresionsRegularEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const hasClientEmail: boolean = expresionsRegularEmail.test(email);
        if (!hasClientEmail) throw new Error('Field email has invalid format!');
        this.email = email;
    }

};