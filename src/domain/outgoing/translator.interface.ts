//I18nRequestScopeService.translate(key: any, options?: any): Promise<string>

export interface ITranslator {

    translate(key: any, options?: any): Promise<string>;
}