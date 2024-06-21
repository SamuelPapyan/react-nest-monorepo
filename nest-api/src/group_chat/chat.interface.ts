import { User } from 'src/users/user.schema';

export interface ChatMember {
  userId: string;
  userName: string;
  socketId: string;
}

export interface Room {
  name: string;
  host: ChatMember;
  users: ChatMember[];
}

export interface Message {
  user: ChatMember;
  timeSent: number;
  message: string;
  roomName: string;
}

export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  join_room: (e: { user: User; prevRoom: string; nextRoom: string }) => void;
}
