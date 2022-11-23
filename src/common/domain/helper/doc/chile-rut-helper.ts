import { IDocHelper } from "./doc-helper.interface";


export class ChileRutHelper implements IDocHelper {

  /**
   * Converts a formatted document (RUT in Chile) to an unformatted one.
   * Convert the RUT '26.232.237-9' to '262322379'.
   * @param formattedDoc RUT as string
   * @returns unformattedDoc RUT as string
   */
    public unformatDoc(formattedDoc: string): string {
        const regExpFormat = new RegExp(/^0+|[^0-9kK]+/g);
        const unformattedDoc = formattedDoc.replace(regExpFormat, '').toUpperCase();
          return unformattedDoc;
    };

    /**
     * Converts a unformatted document (RUT in Chile) to an formatted one
     * Convert the RUT '262322379' to '26.232.237-9'.
     * @param unformattedDoc RUT as string
     * @returns formattedDoc RUT as string
     */
    public formatDoc(unformattedDoc: string): string {
        const rut = this.unformatDoc(unformattedDoc);

        let formattedRut =
          rut.slice(-4, -1) + '-' + rut.substring(unformattedDoc.length - 1);
      
        for (let i = 4; i < rut.length; i += 3) {
          formattedRut = rut.slice(-3 - i, -i) + '.' + formattedRut;
        }
      
        return formattedRut;
    };

    /**
     * Check if a RUT is valid
     * @param doc RUT
     * @returns boolean
     */
    public isDocValid(doc: string | null | undefined): boolean {
        if (typeof doc !== 'string') return false;
        const rutRegExp = new RegExp ( /^(\d{0,2})\.?(\d{3})\.?(\d{3})-?(\d|k)$/gi);
        const isRut = rutRegExp.test(doc);
        return isRut;
    };

}
