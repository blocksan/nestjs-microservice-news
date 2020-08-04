import { Controller} from '@nestjs/common';
import { ApplicationLoggerService } from 'src/logger/logger.service';
import { Client, Transport, ClientProxy, MessagePattern, EventPattern } from '@nestjs/microservices';

@Controller('app')
export class AppController {
  @Client({ transport: Transport.NATS })
  client: ClientProxy;

  constructor(private appLogger: ApplicationLoggerService) {
   this.appLogger.setContext('AppController')
  }


  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @MessagePattern('via_http_message')
  async sendMessage(message: string) {
    this.appLogger.log(`message received from the client ${message}`)
    this.client.emit<number>('micro_2_micro_message','Hello from microservice')
    return message
  }

  @EventPattern('micro_2_micro_message')
  showMessage(message: string) {
    this.appLogger.log(`emitting event to the client ${message}`)
    this.client.emit<number>('via_micro_event',message)
  }

}
