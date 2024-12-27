import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  first_name_en: string;

  @Prop({ required: true })
  first_name_hy: string;

  @Prop({ requird: true })
  last_name_en: string;
 
  @Prop({ requird: true })
  last_name_hy: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
