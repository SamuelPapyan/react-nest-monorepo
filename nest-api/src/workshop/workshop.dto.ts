import { IsNotEmpty, IsString } from "class-validator";

export class WorkshopDTO {
    @IsString()
    @IsNotEmpty()
    title_en: string;
    
    @IsString()
    @IsNotEmpty()
    title_hy: string;

    @IsString()
    description_en: string;
    
    @IsString()
    description_hy: string;

    @IsNotEmpty()
    start_time: string; // "16:00"

    @IsNotEmpty()
    end_time: string; // "18:00"
    
    days: string[];
}