import { IsNotEmpty, IsString } from "class-validator";

export class WorkshopDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    start_time: string; // "16:00"

    @IsNotEmpty()
    end_time: string; // "18:00"
    
    days: string[];
}