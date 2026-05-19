import { IMultilangDTO } from "src/interfaces/multilang-dto.interface";

export class ICountry {
    name: IMultilangDTO;
    code: string;
    nativeName: string;
    flag?: string;
}