import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { CustomMessage } from '@protobuf-proto/shared/proto';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('json')
  greeting() {
    return {
      text: `helloooo! ${new Date().toISOString()}`,
    };
  }

  @Get('hello')
  getData(@Res() response: Response) {
    const message = new CustomMessage({
      text: `helloooo! ${new Date().toISOString()}`,
    });
    const encoded = CustomMessage.encode(message).finish();
    return response.send(encoded);
  }

  @Post('echo')
  echo(@Body() body: Buffer, @Res() response: Response) {
    const message = CustomMessage.decode(body);

    message.text += ' from server';

    return response.send(CustomMessage.encode(message).finish());
  }
}
