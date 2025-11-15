import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MultilangDTO } from 'src/interfaces/multilang-dto.interface';
import * as bcrypt from 'bcrypt';
import { hashConfig } from 'src/app/config';
import { Role } from 'src/roles/role.enum';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ require: true })
  first_name: MultilangDTO

  @Prop({ require: true })
  last_name: MultilangDTO

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  roles: string[];

  @Prop({ required: false})
  avatar: string = null;
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
          this.password,
          hashConfig.SALT_OR_ROUNDS,
        );
  }
  if (this.$isEmpty('roles')) {
    this.roles = [Role.Viewer]
  }
  next();
});
