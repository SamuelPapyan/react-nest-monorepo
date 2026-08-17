import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { Workshop } from "src/workshops/workshop.schema";
import { Announcement } from "src/workshops/announcement.schema";
import { Assignment } from "src/workshops/assignment.schema";
import { Attendee } from "src/workshops/attendee.schema";

export type WorkshopDetailsDocument = HydratedDocument<WorkshopDetails>

@Schema({minimize: false, timestamps: true})
export class WorkshopDetails {
    @Prop({type: MongooseSchema.Types.ObjectId, ref: Workshop.name, required: true})
    workshop: Types.ObjectId;

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Announcement.name}], default: []})
    announcements: Types.ObjectId[] = [];

    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Assignment.name}], default: []})
    assignments: Types.ObjectId[] = [];
    
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: Attendee.name}], default: []})
    attendees: Types.ObjectId[] = [];
}

export const WorkshopDetailsSchema = SchemaFactory.createForClass(WorkshopDetails);