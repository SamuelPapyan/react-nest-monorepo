import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { MultilangDTO } from "src/interfaces/multilang-dto.interface";

export class WorkshopDTO {
    @IsObject()
    @IsNotEmpty()
    title: MultilangDTO;

    @IsObject()
    description: MultilangDTO;

    @IsNotEmpty()
    start_time: string; // "16:00"

    @IsNotEmpty()
    end_time: string; // "18:00"
    
    days: string[];
}