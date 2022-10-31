/**
 * Entity super class
 * 
 * An object primarily defined by its identity is called an Entity.
 * An Entity object is mutable.
 */
export class Entity {

    protected readonly id?: string; //_id: holds an ObjectId

    constructor(id?: string) {
        if (id !== undefined) this.id = id;
    }

    public getId(): string {
        return this.id;
    }


    public equals(object?: Entity): boolean {
        if (object == null || object == undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!this.isEntity(object)) {
            return false;
        }

        return this.id == object.getId();
    };

    public isEntity(v: Entity): v is Entity {
        return v instanceof Entity
    };

};


