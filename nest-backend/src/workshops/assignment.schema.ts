import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { Workshop } from "src/workshops/workshop.schema";
import { Student } from "src/students/student.schema";
import { Staff } from "src/staff/staff.schema";
import { Comment } from "src/workshops/comment.schema";
import { AssignmentUpload } from "src/workshops/assignment-upload.schema"

export type AssignmenttDocument = HydratedDocument<Assignment>

@Schema({minimize: false, timestamps: true})
export class Assignment {
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Workshop.name, required: true})
    workshop: Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: Staff.name, required: true})
    user: Types.ObjectId;

    @Prop({type: String, required: true})
    content: string;

    @Prop({type: [String], default: []})
    attachments: string[] = [];

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Comment.name}], default: []})
    comments: Types.ObjectId[] = [];
   
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Comment.name}], default: []})
    privateComments: Types.ObjectId[] = [];

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: AssignmentUpload.name}], default: []})
    uploads: Types.ObjectId[] = [];

    @Prop({type: Date})
    date: Date;

    @Prop({type: Date, default: null})
    deadline: Date | null = null;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);