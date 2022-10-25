/**
 * Entity super class
 * 
 * An object primarily defined by its identity is called an Entity.
 * An Entity object is mutable.
 */
export class Entity {

    _id?: string; //_id: holds an ObjectId

    public getId(): string {
        return this._id;
    }

};