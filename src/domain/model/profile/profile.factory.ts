

import { IEntityFactory } from "../entity-factory.interface";
import { Profile } from "./profile";


export class ProfileEntityFactory implements IEntityFactory<Profile> {
    createInstance(unmarshalled: any): Profile {
        return new Profile(unmarshalled);
    }
};