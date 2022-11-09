import { IEntityFactory } from "hexa-three-levels";
import { User } from "./user";

export class UserEntityFactory implements IEntityFactory<User> {
    createInstance(unmarshalled: any): User {
        return new User(unmarshalled);
    }
};