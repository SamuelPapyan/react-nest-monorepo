import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type WorkshopDocument = HydratedDocument<Workshop>;

@Schema()
export class Workshop {
    @Prop({ required: true})
    title: string;

    @Prop({ required: true})
    description: string;

    @Prop({ required: true})
    start_time: string;

    @Prop({ required: true})
    end_time: string;

    @Prop()
    days: string[];
}

export const WorkshopSchema = SchemaFactory.createForClass(Workshop);