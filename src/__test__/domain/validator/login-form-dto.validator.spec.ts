import { Test, TestingModule } from '@nestjs/testing';
import { LoginFormDTOValidator } from '../../../domain/validator/login-form-dto.validator'; 
import { LoginFormDTO } from '../../../domain/model/auth/login/login-form.dto';


describe('[Unit test] LoginFormDTOValidator', () => {
    let validator: LoginFormDTOValidator;

    beforeEach(async () => {
        validator = new LoginFormDTOValidator();
    });

    it('Test validate is false', () => {
        let loginFormDTO: LoginFormDTO = {
            username: '',
            password: ''
        };
        expect(validator.validate(loginFormDTO)).toBe(false);
    });

    it('Test validate is true', () => {
        let loginFormDTO: LoginFormDTO = {
            username: 'daro@gmail.com',
            password: 'daro123'
        };
        expect(validator.validate(loginFormDTO)).toBe(true);
    });

    it('Test traslateValidateErrorsText function return any', async () => {
        let loginFormDTO: LoginFormDTO = {
            username: '',
            password: 'daro123'
        };
        expect(validator.validate(loginFormDTO)).toBe(false);
        console.log("*****traslateValidateErrorsText: ", await validator.traslateValidateErrorsText());
        expect(await validator.traslateValidateErrorsText()).toBeDefined;
    });

    afterEach(() => {
        //
    });

});

