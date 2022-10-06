import { Test, TestingModule } from '@nestjs/testing';
import { UserRegisterDataDTOValidator } from '../../../domain/validator/user-register-data-dto.validator'; 
import { UserRegisterDataDTO } from '../../../domain/model/auth/register/user-register-data.dto.type';


describe('[Unit test] UserRegisterDataDTOValidator', () => {
    let validator: UserRegisterDataDTOValidator;

    beforeEach(async () => {
        validator = new UserRegisterDataDTOValidator();
    });

    it('Test validate is false', () => {
        let dTO: UserRegisterDataDTO = {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        expect(validator.validate(dTO)).toBe(false);
    });

    it('Test validate is true', () => {
        let dTO: UserRegisterDataDTO = {
            username: 'daro@gmail.com',
            firstName: 'Daro',
            lastName: 'Palma',
            email: 'daro@gmail.com',
            password: 'Daro_12345'
        };
        expect(validator.validate(dTO)).toBe(true);
    });

    it('Test traslateValidateErrorsText function return any', async () => {
        let dTO: UserRegisterDataDTO = {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        expect(validator.validate(dTO)).toBe(false);
        //console.log("*****traslateValidateErrorsText: ", await validator.traslateValidateErrorsText());
        expect(await validator.traslateValidateErrorsText()).toBeDefined;
    });

    afterEach(() => {
        //
    });

});

