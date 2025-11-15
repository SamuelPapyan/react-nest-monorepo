import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type GroupChatDocument = HydratedDocument<GroupChat>

@Schema()
export class GroupChat {
  @Prop({ required: true})
  owner: { type: mongoose.Types.ObjectId, ref: 'User'};

  @Prop({ required: true})
  chat_name: string;

  @Prop({ required: true})
  members: [{ type: mongoose.Types.ObjectId, ref: 'Student'}];
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);