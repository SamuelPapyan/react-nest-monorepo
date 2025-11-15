import { IsEmail, IsNotEmpty, IsObject, IsString, Length } from 'class-validator';
import { MultilangDTO } from 'src/interfaces/multilang-dto.interface';

export class UserDTO {
  @IsObject()
  @IsNotEmpty()
  first_name: MultilangDTO;

  @IsObject()
  @IsNotEmpty()
  last_name: MultilangDTO;

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
