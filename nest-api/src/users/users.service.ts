import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from 'src/roles/role.enum';
import { User, UserDocument } from './user.schema';
import mongoose, { Model } from 'mongoose';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { hashConfig } from '../app/config';
import {
  ResetPassword,
  ResetPasswordDocument,
} from 'src/mail/reset_password.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPasswordDocument>,
  ) {}

  async addUser(userDTO: UserDTO): Promise<User> {
    userDTO.password = await bcrypt.hash(
      userDTO.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    userDTO.roles = [Role.Viewer];
    const createdUser = new this.userModel(userDTO);
    return createdUser.save();
  }

  async findOne(username: string): Promise<User | any> {
    return this.userModel.findOne({ username: username }).lean();
  }

  async getById(id: mongoose.Types.ObjectId): Promise<User> {
    const user = this.userModel.findById(id);
    return user;
  }

  async getUsers(query: string): Promise<User[]> {
    const options = {};
    if (query) {
        options['$or'] = [];
        options['$or'].push({first_name: {$regex: new RegExp(query), $options:"i"}});
        options['$or'].push({last_name: {$regex: new RegExp(query), $options:"i"}});
        options['$or'].push({username: {$regex: new RegExp(query), $options:"i"}});
    }
    return this.userModel.find(options).exec();
  }
  
  async getCoaches(): Promise<string[]> {
    const users = await this.userModel.find({ roles: Role.Coach }).exec();
    return [...users].map((x) => x.username);
  }

  async updateUser(
    id: mongoose.Types.ObjectId,
    userDTO: UserDTO,
  ): Promise<User> {
    userDTO.password = await bcrypt.hash(
      userDTO.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    const user = this.userModel.findByIdAndUpdate(id, userDTO);
    return user;
  }

  async deleteUser(id: mongoose.Types.ObjectId): Promise<User> {
    const user = this.userModel.findByIdAndDelete(id);
    return user;
  }

  async getResetPasswordDto(id: string): Promise<ResetPassword> {
    const data = await this.resetPasswordModel.findOne({
      hashed_id: id,
      user_type: 'user',
    });
    return data;
  }

  async resetPassword(
    id: mongoose.Types.ObjectId,
    password: string,
  ): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    user.password = await bcrypt.hash(password, hashConfig.SALT_OR_ROUNDS);
    await this.resetPasswordModel.findOneAndUpdate(
      { user_id: id, user_type: 'user' },
      { is_used: true },
    );
    return user.save();
  }
}
