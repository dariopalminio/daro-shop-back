/**
 * Entity super class
 * 
 * An object primarily defined by its identity is called an Entity.
 * An Entity object is mutable.
 */
export abstract class Entity {

    protected readonly id?: string;

    constructor(id?: string) {
        if (id !== undefined) this.id = id;
    }
    
    public getId(): string | undefined{
        return this.id;
    }

    public equals(objectToCheck?: Entity): boolean {
        if (objectToCheck == null || objectToCheck == undefined) {
            return false;
        }

        if (!this.isEntity(objectToCheck)) {
            return false;
        }

        if (this === objectToCheck) {
            return true;
        }

        return this.id == objectToCheck.getId();
    };

    public isEntity(objectToCheck: Entity | any): boolean {
        return objectToCheck instanceof Entity
    };

};


