/**
 * Entity super class
 * 
 * An object primarily defined by its identity is called an Entity.
 * An Entity object is mutable.
 */
export class Entity {

    protected readonly _id?: any; //_id: holds an ObjectId

    constructor(id?: any) {
        if (id !== undefined) this._id = id;
    }

    public getId(): any {
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

    public isEntity(v: Entity): v is Entity {
        return v instanceof Entity
    };

};


