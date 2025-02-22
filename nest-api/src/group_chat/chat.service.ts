import { Injectable } from '@nestjs/common';
import { Room, ChatMember } from './chat.interface';
import {
  predict,
  splitTokens,
  chatbotResponse,
} from './chatbot.infrastructure';
import { chatbotModel } from './chatbot.ai_model';
import { InjectModel } from '@nestjs/mongoose';
import { Workshop, WorkshopDocument } from 'src/workshop/workshop.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { Student, StudentDocument } from 'src/students/student.schema';

@Injectable()
export class ChatService {
  private rooms: Room[] = [];

  constructor(
    @InjectModel(Workshop.name) private workshopModel: Model<WorkshopDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async addRoom(roomName: string, host: ChatMember): Promise<void> {
    const room = await this.getRoomByName(roomName)
    if (room === -1) {
      await this.rooms.push({ name: roomName, host, users: [host] });
    }
  }

  async removeRoom(roomName: string): Promise<void> {
    const findRoom = await this.getRoomByName(roomName)
    if (findRoom !== -1) {
      this.rooms = this.rooms.filter((room) => room.name !== roomName)
    }
  }

  async getRoomHost(hostName: string): Promise<ChatMember> {
    const roomIndex = await this.getRoomByName(hostName)
    return this.rooms[roomIndex].host;
  }

  async getRoomByName(roomName: string): Promise<number> {
    const roomIndex = this.rooms.findIndex((room) => room?.name === roomName);
    return roomIndex;
  }

  async addUserToRoom(roomName: string, user: ChatMember): Promise<void> {
    const roomIndex = await this.getRoomByName(roomName);
    if (roomIndex !== -1) {
      if (
        this.rooms[roomIndex].users.findIndex(
          (usr) => usr.userName == user.userName
        ) === -1
      ) {
        this.rooms[roomIndex].users.push(user)
        const host = await this.getRoomHost(roomName)
        if (host.userName === user.userName) {
          this.rooms[roomIndex].host.socketId = user.socketId;
        }
      }
    } else {
      await this.addRoom(roomName, user);
    }
  }

  async findRoomsByUserSocketId(socketId: string): Promise<Room[]> {
    const filteredRooms = this.rooms.filter((room)=>{
      const found = room.users.find((user) => user.socketId === socketId);
      if (found) {
        return found;
      }
    })
    return filteredRooms;
  }

  async removeUserFromAllRooms(socketId: string): Promise<void> {
    const rooms = await this.findRoomsByUserSocketId(socketId)
    for (const room of rooms) {
      await this.removeUserFromRoom(socketId, room.name)
    }
  }

  async removeUserFromRoom(socketId: string, roomName: string): Promise<void> {
    const room = await this.getRoomByName(roomName)
    if (room !== -1) {
      this.rooms[room].users = this.rooms[room].users.filter(
        (user) => user.socketId !== socketId
      );
      if (this.rooms[room].users.length === 0) {
        await this.removeRoom(roomName)
      }
    }
  }

  async getRooms(): Promise<Room[]> {
    return this.rooms
  }

  predict(input: string, lang: string): string {
    const tokens = splitTokens(input);
    return predict(chatbotModel[lang], tokens);
  }

  async chatbotResponse(
    label: string,
    username: string,
    locale: string,
  ): Promise<any> {
    let res = [chatbotResponse(label, locale)];
    res = [
      ...res,
      ...(await this.chatbotExtraResponse(label, username, locale)),
    ];
    return res;
  }

  async chatbotExtraResponse(
    label: string | null,
    username: string,
    locale: string
  ): Promise<any> {
    if (label) {
      const translations = {
        en: {
          list_of_workshops: 'List of workshops:',
        },
        hy: {
          list_of_workshops: 'Աշխատարանների ցուցակը՝ ',
        }
      }
      if (label === 'workshops') {
        const workshops = (await this.workshopModel.find().lean().exec()).map(
          (item) => (locale == 'hy' ? item.title_hy : item.title_en),
        );
        return [translations[locale]['list_of_workshops'], workshops];
      }
      if (label === 'my_workshops') {
        const workshops = (
          await this.workshopModel.find({ students: username }).lean().exec()
        ).map((item) => (locale == 'hy' ? item.title_hy : item.title_en));
        return [workshops];
      }
      if (label.indexOf('coach') > -1) {
        const student: Student = await this.studentModel.findOne({
          username: username,
        });
        const coach: User = await this.userModel.findOne({
          username: student.coach,
        });
        const coachFullName =
          locale == 'hy'
            ? `${coach.first_name_hy} ${coach.last_name_hy}`
            : `${coach.first_name_en} ${coach.last_name_en}`;

        const coachMetadata = {
          name: coachFullName,
          username: coach.username,
          email: coach.email,
        }
        if (label.indexOf('email') > -1) return [coachMetadata.email];
        if (label.indexOf('name') > -1) return [coachMetadata.name];
        if (label.indexOf('data') > -1) {
          return [
            Object.keys(coachMetadata).map((key) => {
              return ` ${key.toUpperCase()}: ${coachMetadata[key]}`;
            }),
          ];
        }
      }
    }
    return []
  } 
}