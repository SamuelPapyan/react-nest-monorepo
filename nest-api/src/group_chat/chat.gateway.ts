import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import {
  ChatMember,
  ClientToServerEvents,
  Message,
  ServerToClientEvents,
} from './chat.interface';
import { ChatService } from './chat.service';
import { messages } from 'src/app/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private chatService: ChatService
  ) {}
  @WebSocketServer()
  server: Server = new Server<ServerToClientEvents, ClientToServerEvents>();

  async handleConnection(client: Socket) {
  }

  async handleDisconnect(client: Socket) {
    await this.chatService.removeUserFromAllRooms(client.id);
  }

  @SubscribeMessage('chat')
  async handleChatEvent(
    @MessageBody()
    payload: Message
  ): Promise<Message> {
    const chatId = payload.roomName;
    if (!(await this.cacheManager.get('chat:' + chatId)))
      await this.cacheManager.set('chat:' + chatId, []);
    const chat: any = await this.cacheManager.get('chat:' + chatId);
    chat.push({
      user: payload.user.userName,
      timeSent: payload.timeSent,
      message: [payload.message],
      roomName: payload.roomName,
    });
    await this.cacheManager.set('chat:' + chatId, chat);
    this.server.to(payload.roomName).emit('chat', { data: chat });
    if (chatId.indexOf('chatbot') > -1) {
      const prediction = this.chatService.predict(payload.message)
      const response = await this.chatService.chatbotResponse(
        prediction,
        payload.user.userName,
      );
      chat.push({
        user: 'Chatbot AI',
        timeSent: Date.now(),
        message: response,
        roomName: payload.roomName,
      });
      await this.cacheManager.set('chat:' + chatId, chat);
      this.server.to(payload.roomName).emit('chat', { data: chat });
    }
    return payload;
  }

  @SubscribeMessage('join_room')
  async handleSetClientDataEvent(
    @MessageBody()
    payload: {
      prevRoom: string,
      nextRoom: string,
      user: ChatMember
    }
  ) {
    if (payload.user.socketId) {
      if (payload.prevRoom) {
        await this.server
          .in(payload.user.socketId)
          .socketsLeave(payload.prevRoom);
        await this.chatService.removeUserFromRoom(
          payload.user.socketId,
          payload.prevRoom,
        );
      }
      if (payload.nextRoom) {
        await this.server
          .in(payload.user.socketId)
          .socketsJoin(payload.nextRoom);
        await this.chatService.addUserToRoom(payload.nextRoom, payload.user);

        if (!(await this.cacheManager.get('chat:' + payload.nextRoom)))
          await this.cacheManager.set('chat:' + payload.nextRoom, []);
        const chat = await this.cacheManager.get('chat:' + payload.nextRoom);
        this.server.to(payload.nextRoom).emit('chat', { data: chat });
      }
    }
  }
}