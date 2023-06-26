import { IsString, IsNumberString, IsNotEmpty } from "class-validator";

export class StudentDTO {
  @IsString()
  @IsNotEmpty()
  full_name: string;
  
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
  country: string;
}
