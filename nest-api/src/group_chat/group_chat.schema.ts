import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type GroupChatDocument = HydratedDocument<GroupChat>

@Schema()
export class GroupChat {
  @Prop({ required: true})
  owner: mongoose.Types.ObjectId;

  @Prop({ required: true})
  chat_name: string;

  @Prop({ required: true})
  members: mongoose.Types.ObjectId[];
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);