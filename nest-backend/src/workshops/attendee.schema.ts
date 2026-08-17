import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { Student } from "src/students/student.schema";
import { Workshop } from "./workshop.schema";

export type AttendeeDocument = HydratedDocument<Attendee>

@Schema({minimize: false, timestamps: true})
export class Attendee {
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Workshop.name, required: true})
    workshop: Types.ObjectId;
    
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Student.name, required: true})
    user: Types.ObjectId;

    @Prop({type: Date})
    date: Date;

    @Prop({type: String})
    status: String;
}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
