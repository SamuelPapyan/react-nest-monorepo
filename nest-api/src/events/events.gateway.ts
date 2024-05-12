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

  @SubscribeMessage('refresh chat')
  async refreshChat(@MessageBody() data: any) {
    const chatName = data.chatId;
    if (!(await this.cacheManager.get('chat:' + chatName)))
      await this.cacheManager.set('chat:' + chatName, []);
    const chat = await this.cacheManager.get('chat:' + chatName);
    this.server.emit('refresh:' + chatName, {
      data: chat,
      user: data.user
    });
  }
  @SubscribeMessage('send chat message')
  async sendChatMessage(@MessageBody() data: any) {
    const chatId = data.chatId;
    if (!(await this.cacheManager.get('chat:' + chatId)))
      await this.cacheManager.set('chat:' + chatId, []);
    const chat: any = await this.cacheManager.get('chat:' + chatId);
    chat.push(data.data);
    await this.cacheManager.set('chat:' + chatId, chat);
    this.server.emit('refresh:' + chatId, {
      data: chat,
    });
  }
}