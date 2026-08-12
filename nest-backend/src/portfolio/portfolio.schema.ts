import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { Student } from "src/students/student.schema";
import { Workshop } from "src/workshops/workshop.schema";

export type PortfolioSchema = HydratedDocument<Portfolio>

@Schema({timestamps: true})
export class Portfolio {
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Student.name, required: true})
    student: Types.ObjectId;
    
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Workshop.name, required: true})
    workshop: Types.ObjectId;

    @Prop({type: String, default: null})
    photo: String;

    @Prop({type: Date, default: new Date()})
    date: Date;

    @Prop(raw({
        en: {type: String},
        am: {type: String}
    }))
    heading: Record<string, any>;
   
    @Prop(raw({
        en: {type: String},
        am: {type: String}
    }))
    description: Record<string, any>;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio)