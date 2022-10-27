import { ITranslator } from "src/domain/outgoing/translator.interface"


/**
 * i18n wrapper class
 * A simple and lightweight class implementation to wrap i18n
 */

export class TranslatorI18nImpl implements ITranslator {

    
    constructor(
    ) { }

    /**
     * wrapper of translate
     * @param key 
     * @param options 
     * @returns 
     */
    async translate(key: any, options?: any): Promise<string> {
       
        console.log("********translate key>", key);
        console.log("********translate options", options);
        console.log("********translate> TODO");
        return await key;
    }

};