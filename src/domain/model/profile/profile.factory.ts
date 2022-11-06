import { IEntityFactory } from "hexa-three-levels";
import { Profile } from "./profile";


export class ProfileEntityFactory implements IEntityFactory<Profile> {
    createInstance(unmarshalled: any): Profile {
        return new Profile(unmarshalled);
    }
};