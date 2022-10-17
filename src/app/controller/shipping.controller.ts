import { Controller, Get, Res, Inject, Headers, Query } from '@nestjs/common';
import { HttpHealthIndicator, HealthCheckService, MongooseHealthIndicator } from "@nestjs/terminus";
import { ITranslator } from 'src/domain/output-port/translator.interface';
import { IGlobalConfig } from 'src/domain/output-port/global-config.interface';

@Controller('shipping')
export class ShippingController {

    constructor(
        @Inject('ITranslator')
        private readonly myI18n: ITranslator,
        @Inject('IGlobalConfig')
        private readonly globalConfig: IGlobalConfig,
        private healthCheckService: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: MongooseHealthIndicator,
    ) { };


    @Get('region/price')
    async getPriceByRegion(@Res() res, @Query('region') regionParam) {
        console.log("getPriceByRegion to region:", regionParam.toString());
        const region: string = regionParam.toString();
        const price: number = 999.99;
        return res.status(200).json({ region: region, price: price });
    };


};
