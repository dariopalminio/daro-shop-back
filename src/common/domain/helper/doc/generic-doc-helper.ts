import { IDocHelper } from "./doc-helper.interface";


export class GenericDocHelper implements IDocHelper {

    public unformatDoc(formattedDoc: string): string {
        const regExpFormat = new RegExp(/^0+|[^0-9kK]+/g);
        const unformattedDoc = formattedDoc.replace(regExpFormat, '').toUpperCase();
          return unformattedDoc;
    };

    public formatDoc(unformattedDoc: string): string {
        return unformattedDoc;
    };

    public isDocValid(doc: string | null | undefined): boolean {
        if (typeof doc !== 'string') return false;
        return true;
    };

}
