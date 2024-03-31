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
    const coachName = data.coachName;
    const studentName = data.studentName;
    if (!(await this.cacheManager.get('chat:' + coachName + ':' + studentName)))
      await this.cacheManager.set('chat:' + coachName + ':' + studentName, []);
    const chat = await this.cacheManager.get(
      'chat:' + coachName + ':' + studentName,
    );
    this.server.emit('refresh:' + coachName + ':' + studentName, chat);
  }
  @SubscribeMessage('send chat message')
  async sendChatMessage(@MessageBody() data: any) {
    const coach = data.coach;
    const student = data.student;
    if (!(await this.cacheManager.get('chat:' + coach + ':' + student)))
      await this.cacheManager.set('chat:' + coach + ':' + student, []);
    const chat: any = await this.cacheManager.get(
      'chat:' + coach + ':' + student,
    );
    chat.push(data);
    await this.cacheManager.set('chat:' + coach + ':' + student, chat);
    this.server.emit('refresh:' + coach + ':' + student, chat);
  }
}