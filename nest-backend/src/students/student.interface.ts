import { IMultilangDTO } from "src/interfaces/multilang-dto.interface";

export class IStudent {
    _id?: string;
    fullName: IMultilangDTO;
    birthDate: Date;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    coach: string;
    country: string;
    level?: number;
    experience?: number;
    max_experience?: number;
}