import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters
} from '@nestjs/common'
import { GroupChatService } from './group_chat.service'
import { GroupChatDTO } from './group_chat.dto'
import { GroupChat } from './group_chat.schema'
import mongoose from 'mongoose'
import { ResponseDTO } from 'src/app/response.dto'
import { ResponseManager } from 'src/app/managers/response.manager'
import { NotFoundException } from '@nestjs/common'
import { ExceptionManager } from 'src/app/managers/exception.manager'
import { AllExceptionFilter } from 'src/app/all-exception.filter'
import { Roles } from 'src/roles/roles.decorator'
import { Role } from 'src/roles/role.enum'

@Controller('group_chat')
@UseFilters(AllExceptionFilter)
export class GroupChatController {
  constructor(
    private readonly groupChatService: GroupChatService,
    private readonly responseManager: ResponseManager<GroupChat>,
    private readonly exceptionManager: ExceptionManager,
  ) {}

  @Get('owner/:ownerId')
  @Roles(Role.Coach)
  async getGroupChatsByOwner(
    @Param('ownerId') ownerId: string,
  ): Promise<ResponseDTO<GroupChat[]>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(ownerId);
      const groupChats = await this.groupChatService.getByOwnerId(mongoId);
      return new ResponseManager<GroupChat[]>().getResponse(
        groupChats,
        'GROUP_CHAT_GET',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get(':id')
  @Roles(Role.Coach)
  async getGroupChatById(
    @Param('id') id: string,
  ): Promise<ResponseDTO<GroupChat>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const groupChat = await this.groupChatService.getById(mongoId);
      if (!groupChat) {
        throw new NotFoundException('GROUP_CHAT_NOT_FOUND');
      }
      return this.responseManager.getResponse(groupChat, 'GROUP_CHAT_GET');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post()
  @Roles(Role.Coach)
  async addGroupChat(@Body() dto: GroupChatDTO): Promise<ResponseDTO<GroupChat>> {
    try {
      const groupChat = await this.groupChatService.addGroupChat(dto);
      return this.responseManager.getResponse(groupChat, 'GROUP_CHAT_ADDED');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put(':id')
  @Roles(Role.Coach)
  async updateGroupChat(
    @Body() dto: GroupChatDTO,
    @Param('id') id: string,
  ): Promise<ResponseDTO<GroupChat>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const groupChat = await this.groupChatService.updateGroupChat(mongoId, dto);
      if (!groupChat) {
        throw new NotFoundException('GROUP_CHAT_NOT_FOUND');
      }
      return this.responseManager.getResponse(groupChat, 'GROUP_CHAT_UPDATED')
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Delete(':id')
  @Roles(Role.Coach)
  async deleteGroupChat(
    @Param('id') id: string,
  ): Promise<ResponseDTO<GroupChat>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const groupChat = await this.groupChatService.deleteGroupChat(mongoId);
      if (!groupChat) {
        throw new NotFoundException('GROUP_CHAT_NOT_FOUND');
      }
      return this.responseManager.getResponse(groupChat, 'GROUP_CHAT_DELETED')
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
}