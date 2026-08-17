import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>

enum UserType {
    STAFF = 'Staff',
    STUDENT = 'Student'
}

@Schema({minimize: false, timestamps: true})
export class Comment {

    @Prop({ required: true, type: String, enum: UserType })
    userType: UserType;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'userType', required: true})
    user: Types.ObjectId;

    @Prop({type: String, required: true})
    content: string;

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Comment.name}], default: []})
    comments: Types.ObjectId[] = [];

    @Prop({type: Date})
    date: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);