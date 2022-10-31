export interface IMarshable {

    setFromAny(unmarshalled: any): void;
    convertToAny(): any;
}