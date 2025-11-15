import {
  IsString,
  IsNumberString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsObject
} from 'class-validator';
import mongoose from 'mongoose';

import { MultilangDTO } from 'src/interfaces/multilang-dto.interface';

export class StudentDTO {
  @IsObject()
  @IsNotEmpty()
  full_name: MultilangDTO;

  @IsNumberString()
  @IsNotEmpty()
  age: number;

  @IsNumberString()
  @IsNotEmpty()
  level: number;

  @IsNumberString()
  @IsNotEmpty()
  experience: number;

  @IsNumberString()
  @IsNotEmpty()
  max_experience: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsString()
  country: string;

  @IsString()
  coach: string | { username: string, _id: mongoose.Types.ObjectId };
}