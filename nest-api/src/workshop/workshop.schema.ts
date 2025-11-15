import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { MultilangDTO } from 'src/interfaces/multilang-dto.interface';
import { Student } from 'src/students/student.schema';

export type WorkshopDocument = HydratedDocument<Workshop>;

@Schema()
export class Workshop {
    @Prop({ required: true })
    title: MultilangDTO

    @Prop({ required: true})
    description: MultilangDTO;

    @Prop({ required: true})
    start_time: string;

    @Prop({ required: true})
    end_time: string;

    @Prop()
    days: string[];

    @Prop({type: [Types.ObjectId], ref: Student.name})
    students: Types.ObjectId[];

    @Prop({required: false})
    cover_photo: string = null;
}

export const WorkshopSchema = SchemaFactory.createForClass(Workshop);