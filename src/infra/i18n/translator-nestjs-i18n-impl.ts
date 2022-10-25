import { Injectable, Inject } from '@nestjs/common';
import { ITranslator } from 'src/domain/infra-interface/translator.interface';
import { I18nRequestScopeService } from 'nestjs-i18n';

/**
 * i18n wrapper class
 * A simple and lightweight class implementation to wrap i18n
 */
@Injectable()
export class TranslatorNestjsI18nImpl implements ITranslator {
    
    constructor(
        @Inject('I18nRequestScopeService')
        private readonly i18n: I18nRequestScopeService,
    ) { }

    /**
     * wrapper of translate
     * @param key 
     * @param options 
     * @returns 
     */
    async translate(key: any, options?: any): Promise<string> {
        return await this.i18n.translate(key, options);
    }

};