import { Controller, Get, Res, Inject, Headers, HttpStatus, BadRequestException } from '@nestjs/common';
import { HealthCheck, HttpHealthIndicator, HealthCheckService, MongooseHealthIndicator } from "@nestjs/terminus";
import { HelloWorldDTO } from './hello-world.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IGlobalConfig } from "hexa-three-levels";

/**
 * App controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller()
export class AppController {

  constructor(
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: MongooseHealthIndicator,
  ) { };

  @ApiOperation({
    summary:
      'Hello world is get method to do Ping and test this service.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Succefully Ping',
    type: HelloWorldDTO,
  })
  @Get()
  async getHello(@Headers() headers, @Res() res) {

    let lang = 'en';

    if (headers && headers.lang) {
      lang = headers.lang;
    }

    const options = {
      lang: lang,
      args: {
        app: this.globalConfig.get<string>('APP_NAME') as string,
        version: this.globalConfig.get<string>('VERSION') as string
      },
    };

    const response: HelloWorldDTO = {
      isSuccess: true,
      status: 200,
      message: "Hello!",
      name: this.globalConfig.get<string>('APP_NAME') as string,
      version: this.globalConfig.get<string>('VERSION') as string,
      date: new Date()
    };
    return res.status(200).json(response);
  };

  /**
   * Health endpoint returns the status of the service and the dependencies.
   * Health endpoints are designed specifically for load balancers and service discovery solutions. 
   * As such, they should be exceedingly simple, indicating the health of an API via HTTP response codes.
   * A load balancer should know whether to keep a service in the pool or eject it after sending a HEAD request to the service health endpoint.
   * Health endpoints are designed for both human consumption, and also for dynamic load balancing. 
   * Outputs should be intuitive and easy-to-read, should also be able to serve applications at 
   * 1 QPS without any impact on application performance. Avoid exposing difficult-to-compute or 
   * resource-intensive values, or if we must, background-compute and cache them for as long as 
   * necessary to make the performance hit negligible.
   *   
   * @returns returns the status of the service and the dependencies.  
   */
  @Get('health')
  @HealthCheck()
  checkHealth() {
    return this.healthCheckService.check([
      () => this.db.pingCheck('mongoose')
    ]);
  }

  /**
   * Returns the readiness state to accept incoming requests from the gateway or the upstream proxy. 
   * Readiness signals that the app is running normally but isn’t ready to receive requests just yet. 
   */
  @Get('health/readiness')
  @HealthCheck()
  readiness() {
    return this.healthCheckService.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  /**
   * Returns the liveness of a microservice. If the check does not return the expected response, 
   * it means that the process is unhealthy or dead and should be replaced as soon as possible.
   */
  @Get('health/liveness')
  @HealthCheck()
  liveness() {
    return this.healthCheckService.check([
    ]);
  }

  /**
   * debug endpoints are designed specifically internal use, 
   * to expose sensitive configuration, environment and logging information to aid in development. 
   * These endpoints are NOT for public consumption, as such should be disabled by default, 
   * requiring an explicit non-default configuration setting or environment variable to enable at start-up.
   */
  @Get('debug')
  async debug(@Headers() headers, @Res() res) {

    let lang = 'en';

    if (headers && headers.lang) {
      lang = headers.lang;
    }

    const options = {
      lang: lang,
      args: {
        app: this.globalConfig.get<string>('APP_NAME') as string,
        version: this.globalConfig.get<string>('VERSION') as string
      },
    };

    let variables = "DEBUG is false!";
    if (this.globalConfig.get<boolean>('DEBUG') as boolean)
      variables = this.globalConfig.stringify()

    const response = {
      isSuccess: true,
      status: 200,
      message: "Hello!",
      name: this.globalConfig.get<string>('APP_NAME') as string,
      version: this.globalConfig.get<string>('VERSION') as string,
      date: new Date(),
      globalConfig: variables,
    };
    return res.status(200).json(response);
  };


};
