import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('hand up')
  handleHandUp(@MessageBody() data: any) {
    this.server.emit('hand up', data);
  }
}