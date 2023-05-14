import { Controller, Get, Post, Session } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Get()
  getHello(@Session() sess): string {
    console.log(sess.email);
    return this.appService.getHello();
  }

  @Post('/save')
  saveSession(@Session() sess): string {
    sess.email = "test@gmail.com";
    return sess.email;
  }
}
