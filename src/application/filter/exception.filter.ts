import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Inject,
  } from '@nestjs/common';
  import {LoggerService as ILoggerService } from '@nestjs/common';


  
  /**
   * Filter for all exceptions.
   * Exception Filters are called after the route handler and after the interceptors. 
   * They are the last place to make changes before a response goes out.
   */
  @Catch()
  export class ExceptionsAllFilter implements ExceptionFilter {

    constructor(
      @Inject('ILoggerService')
      private readonly logger: ILoggerService
      ) { }

    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      console.log("ExceptionsAllFilter catch a exception:");

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const payloadMessage =
        exception instanceof HttpException && exception.getResponse();
  
      if (exception instanceof HttpException &&
        exception.getStatus() >= 500) 
        this.logger.error(exception.message, exception.stack, exception.name);
  
      if (exception instanceof Error)
        this.logger.error(exception.message, exception.stack, exception.name);
  
      const errorMsg = ((exception instanceof Error) || (exception instanceof HttpException)) ? exception.message : payloadMessage;

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        payload: payloadMessage,
        message: errorMsg,
      });
    };
  };