/**
 * Entity super class
 * 
 * An object primarily defined by its identity is called an Entity.
 * An Entity object is mutable.
 */
export class Entity {

    protected readonly _id?: string; //_id: holds an ObjectId

    constructor(id?: string) {
        if (id!==undefined) this._id = id;
    }

    public getId(): string {
        return this._id;
    }

    get id(): string {
        return this._id;
    }


    public equals(object?: Entity): boolean {
        if (object == null || object == undefined) {
            return false
        }

        if (this === object) {
            return true
        }

        if (!this.isEntity(object)) {
            return false
        }

        return this._id == object._id
    }

    isEntity = (v: Entity): v is Entity => {
        return v instanceof Entity
    }

};


