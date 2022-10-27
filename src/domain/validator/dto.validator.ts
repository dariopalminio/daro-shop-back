import Ajv from "ajv"; //https://ajv.js.org/guide/getting-started.html
import { Type } from "@sinclair/typebox";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import { ITranslator } from 'src/domain/outgoing/translator.interface';

/**
 * Ensure your data is valid using an JSON Schema or JSON Type Definition
 */
export class DTOValidator {
  
  dtoSchema = null;
  ajvalidator = null;
  validateDTOSchema = null;

  constructor() { 
    this.ajvalidator = new Ajv({ allErrors: true });
    addFormats(this.ajvalidator, ["email"]).addKeyword("kind").addKeyword("modifier");
    addErrors(this.ajvalidator, { keepErrors: false });
    //this.dtoSchema = Type.Object(..)
    //this.validateDTOSchema = this.ajvalidator.compile(this.dtoSchema);
  };

  /**
   * Return concatenated error messages
   * @param i18n traslator
   * @returns error message
   */
  async traslateValidateErrorsText(i18n?: ITranslator) {

    if (typeof(i18n) === 'undefined')
      return this.ajvalidator.errorsText(this.validateDTOSchema.errors, { separator: "\n" });

    let compoundMessage = '';

    for (var valor of this.validateDTOSchema.errors) {
      compoundMessage = compoundMessage + await i18n.translate(valor.message) + "\n";
    }

    return compoundMessage;
  };

  /**
   * Validate Json object data using an JSON Schema
   * @param objectJson Json object data
   * @returns boolean
   */
  validate(objectJson: any){
    return this.validateDTOSchema(objectJson);
  };


};