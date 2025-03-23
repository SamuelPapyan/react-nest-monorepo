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
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPasswordDocument>,
    private uploadService: UploadService
  ) {}

  async addUser(
    userDTO: UserDTO,
    avatar: Express.Multer.File
  ): Promise<User> {
    userDTO.password = await bcrypt.hash(
      userDTO.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    userDTO.roles = [Role.Viewer];
    const createdUser = new this.userModel(userDTO);
    if (avatar) {
      const avatarUrl = await this.uploadAvatar(avatar, userDTO['username'])
      createdUser.avatar = avatarUrl;
    }
    return createdUser.save();
  }

  private async uploadAvatar(
    avatar: Express.Multer.File,
    username: string,
  ): Promise<string> {
    await this.uploadService.removeFile(`user_data/avatar_${username}`)
    const uploadResult = await this.uploadService.uploadFile(
      avatar,
      `avatar_${username}`,
      'user_data'
    );
    return uploadResult['url'];
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
      options['$or'].push({first_name_en: {$regex: new RegExp(query), $options:"i"}});
      options['$or'].push({last_name_en: {$regex: new RegExp(query), $options:"i"}});
      options['$or'].push({first_name_hy: {$regex: new RegExp(query), $options:"i"}});
      options['$or'].push({last_name_hy: {$regex: new RegExp(query), $options:"i"}});
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
    avatar: Express.Multer.File
  ): Promise<User> {
    userDTO.password = await bcrypt.hash(
      userDTO.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    const user = this.userModel.findByIdAndUpdate(id, userDTO);
    if (avatar) {
      const avatarUrl = await this.uploadAvatar(avatar, userDTO['username']);
      const user = await this.userModel.findById(id);
      user.avatar = avatarUrl;
      return user.save();
    }
    return user;
  }

  async deleteUser(id: mongoose.Types.ObjectId): Promise<User> {
    const tmp = await this.userModel.findById(id);
    const avatar = this.uploadService.getPublicId(tmp.avatar);
    const user = this.userModel.findByIdAndDelete(id);
    this.uploadService.removeFile(avatar).then(console.log);
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
