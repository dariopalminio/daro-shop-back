export class Entity {

    _id?: string; //_id: holds an ObjectId

    get getId(): string {
        return this._id;
    }

};