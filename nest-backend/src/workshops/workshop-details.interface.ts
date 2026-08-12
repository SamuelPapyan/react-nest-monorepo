import { Types } from 'mongoose'

export class IWorkshopDetails {
    _id: Types.ObjectId;
    announcements: Types.ObjectId[];
    assignments: Types.ObjectId[];
    attendees: Types.ObjectId[];
}