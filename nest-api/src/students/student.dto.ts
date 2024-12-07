import {
  IsString,
  IsNumberString,
  IsNotEmpty,
  IsEmail,
  Length,
} from 'class-validator';

export class StudentDTO {
  @IsString()
  @IsNotEmpty()
  full_name_en: string;

  @IsString()
  @IsNotEmpty()
  full_name_hy: string;

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
  coach: string;
}
