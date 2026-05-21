import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResetPasswordDocument = HydratedDocument<ResetPassword>;

@Schema()
export class ResetPassword {
  @Prop({ required: true })
  user_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  hashed_id: string;

  @Prop({ required: true, default: false })
  is_used: boolean;

  @Prop({ required: true, default: Date.now() + 24 * 3600 * 1000 })
  expiration_date: number;

  @Prop({ required: true })
  user_type: string;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
