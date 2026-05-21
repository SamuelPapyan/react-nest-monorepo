import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { GroupChatService } from "./group-chat.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { Roles } from "src/roles/roles.decorator";
import { StaffRole } from "src/enums/staff-role.enum";
import { IResponse } from "src/interfaces/response.interface";
import mongoose from "mongoose";
import { messages } from "src/constants/message.constants";
import { IGroupChat } from "./group-chat.interface";

@Controller('group_chat')
export class GroupChatController {
    constructor(
        private readonly groupChatService: GroupChatService,
        private readonly responseManager: ResponseManager,
        private readonly exceptionManager: ExceptionManager,
  ) {}

  @Get('owner/:ownerId')
  @Roles(StaffRole.COACH)
  async getGroupChatsByOwner(
    @Param('ownerId') ownerId: string,
  ): Promise<IResponse | undefined> {
    try {
      const mongoId = new mongoose.Types.ObjectId(ownerId);
      const groupChats = await this.groupChatService.getByOwnerId(mongoId);
      return this.responseManager.getResponse(
        groupChats,
        messages.GROUP_CHATS_GET,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get(':id')
  @Roles(StaffRole.COACH)
  async getGroupChatById(
    @Param('id') id: string,
  ): Promise<IResponse | undefined> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const groupChat = await this.groupChatService.getById(mongoId);
      if (!groupChat) {
        throw new NotFoundException(messages.GROUP_CHAT_NOT_FOUND);
      }
      return this.responseManager.getResponse(groupChat, messages.GROUP_CHAT_GET);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post()
  @Roles(StaffRole.COACH)
  async addGroupChat(@Body() dto: IGroupChat): Promise<IResponse | undefined> {
    try {
      const groupChat = await this.groupChatService.addGroupChat(dto);
      return this.responseManager.getResponse(groupChat, messages.GROUP_CHAT_ADDED);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put(':id')
  @Roles(StaffRole.COACH)
  async updateGroupChat(
    @Body() dto: IGroupChat,
    @Param('id') id: string,
  ): Promise<IResponse | undefined> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const groupChat = await this.groupChatService.updateGroupChat(mongoId, dto);
      if (!groupChat) {
        throw new NotFoundException(messages.GROUP_CHAT_NOT_FOUND);
      }
      return this.responseManager.getResponse(groupChat, messages.GROUP_CHAT_UPDATED)
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Delete(':id')
  @Roles(StaffRole.COACH)
  async deleteGroupChat(
    @Param('id') id: string,
  ): Promise<IResponse | undefined> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const groupChat = await this.groupChatService.deleteGroupChat(mongoId);
      if (!groupChat) {
        throw new NotFoundException(messages.GROUP_CHAT_NOT_FOUND);
      }
      return this.responseManager.getResponse(groupChat, messages.GROUP_CHAT_DELETED)
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
}