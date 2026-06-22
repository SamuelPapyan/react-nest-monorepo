import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { Staff } from "src/staff/staff.schema";
import { Student } from "src/students/student.schema";

export type WorkshopDocument = HydratedDocument<Workshop>

@Schema({minimize: false, timestamps: true})
export class Workshop {
    @Prop(raw({
        en: {type: String},
        am: {type: String}
    }))
    title: Record<string, any>;
    
    @Prop(raw({
        en: {type: String},
        am: {type: String}
    }))
    description: Record<string, any>;

    @Prop({type: String, required: true})
    startTime: string;
    
    @Prop({type: String, required: true})
    endTime: string;

    @Prop({type: [Date], required: true})
    days: Date[];

    @Prop({type: String, required: true})
    coverPhoto: string;

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Student.name}], default: []})
    students: Types.ObjectId[] = [];
    
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Staff.name, required: true})
    coach: Types.ObjectId = new Types.ObjectId("6948f55872a6d51f9208f670");
}

export const WorkshopSchema = SchemaFactory.createForClass(Workshop);


WorkshopSchema.pre('save', async function(next){
    if (this.isModified('students') && this.students.every(x=>typeof x === 'string')) {
        this.students = this.students.map(x=>new Types.ObjectId(x));
    }
    next();
});