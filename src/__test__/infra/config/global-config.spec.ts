import { IGlobalConfig } from '../../../domain/output-port/global-config.interface';
import { GlobalConfigImpl } from 'infra/config/global-config-impl';
import { Test, TestingModule } from '@nestjs/testing';

describe('[Unit test] GlobalConfigImpl', () => {
    let globalConfig: IGlobalConfig;

    beforeEach(async () => {

        globalConfig = new GlobalConfigImpl();

    });

    it('get & set values', async () => {

        globalConfig.set<string>('String name to test', 'String value' as string);
        globalConfig.set<number>('Number name to test', Number(12345) as number);

        const stringVar: string = globalConfig.get<string>('String name to test');
        const numberVar: number = globalConfig.get<number>('Number name to test');

        expect(stringVar).toBe('String value');
        expect(numberVar).toBe(12345);
    });

});
