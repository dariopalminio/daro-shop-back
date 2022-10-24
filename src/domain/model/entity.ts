export class Entity {

    _id?: string; //_id: holds an ObjectId

    public getId(): string {
        return this._id;
    }

    public setId(id: string) {
         this._id=id;
    }

};