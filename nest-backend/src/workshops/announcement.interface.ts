import { Types } from 'mongoose'

export class IAnnouncement {
    _id?: Types.ObjectId;
    workshop: Types.ObjectId;
    userType: string;
    user: Types.ObjectId;
    content: string;
    attachments: string[];
    comments: Types.ObjectId[];
    date: Date;
}