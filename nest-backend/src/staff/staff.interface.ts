import { StaffRole } from "src/enums/staff-role.enum";
import { IMultilangDTO } from "src/interfaces/multilang-dto.interface";

export class IStaff {
    _id: string;
    firstName: IMultilangDTO;
    lastName: IMultilangDTO;
    username: string;
    password: string;
    avatar?: string;
    role: StaffRole;
}