import { Types } from 'mongoose'
import { IMultilangDTO } from "src/interfaces/multilang-dto.interface";

export class IPortfolio {
    _id?: string;
    student: Types.ObjectId;
    workshop: Types.ObjectId;
    heading: IMultilangDTO;
    description: IMultilangDTO;
    photo: string;
    date: Date;
}