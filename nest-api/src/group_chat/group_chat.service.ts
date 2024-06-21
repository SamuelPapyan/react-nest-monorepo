import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GroupChat, GroupChatDocument } from "./group_chat.schema";
import mongoose, { Model } from "mongoose";
import { GroupChatDTO } from "./group_chat.dto";

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(GroupChat.name) private groupChatModel: Model<GroupChatDocument>,
  ) {}

  async addGroupChat(dto: GroupChatDTO): Promise<GroupChat> {
    const data = {
      owner: new mongoose.Types.ObjectId(dto.owner),
      chat_name: dto.chat_name,
      members: dto.members.map((mem) => new mongoose.Types.ObjectId(mem)),
    }
    return new this.groupChatModel(data).save();
  }

  async getById(id: mongoose.Types.ObjectId): Promise<GroupChat> {
    return this.groupChatModel.findById(id);
  }

  async getByOwnerId(ownerId: mongoose.Types.ObjectId): Promise<GroupChat[]> {
    return this.groupChatModel.find({ owner: ownerId });
  }

  async updateGroupChat(
    id: mongoose.Types.ObjectId,
    dto: GroupChatDTO,
  ): Promise<GroupChat> {
    const data = {
      owner: new mongoose.Types.ObjectId(dto.owner),
      chat_name: dto.chat_name,
      members: dto.members.map((mem) => new mongoose.Types.ObjectId(mem)),
    };
    return this.groupChatModel.findByIdAndUpdate(id, data);
  }

  async deleteGroupChat(id: mongoose.Types.ObjectId): Promise<GroupChat> {
    return this.groupChatModel.findByIdAndDelete(id);
  }

  async getGroupChatstByStudent(id) {
    return this.groupChatModel.find({ members: new mongoose.Types.ObjectId(id) });
  }
}