import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from 'src/roles/role.enum';
import { User, UserDocument } from './user.schema';
import mongoose, { Model } from 'mongoose';
import { UserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { hashConfig } from '../app/config';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async addUser(userDTO: UserDTO): Promise<User> {
    userDTO.password = await bcrypt.hash(
      userDTO.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    userDTO.roles = [Role.Viewer];
    const createdUser = new this.userModel(userDTO);
    return createdUser.save();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username: username });
  }

  async getById(id: mongoose.Types.ObjectId): Promise<User> {
    const user = this.userModel.findById(id);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
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

  async resetPassword(id: mongoose.Types.ObjectId, password: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    user.password = await bcrypt.hash(password, hashConfig.SALT_OR_ROUNDS);
    return user.save();
  }
}
