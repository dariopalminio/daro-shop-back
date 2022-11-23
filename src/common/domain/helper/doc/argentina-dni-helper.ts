import { IDocHelper } from "./doc-helper.interface";


export class ArgentinaDniHelper implements IDocHelper {


    /**
     * Convert DNI '26.234.567' to '26234567'
     */
    public unformatDoc(formattedDoc: string): string {
        const regExpFormat = new RegExp(/^0+|[^0-9kK]+/g);
        const unformattedDoc = formattedDoc.replace(regExpFormat, '').toUpperCase();
          return unformattedDoc;
    };

    /**
     * Convert DNI '26234567' to '26.234.567'
     * @param unformattedDoc 
     * @returns 
     */
    public formatDoc(unformattedDoc: string): string {
        const rut = this.unformatDoc(unformattedDoc);

        let formattedDoc = rut.slice(-3, unformattedDoc.length);
        
        for (let i = 3; i < rut.length; i += 3) {
            formattedDoc = rut.slice(-3 - i, -i) + '.' + formattedDoc;
        }
    
        return formattedDoc;
    };

    /**
     * Check if a DNI of Argentina is valid.
     * For example '26.234.567' or '26234567' are true.
     * @param doc DOC
     * @returns boolean
     */
    public isDocValid(doc: string | null | undefined): boolean {
        if (typeof doc !== 'string') return false;
        const dniRegExp = new RegExp ( /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/gi);
        const isDNI = dniRegExp.test(doc);
        return isDNI;
    };

}