export interface IEntityFactory<T> {
    createInstance(unmarshalled: any): T;
};
