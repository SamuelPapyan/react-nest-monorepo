import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 10)
  password: string;

  roles: string[];
}
