import { Controller, Res, Get, Post, Body, Inject, Headers, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { INotificationService } from 'src/domain/incoming/notification.service.interface';
import { ContactMessage } from 'src/domain/model/notification/contact.message';
import { IGlobalConfig } from 'src/domain/outgoing/global-config.interface';
import { HelloWorldDTO } from '../dto/hello-world.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailDataDTO } from 'src/domain/model/notification/email-data-dto';
import { throwAppError } from '../error/app-error-handling';

/**
 * Notification controller
 * 
 * Note: Keep your controllers as thin as possible. Controllers should only do one thing: hand data off to other services to do work for them.
 * Controllers themselves should only be responsible for moving data to and from your services and should contain no business logic.
 */
@Controller('notifications')
export class NotificationController {

  constructor(
    @Inject('INotificationService')
    private readonly supportService: INotificationService,
    @Inject('IGlobalConfig')
    private readonly globalConfig: IGlobalConfig,
  ) { }


  @Get()
  getHello(@Res() res) {
    const response: HelloWorldDTO = {
      isSuccess: true,
      status: HttpStatus.OK,
      message: "Hello World from notification service " + this.globalConfig.get<string>('VERSION') + "!",
      name: "notification",
      version: this.globalConfig.get<string>('VERSION'),
      date: new Date()
    };
    return res.status(200).json(response);
  };

  @Post('sendContactEmail')
  async sendContactEmail(@Headers() headers, @Res() res, @Body() contactMessage: ContactMessage) {
    console.log(contactMessage);
    let lang = 'en';

    if (headers && headers.lang) {
      lang = headers.lang;
    }
    let sentInfo;

    try {
      sentInfo = await this.supportService.sendContactEmail(contactMessage, lang);
    } catch (error) {
      throwAppError(error);
    }

    return res.status(HttpStatus.OK).json(sentInfo);
  };

  @Post('sendEmail')
  async sendEmail(@Res() res, @Body() emailDataDTO: EmailDataDTO) {
    try {
      const sentInfo: any = await this.supportService.sendEmail(emailDataDTO.subject, emailDataDTO.email, emailDataDTO.content);
      if (sentInfo.isSuccess) return res.status(HttpStatus.OK).json(sentInfo);
      return res.status(sentInfo.status).json(sentInfo);
    } catch (error) {
      throwAppError(error);
    }

  };

};
