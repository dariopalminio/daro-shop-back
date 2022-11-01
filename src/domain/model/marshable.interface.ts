export interface IMarshable<T> {

    convertToAny(): any;
    createFromAny(unmarshalled: any): T;
}