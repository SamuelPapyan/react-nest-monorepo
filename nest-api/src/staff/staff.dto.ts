import {IsEmail, IsString, Length, IsNotEmpty} from 'class-validator'

export class StaffDTO {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 30)
    password: string;
}
