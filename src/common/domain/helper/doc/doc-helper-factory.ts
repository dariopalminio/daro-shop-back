import { ArgentinaDniHelper } from "./argentina-dni-helper";
import { ChileRutHelper } from "./chile-rut-helper";
import { IDocHelper } from "./doc-helper.interface";
import { GenericDocHelper } from "./generic-doc-helper";

export class DocHelperFactory {

    createInstance(country: string): IDocHelper {
        switch (country.toUpperCase()) {
            case 'CHILE':
                return new ChileRutHelper()
            case 'ARGENTINA':
                return new ArgentinaDniHelper()
            default:
                return new GenericDocHelper();
        }
    }

};