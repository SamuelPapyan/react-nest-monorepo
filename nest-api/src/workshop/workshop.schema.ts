import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type WorkshopDocument = HydratedDocument<Workshop>;

@Schema()
export class Workshop {
    @Prop({ required: true})
    title_en: string;
    
    @Prop({ required: true})
    title_hy: string;

    @Prop({ required: true})
    description_en: string;
    
    @Prop({ required: true})
    description_hy: string;

    @Prop({ required: true})
    start_time: string;

    @Prop({ required: true})
    end_time: string;

    @Prop()
    days: string[];

    @Prop()
    students: string[];

    @Prop({required: false})
    cover_photo: string = null;
}

export const WorkshopSchema = SchemaFactory.createForClass(Workshop);