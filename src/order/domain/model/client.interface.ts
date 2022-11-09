export interface IClient {
    
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    docType: string;  //docType (RUT|DNI)
    document: string; //RUT number or DNI number
    telephone: string;

};