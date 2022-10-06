import { ITranslator } from '../../../domain/output-port/translator.interface';

export class TranslatorStub implements ITranslator {

  constructor(
  ) { }

  async translate(key: any, options?: any): Promise<string> {
    return "Hello world!";
  }

};