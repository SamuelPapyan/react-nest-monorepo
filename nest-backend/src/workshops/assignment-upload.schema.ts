import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { Student } from "src/students/student.schema";

export type AssignmentUploadDocument = HydratedDocument<AssignmentUpload>

@Schema({minimize: false, timestamps: true})
export class AssignmentUpload {
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Student.name, required: true})
    user: Types.ObjectId;

    @Prop({type: [String], default: []})
    files: Types.ObjectId[] = [];

    @Prop({type: Number, default: 0})
    score: number = 0;
}

export const AssignmentUploadSchema = SchemaFactory.createForClass(AssignmentUpload);