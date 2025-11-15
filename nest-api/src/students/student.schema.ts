import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import { hashConfig } from 'src/app/config';
import { MultilangDTO } from 'src/interfaces/multilang-dto.interface';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.schema';

export type StudentDocument = HydratedDocument<Student>;

@Schema()
export class Student {
  @Prop({ require: true})
  full_name: MultilangDTO
  
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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  coach: User;

  @Prop({ required: false})
  avatar: string = null;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      hashConfig.SALT_OR_ROUNDS,
    );
  }
  if (this.isModified('coach') && typeof this.coach === 'string') {
    const UserModel = this.db.model(User.name);
    const coachId = new Types.ObjectId(this.coach);
    const coach = await UserModel.findById(coachId);
    if (!coach) {
      return next(new Error('Coach not found'));
    }
    this.coach = coach._id;
  }
  next();
})
