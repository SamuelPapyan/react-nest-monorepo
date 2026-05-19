import { IMultilangDTO } from "src/interfaces/multilang-dto.interface";

export class IWorkshop {
    _id?: string;
    title: IMultilangDTO;
    description: IMultilangDTO;
    startTime: string;
    endTime: string;
    days: Date[];
    coverPhoto: string;
    students: string[];
    coach: string;
}