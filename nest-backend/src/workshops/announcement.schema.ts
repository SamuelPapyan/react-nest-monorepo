import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { Workshop } from "src/workshops/workshop.schema";
import { Comment } from "src/workshops/comment.schema";

export type AnnouncementDocument = HydratedDocument<Announcement>

enum UserType {
    STAFF = 'Staff',
    STUDENT = 'Student'
}

@Schema({minimize: false, timestamps: true})
export class Announcement {
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Workshop.name, required: true})
    workshop: Types.ObjectId;

    @Prop({ required: true, type: String, enum: UserType })
    userType: UserType;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'userType', required: true})
    user: Types.ObjectId;

    @Prop({type: String, required: true})
    content: string;

    @Prop({type: [String], default: []})
    attachments: string[] = [];

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Comment.name}], default: []})
    comments: Types.ObjectId[] = [];

    @Prop({type: Date})
    date: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);