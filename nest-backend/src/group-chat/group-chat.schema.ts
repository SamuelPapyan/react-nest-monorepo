import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type GroupChatDocument = HydratedDocument<GroupChat>

@Schema()
export class GroupChat {
  @Prop({ required: true, type: mongoose.Types.ObjectId})
  owner: { type: mongoose.Types.ObjectId, ref: 'Staff'};

  @Prop({ required: true, type: String})
  chat_name: string;

  @Prop({ required: true, type: [mongoose.Types.ObjectId]})
  members: [{ type: mongoose.Types.ObjectId, ref: 'Student'}];
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);