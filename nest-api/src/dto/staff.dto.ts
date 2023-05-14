import {IsEmail, Length} from 'class-validator'

export class StaffDTO {
    first_name: string;

    last_name: string;

    @IsEmail()
    email: string;

    username: string;

    @Length(8, 30)
    password: string;
}
