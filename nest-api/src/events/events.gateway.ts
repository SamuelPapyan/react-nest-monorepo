import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
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
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('hand up')
  async handleHandUp(@MessageBody() data: any) {
    if (!(await this.cacheManager.get('handUps')))
      await this.cacheManager.set('handUps', {});
    const handUps = await this.cacheManager.get('handUps');
    handUps[data.student] = data.handUp;
    await this.cacheManager.set('handUps', handUps);
    this.server.emit('hand up', data);
  }
}