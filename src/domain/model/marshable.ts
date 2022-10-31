export interface Marshable {

    setFromAny(unmarshalled: any): void;
    convertToAny(): any;
}