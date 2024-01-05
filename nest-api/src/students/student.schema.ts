import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  experience: number;

  @Prop({ required: true })
  max_experience: number;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true})
  coach: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
