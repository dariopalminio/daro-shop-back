import { Type } from "@sinclair/typebox";
import { DTOValidator } from 'src/domain/validator/dto.validator';


export class UserRegisterDataDTOValidator extends DTOValidator {

  constructor() {
    super();

    this.dtoSchema = Type.Object(
      {
        username: Type.String({
          format: "email",
          errorMessage: {
            type: "auth.ERROR.INVALID_USER", //Debe ser un string
            format: "auth.ERROR.INVALID_USER", //Debe ser un correo electrónico válido
          },
        }),
        firstName: Type.String({
          errorMessage: {
            type: "auth.ERROR.INVALID_NAME", //Debe ser un string
          },
        }),
        lastName: Type.String({
          errorMessage: {
            type: "auth.ERROR.INVALID_NAME", //Debe ser un string
          },
        }),
        email: Type.String({
          format: "email",
          errorMessage: {
            type: "auth.ERROR.INVALID_EMAIL", //Debe ser un string
            format: "auth.ERROR.INVALID_EMAIL", //Debe ser un correo electrónico válido
          },
        }),
        password: Type.String({
          errorMessage: {
            type: "auth.ERROR.INVALID_PASSWORD", //Debe ser un string
          },
        }),
      },
      {
        additionalProperties: false,
        errorMessage: {
          additionalProperties: "auth.ERROR.INVALID_FORMAT_OBJECT", //El formato del objeto no es válido
        },
      }
    );
    this.validateDTOSchema = this.ajvalidator.compile(this.dtoSchema);
  };


};